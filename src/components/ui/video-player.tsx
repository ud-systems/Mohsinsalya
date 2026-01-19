import { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  className?: string;
  aspectRatio?: string;
}

export function VideoPlayer({ src, className, aspectRatio = 'aspect-video' }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isYoutube, setIsYoutube] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Parse URL to check if it's YouTube
  useEffect(() => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = src.match(youtubeRegex);
    if (match && match[1]) {
      setIsYoutube(true);
      setVideoId(match[1]);
    } else {
      setIsYoutube(false);
      setVideoId(null);
    }
  }, [src]);

  // Handle native video play/pause
  useEffect(() => {
    if (!isYoutube && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log("Auto-play blocked:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isYoutube]);

  const togglePlay = (e: React.MouseEvent) => {
    if (isYoutube) {
      // For YouTube, we send messages to the iframe if we wanted full control,
      // but for simplicity with autoplay/mute, we'll just toggle the overlay.
      // Note: YouTube iframe doesn't support play/pause via simple click without API.
      // We toggle our local state to show/hide the play button overlay.
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // YouTube embed URL with parameters for autoplay, loop, and hide controls
  const youtubeSrc = isYoutube && videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1` 
    : '';

  return (
    <div 
      className={cn("relative group cursor-pointer overflow-hidden rounded-xl bg-black/5", aspectRatio, className)}
      onClick={togglePlay}
    >
      {isYoutube ? (
        <div className={cn("w-full h-full pointer-events-none transition-opacity duration-500", !isPlaying && "opacity-50")}>
          <iframe
            ref={iframeRef}
            src={youtubeSrc}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          autoPlay
        />
      )}

      {/* Play Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-white/20 border border-white/40 backdrop-blur-md text-white">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/20 border border-white/20 backdrop-blur-md text-white hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 z-20"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      {/* Overlay info */}
      <div className={cn(
        "absolute inset-0 border-2 border-primary/0 transition-all duration-500 pointer-events-none z-0",
        !isPlaying && "border-primary/20"
      )} />
    </div>
  );
}
