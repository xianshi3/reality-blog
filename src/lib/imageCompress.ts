// 大图上传前的浏览器端压缩
//
// 线上部署链路为 Cloudflare -> Vercel，Vercel Serverless 对单次请求体有 4.5MB 硬上限，
// 超过会在函数执行前直接返回 413（请求根本到不了 /api/storage，服务端无法给出友好提示）。
// 因此超大图先在浏览器里缩放 + 有损压缩到上限以内，再发起上传。

/** Vercel Serverless 请求体上限，客户端据此判断并给出友好提示 */
export const MAX_UPLOAD_BYTES = 4.5 * 1024 * 1024;

/** 压缩目标大小，为 multipart 边界/头部开销留余量 */
const TARGET_MAX_BYTES = 3.5 * 1024 * 1024;

/** 缩放后最长边像素上限（博客配图足够清晰，同时显著降低体积） */
const MAX_DIMENSION = 4096;

const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.45;
const QUALITY_STEP = 0.15;
const SCALE_STEP = 0.7;
/** 最多编码次数，避免在临界值上反复消耗 CPU */
const MAX_ROUNDS = 6;

/** 保留原样上传的类型：动图/矢量图重编码会丢失内容 */
const PRESERVE_TYPES = new Set(["image/gif", "image/svg+xml"]);

export interface CompressedImage {
  blob: Blob;
  name: string;
}

export function formatBytes(size: number): string {
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
  return (size / (1024 * 1024)).toFixed(1) + " MB";
}

interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // 某些格式/浏览器不支持，回退到 <img> 解码
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("图片解码失败"));
      el.src = url;
    });
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

/** 浏览器是否支持 canvas 编码 WebP（Safari 旧版本只解码不编码），结果缓存 */
let webpEncodeSupported: Promise<boolean> | null = null;

function supportsWebpEncode(): Promise<boolean> {
  if (!webpEncodeSupported) {
    webpEncodeSupported = new Promise((resolve) => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        canvas.toBlob((blob) => resolve(blob?.type === "image/webp"), "image/webp");
      } catch {
        resolve(false);
      }
    });
  }
  return webpEncodeSupported;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("图片编码失败"))),
      type,
      quality
    );
  });
}

function extensionFor(type: string): string {
  if (type === "image/webp") return "webp";
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  return "";
}

function renameWith(blob: Blob, originalName: string): string {
  const ext = extensionFor(blob.type);
  if (!ext) return originalName;
  const base = originalName.replace(/\.[^.]+$/, "") || originalName;
  return `${base}.${ext}`;
}

function isWorthCompressing(file: File): boolean {
  if (!file.type.startsWith("image/")) return false;
  // 小文件直接原样上传，避免无谓的画质损失与 CPU 开销
  if (file.size <= TARGET_MAX_BYTES) return false;
  // 动图/矢量图重编码会丢内容，保持原样（若仍超限由 upload.ts 给出明确提示）
  if (PRESERVE_TYPES.has(file.type)) return false;
  return true;
}

/**
 * 图片过大时自动缩放 + 压缩，其余情况原样返回。
 * 解码/编码失败会向上抛出，调用方可回退为原文件直传。
 */
export async function compressImage(file: File): Promise<CompressedImage> {
  if (!isWorthCompressing(file)) return { blob: file, name: file.name };

  const decoded = await decodeImage(file);
  try {
    if (!decoded.width || !decoded.height) return { blob: file, name: file.name };

    const useWebp = await supportsWebpEncode();
    const encodeType = useWebp ? "image/webp" : "image/jpeg";

    const baseScale = Math.min(1, MAX_DIMENSION / Math.max(decoded.width, decoded.height));

    let scale = baseScale;
    let quality = INITIAL_QUALITY;
    let smallest: { blob: Blob; type: string } | null = null;

    for (let round = 0; round < MAX_ROUNDS; round++) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(decoded.width * scale));
      canvas.height = Math.max(1, Math.round(decoded.height * scale));

      const ctx = canvas.getContext("2d");
      if (!ctx) break;

      // JPEG 没有透明通道，先铺白底避免透明区域变黑
      if (encodeType === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToBlob(canvas, encodeType, quality);
      if (!smallest || blob.size < smallest.blob.size) {
        smallest = { blob, type: blob.type || encodeType };
      }
      if (blob.size <= TARGET_MAX_BYTES) {
        return { blob, name: renameWith(blob, file.name) };
      }

      // 先降质量，质量触底后再降分辨率
      if (quality > MIN_QUALITY) {
        quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
      } else {
        quality = INITIAL_QUALITY;
        scale *= SCALE_STEP;
      }
    }

    // 多轮仍未达标：返回最小的一版，由 upload.ts 在被平台拒绝时给出友好提示
    if (smallest) {
      return { blob: smallest.blob, name: renameWith(smallest.blob, file.name) };
    }
    return { blob: file, name: file.name };
  } finally {
    decoded.close();
  }
}
