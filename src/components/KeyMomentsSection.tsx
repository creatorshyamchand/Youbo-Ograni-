import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Play, ArrowRight, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface KeyMomentVideo {
  id: string;
  filename: string;
  videoUrl?: string;
  title: string;
  text: string;
  showInHome: boolean;
  createdAt?: any;
}

export const resolveVideoPath = (filename: string): string => {
  if (!filename) return '';
  return filename.trim();
};

export const KeyMomentsSection = () => {
  const [videos, setVideos] = useState<KeyMomentVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'keymoments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as KeyMomentVideo));
      // Filter for videos to show in home (max 2), fallback to first 2 if none flagged
      const homeVideos = all.filter((v) => v.showInHome);
      if (homeVideos.length > 0) {
        setVideos(homeVideos.slice(0, 2));
      } else {
        setVideos(all.slice(0, 2));
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-emerald-50/30 border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-emerald-700 font-bold tracking-wider uppercase mb-2 text-sm md:text-base">
            Youbo Ogroni Social and Walfare Trust
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Key Moments
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-3"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            আমাদের গুরুত্বপূর্ণ কার্যক্রম ও বিশেষ মুহূর্তের ভিডিও চিত্র
          </p>
        </div>

        {/* Videos Grid (2 videos layout: 1 | 2) */}
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center max-w-md mx-auto">
            <p className="text-gray-500 font-medium">ভিডিও লোড হচ্ছে...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-emerald-100 shadow-sm text-center max-w-xl mx-auto">
            <Video className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-60" />
            <p className="text-gray-700 font-bold text-lg mb-1">কোনো ভিডিও এখনো যুক্ত করা হয়নি</p>
            <p className="text-gray-500 text-sm">অ্যাডমিন প্যানেল থেকে নতুন কি মোমেন্টস ভিডিও যুক্ত করা যাবে।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {videos.map((video, idx) => {
              const baseSrc = video.videoUrl || resolveVideoPath(video.filename);
              const src = baseSrc.includes('#') ? baseSrc : `${baseSrc}#t=0.001`;

              return (
                <motion.div
                  key={video.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.15 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-emerald-100 flex flex-col group cursor-pointer"
                  onClick={() => navigate(`/key-moments?play=${video.id}`)}
                >
                  {/* Video Player / Preview Area */}
                  <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    <video
                      src={src}
                      preload="metadata"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      muted
                      playsInline
                      onError={(e) => console.error("Thumbnail load error:", e)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-300">
                        <Play size={28} className="ml-1 fill-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-emerald-700/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Moment #{idx + 1}
                    </div>
                  </div>

                  {/* Details Area */}
                  <div className="p-6 md:p-7 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base line-clamp-3 leading-relaxed">
                        {video.text}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-emerald-700 font-bold text-sm flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                        ভিডিওটি দেখুন <ArrowRight size={16} />
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {video.filename}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Watch More Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/key-moments')}
            className="inline-flex items-center gap-3 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg group"
          >
            <span>Watch More</span>
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
