import { useEffect, useState, useRef } from 'react';

interface Props {
  src: string;      // R2 URL
  poster: string;   // 썸네일 URL
}

export default function R2VideoPlayer({ src, poster }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If hydration attaches after media is already ready, sync state immediately.
    if (video.readyState >= 2) {
      setIsLoaded(true);
    }
  }, []);


  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-900 shadow-2xl">
      {/* 로딩 스켈레톤: 영상이 준비되기 전까지 표시 */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 animate-pulse">
          <span className="text-slate-500 font-medium text-sm">Loading Demo...</span>
        </div>
      )}

      {hasError && (
        poster ? (
          <img
            src={poster}
            alt="Project demo poster"
            className="w-full object-cover"
          />
        ) : (
          <div className="flex min-h-[220px] items-center justify-center bg-slate-800 text-sm text-slate-300">
            Demo media is unavailable.
          </div>
        )
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        controls
        muted
        autoPlay
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        onCanPlay={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${hasError ? 'hidden' : ''}`}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}