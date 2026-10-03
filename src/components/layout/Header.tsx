import Navbar from "./Navbar";
import ParallaxSection from "./ParallaxSection";

interface HeaderProps {
  /** 视差背景图地址 */
  parallaxImage?: string;
  /** 视差主标题 */
  parallaxTitle?: string;
  /** 视差副标题 */
  parallaxSubtitle?: string;
}

/**
 * 页面顶部区域
 * 由「固定导航栏」和「视差大图（Hero）」两部分组成，用于首页顶部展示。
 */
export default function Header({
  parallaxImage = "/parallax-bg.png",
  parallaxTitle = "Reality Blog",
  parallaxSubtitle = "探索技术与世界的边界",
}: HeaderProps) {
  return (
    <>
      {/* 固定顶部导航栏 */}
      <Navbar />

      {/* 视差大图（Hero）
          导航栏是 fixed 固定在页面顶部，会悬浮遮住最上方的内容，
          所以这里用 pt-16 / sm:pt-20 给大图留出与导航栏之间的一点距离，
          避免大图紧贴顶部被导航栏遮挡。 */}
      <div className="w-full overflow-hidden pt-16 shadow-xl animate-fadeInDown transition-transform duration-700 ease-in-out hover:scale-105 sm:pt-20 sm:hover:scale-100">
        <ParallaxSection backgroundImage={parallaxImage} height={450}>
          {parallaxTitle && (
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
              {parallaxTitle}
            </h1>
          )}
          {parallaxSubtitle && (
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
              {parallaxSubtitle}
            </p>
          )}
        </ParallaxSection>
      </div>
    </>
  );
}
