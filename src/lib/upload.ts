import { compressImage, formatBytes, MAX_UPLOAD_BYTES } from "@/lib/imageCompress";

export type UploadProgress = (bytesUploaded: number, totalBytes: number) => void;

// 被平台拒绝（413）时的友好提示：Vercel Serverless 请求体上限 4.5MB
function tooLargeMessage(size: number): string {
  const limit = formatBytes(MAX_UPLOAD_BYTES);
  return `图片过大（${formatBytes(size)}），超过服务器 ${limit} 上传上限，请换更小的图片或手动压缩后再传`;
}

// 经服务端鉴权接口上传（/api/storage，需登录），
// 服务端使用 service role 落存储，客户端不再持有匿名直传能力
async function uploadViaXHR(
  file: File,
  onProgress?: UploadProgress
): Promise<string> {
  // 超大图先在浏览器内缩放压缩，避免超过平台 4.5MB 请求体上限被 413 拒绝；
  // 压缩失败（解码异常等）时回退为原文件直传
  const { blob, name } = await compressImage(file).catch(() => ({
    blob: file as Blob,
    name: file.name,
  }));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/storage");

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(e.loaded, e.total);
        }
      };
    }

    xhr.onload = () => {
      let message = "";
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          if (data.url) {
            resolve(data.url);
            return;
          }
          message = data.error || "上传失败";
        } else if (xhr.status === 413) {
          message = tooLargeMessage(blob.size);
        } else {
          message = data.error || `上传失败（HTTP ${xhr.status}）`;
        }
      } catch {
        if (xhr.status === 413) {
          message = tooLargeMessage(blob.size);
        } else {
          message = xhr.status >= 200 && xhr.status < 300
            ? "上传响应解析失败"
            : `上传失败（HTTP ${xhr.status}）`;
        }
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error("网络错误，请检查连接"));
    xhr.ontimeout = () => reject(new Error("上传超时"));

    const formData = new FormData();
    // 压缩后可能是 Blob，必须显式带上文件名（服务端按扩展名校验类型）
    formData.append("file", blob, name);
    xhr.send(formData);
  });
}

// 普通上传（无进度回调）
export async function uploadImage(file: File): Promise<string> {
  return uploadViaXHR(file);
}

// 带实时进度回调的上传（大文件上传时展示进度条）
export async function uploadImageWithProgress(
  file: File,
  onProgress: UploadProgress
): Promise<string> {
  return uploadViaXHR(file, onProgress);
}
