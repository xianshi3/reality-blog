"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  backgroundImage: string;
  height?: number;
  children?: React.ReactNode;
}

export default function ParallaxSection({
  backgroundImage,
  height = 500,
  children,
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // 判断是否为移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.scrollY);
      setIsAtTop(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 进入视口时触发动画
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 鼠标移动监听
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    
    // 直接获取鼠标在容器内的位置
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    // 计算中心偏移量（用于背景效果）
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const offsetX = (x - centerX) / rect.width;
    const offsetY = (y - centerY) / rect.height;
    
    setMouseOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    
    // 隐藏系统鼠标指针
    if (containerRef.current) {
      containerRef.current.style.cursor = 'none';
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    setMouseOffset({ x: 0, y: 0 });
    
    // 恢复系统鼠标指针
    if (containerRef.current) {
      containerRef.current.style.cursor = 'auto';
    }
  };

  // 计算视差移动距离
  const parallaxOffset = isMobile ? offsetY * 0.3 : offsetY * 0.5;

  // 计算鼠标交互效果
  const mouseMoveX = mouseOffset.x * 20;
  const mouseMoveY = mouseOffset.y * 20;
  const mouseTiltX = mouseOffset.x * 5;
  const mouseTiltY = mouseOffset.y * 5;
  const mouseScale = 1 + Math.abs(mouseOffset.x) * 0.03 + Math.abs(mouseOffset.y) * 0.03;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden group transition-all duration-500"
      style={{
        height: isMobile ? 300 : height,
        width: "110vw",      // 撑满宽度
        marginLeft: "-5vw",    // 左右均匀超出
        marginRight: "-5vw",
        // maxWidth: "100%",    // 防止超出屏幕
        transform: isHovered && !isMobile 
          ? `perspective(1000px) rotateX(${mouseTiltY}deg) rotateY(${-mouseTiltX}deg) scale(1.01)` 
          : "none",
        transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      {/* 现代简约背景 - 添加鼠标交互效果 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: isMobile 
            ? `translateY(${parallaxOffset}px)` 
            : `translateY(${parallaxOffset}px) 
               translateX(${mouseMoveX}px) 
               translateY(${mouseMoveY}px) 
               scale(${mouseScale})`,
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          filter: "none",
        }}
      />
      
      
      
      {/* 渐变遮罩 - 与背景同步移动 */}
      <div 
        className="absolute inset-0 will-change-transform"
        style={{
          transform: isMobile 
            ? `translateY(${parallaxOffset}px)` 
            : `translateY(${parallaxOffset}px) 
               translateX(${mouseMoveX * 0.5}px) 
               translateY(${mouseMoveY * 0.5}px)`,
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          opacity: isHovered && !isMobile ? 0.9 : 1,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-purple-900/5" />
      </div>
      
      {/* 前景内容层 - 添加鼠标交互效果 */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-white pointer-events-none">
        <div
          className={`text-center max-w-4xl w-full transition-all duration-700 ease-out ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{
            transform: isHovered && !isMobile 
              ? `translateY(${mouseOffset.y * -10}px) translateX(${mouseOffset.x * -10}px)` 
              : "none",
            textShadow: isHovered && !isMobile 
              ? "0 0 15px rgba(255,255,255,0.5)" 
              : "none",
          }}
        >
          {children}
        </div>
      </div>
      
      {/* 自定义鼠标指针 - 替代系统指针 */}
      {!isMobile && (
        <div 
          className="absolute z-50 pointer-events-none transition-opacity duration-300"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            transform: "translate(-50%, -50%)",
            opacity: isHovered ? 1 : 0,
            display: isHovered ? 'block' : 'none',
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            </div>
            <span className="text-xs text-white/80 mt-2 whitespace-nowrap bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm transition-all duration-500"
                  style={{ opacity: Math.sqrt(mouseOffset.x ** 2 + mouseOffset.y ** 2) * 2 }}>
              Reality Blog
            </span>
          </div>
        </div>
      )}
      
      {/* 现代滚动指示器 */}
      {!isMobile && (
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none transition-opacity duration-700`}
          style={{
            opacity: isAtTop ? 1 : 0, // 根据是否在顶部显示/隐藏
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs text-white/80 mb-2 tracking-widest">SCROLL</span>
            <div className="w-px h-8 bg-white/60 overflow-hidden">
              <div 
                className="w-full h-6 bg-white"
                style={{
                  animation: "scrollIndicator 2s infinite",
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* 动画样式 */}
      <style jsx>{`
        @keyframes scrollIndicator {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(250%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}