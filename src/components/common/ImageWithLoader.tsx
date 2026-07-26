"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa6";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export default function ImageWithLoader({
  src,
  alt,
  className = "",
  wrapperClassName = "",
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, []);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${wrapperClassName || "w-full h-32"}`}>
        <span className="text-xs text-gray-400">加载失败</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg">
          <FaSpinner className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        loading="lazy"
      />
    </div>
  );
}
