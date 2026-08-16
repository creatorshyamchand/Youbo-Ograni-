import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize, Gauge, Video, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KeyMomentVideo, resolveVideoPath } from '../components/KeyMomentsSection';

export const KeyMomentsPage = () => {
  const [videos, setVideos] = useState<KeyMomentVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<KeyMomentVideo | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Video Player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<any>(null);

  // Fetch logo from settings
  useEffect(() => {
    getDoc(doc(db, 'settings', 'keymoments')).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      }
    }).catch(console.error);
  }, []);

  // Fetch videos
  useEffect(() => {
    const q = query(collection(db, 'keymoments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as KeyMomentVideo));
      setVideos(docs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Handle URL query ?play=ID
  useEffect(() => {
    const playId = searchParams.get('play');
    if (playId && videos.length > 0) {
      const target = videos.find((v) => v.id === playId);
      if (target) {
        setActiveVideo(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [searchParams, videos]);

  const selectVideo = (video: KeyMomentVideo) => {
    setActiveVideo(video);
    setSearchParams({ play: video.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearActiveVideo = () => {
    setActiveVideo(null);
    setSearchParams({});
    setIsPlaying(false);
  };

  // Video player logic
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedCycle = () => {
    let nextSpeed: 1 | 1.5 | 2 = 1;
    if (speed === 1) nextSpeed = 1.5;
    else if (speed === 1.5) nextSpeed = 2;
    else nextSpeed = 1;

    setSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 1;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col selection:bg-emerald-200">
      
      {/* Top Banner Navigation */}
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (activeVideo) {
                  clearActiveVideo();
                } else {
                  navigate('/');
                }
              }}
              className="p-2 bg-emerald-800/80 hover:bg-emerald-700 active:bg-emerald-600 rounded-xl text-white transition-colors flex items-center gap-1.5 text-sm font-semibold"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
              <span>{activeVideo ? 'Back to List' : 'Back to Home'}</span>
            </button>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-emerald-100 hidden sm:block">
              Key Moments
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium text-emerald-200 bg-emerald-800/60 px-3 py-1.5 rounded-full">
              Youbo Ogroni
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* ================= IF ACTIVE VIDEO SELECTED: VIDEO PLAYER VIEW ================= */}
        {activeVideo ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            
            {/* Header with Back Button */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <button
                onClick={clearActiveVideo}
                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-bold text-base transition-colors"
              >
                <ArrowLeft size={20} />
                <span>ভিডিও তালিকায় ফিরে যান (Back to list)</span>
              </button>
            </div>

            {/* Video Title */}
            <div>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                Now Playing
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {activeVideo.title}
              </h2>
            </div>

            {/* Video Player Component with Full Controls */}
            <div
              ref={playerContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
              className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group border border-emerald-950/20 select-none"
            >
              <video
                ref={videoRef}
                src={activeVideo.videoUrl || resolveVideoPath(activeVideo.filename)}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
                onLoadedMetadata={() => {
                  if (videoRef.current) setDuration(videoRef.current.duration);
                }}
                onEnded={() => setIsPlaying(false)}
                playsInline
              />

              {/* Big Center Play/Pause Overlay Button */}
              {(!isPlaying || showControls) && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-opacity cursor-pointer"
                >
                  <button
                    className="w-20 h-20 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl hover:bg-emerald-500 hover:scale-110 active:scale-95 transition-all"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={36} /> : <Play size={36} className="ml-1 fill-white" />}
                  </button>
                </div>
              )}

              {/* Bottom Custom Controls Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 md:p-6 transition-opacity duration-300 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Timeline Scrubber */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-white/90 font-mono min-w-[40px]">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:h-2 transition-all"
                  />
                  <span className="text-xs font-semibold text-white/70 font-mono min-w-[40px]">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons row */}
                <div className="flex items-center justify-between text-white flex-wrap gap-2">
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Play/Pause */}
                    <button
                      onClick={togglePlay}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={22} /> : <Play size={22} className="fill-white" />}
                    </button>

                    {/* Skip -10s */}
                    <button
                      onClick={() => handleSkip(-10)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                      title="Skip back 10 seconds"
                    >
                      <RotateCcw size={20} />
                    </button>

                    {/* Skip +10s */}
                    <button
                      onClick={() => handleSkip(10)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                      title="Skip forward 10 seconds"
                    >
                      <RotateCw size={20} />
                    </button>

                    {/* Volume & Mute */}
                    <div className="flex items-center gap-2 group/vol">
                      <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-16 md:w-20 h-1 bg-white/40 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Speed Toggle (1x, 1.5x, 2x only) */}
                    <button
                      onClick={handleSpeedCycle}
                      className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1.5 transition-colors border border-white/10"
                      title="Toggle Speed (1x, 1.5x, 2x)"
                    >
                      <Gauge size={16} />
                      <span>{speed}x Speed</span>
                    </button>

                    {/* Fullscreen Toggle */}
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      title="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo with circle of Youbo Ogroni */}
            <div className="flex items-center gap-4 p-5 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl shadow-sm">
              <div className="w-16 h-16 rounded-full border-2 border-emerald-600 bg-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Youbo Ogroni Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback icon if logo url fails to load
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex flex-col items-center justify-center font-bold text-xs">
                    <span>YO</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-bold text-emerald-950">
                  Youbo Ogroni Social and Walfare Trust
                </h4>
                <p className="text-xs md:text-sm text-emerald-700 font-medium">
                  Official Key Moments Archive • যুব ও সমাজকল্যাণ ট্রাস্ট
                </p>
              </div>
            </div>

            {/* Description Text */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3">
                বিবরণ / Description
              </h3>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {activeVideo.text}
              </p>
            </div>

            {/* Go back button again */}
            <div className="pt-4 text-center">
              <button
                onClick={clearActiveVideo}
                className="bg-gray-800 hover:bg-gray-900 active:bg-black text-white font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 mx-auto text-base"
              >
                <ArrowLeft size={18} />
                <span>Go Back (ভিডিও তালিকায় ফিরে যান)</span>
              </button>
            </div>

          </div>
        ) : (
          /* ================= LIST VIEW: 2 COLUMN GRID (1 | 2) ================= */
          <div className="space-y-12">
            
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} /> Video Gallery
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Key Moments
              </h2>
              <p className="text-emerald-700 font-medium text-lg">
                Youbo Ogroni Social and Walfare Trust
              </p>
              <p className="text-gray-600 text-sm md:text-base">
                যেকোনো ভিডিওর ওপর ক্লিক করে বিস্তারিত বিবরণ সহ সম্পূর্ণ ভিডিওটি উপভোগ করুন।
              </p>
            </div>

            {/* Videos in 2-column grid layout (1 | 2) */}
            {loading ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center max-w-md mx-auto">
                <p className="text-gray-500 font-medium">ভিডিও লোড হচ্ছে...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-emerald-100 shadow-sm text-center max-w-xl mx-auto space-y-3">
                <Video className="w-16 h-16 text-emerald-500 mx-auto opacity-50" />
                <p className="text-gray-800 font-bold text-xl">কোনো ভিডিও এখনো যোগ করা হয়নি</p>
                <p className="text-gray-500 text-sm">
                  অ্যাডমিন প্যানেল থেকে ভিডিও যুক্ত করা হলে এখানে ২-কলাম গ্রিডে প্রদর্শিত হবে।
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
                >
                  হোম পেজে ফিরে যান
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {videos.map((video, index) => {
                  const src = video.videoUrl || resolveVideoPath(video.filename);
                  return (
                    <div
                      key={video.id || index}
                      onClick={() => selectVideo(video)}
                      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-emerald-100/80 flex flex-col group cursor-pointer"
                    >
                      {/* Video Thumbnail / Preview */}
                      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                        <video
                          src={src}
                          preload="metadata"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-600/90 group-hover:bg-emerald-500 group-hover:scale-110 text-white flex items-center justify-center shadow-xl transition-all">
                            <Play size={28} className="ml-1 fill-white" />
                          </div>
                        </div>

                        {/* Top Indicator */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-emerald-800/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                            Video #{index + 1}
                          </span>
                          {video.showInHome && (
                            <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                              Featured on Home
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                            {video.text}
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                            সম্পূর্ণ ভিডিও দেখুন <Play size={14} className="fill-emerald-700" />
                          </span>
                          <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]">
                            {video.filename}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Return Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-700 font-bold text-sm bg-white px-6 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all"
              >
                <ArrowLeft size={16} />
                <span>মূল ওয়েবসাইটে ফিরে যান (Back to Home)</span>
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
};
