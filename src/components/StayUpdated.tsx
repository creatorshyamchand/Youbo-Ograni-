import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, X, Maximize2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export interface UpdatePost {
  id: string;
  title: string;
  description: string;
  images: string[];
  createdAt?: any;
}

export const StayUpdated = () => {
  const [updates, setUpdates] = useState<UpdatePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [noMorePostsMsg, setNoMorePostsMsg] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as UpdatePost));
      setUpdates(docs);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Reset image index when changing current post
  useEffect(() => {
    setCurrentImgIndex(0);
  }, [currentPostIndex]);

  // Auto-slide image every 5 seconds (5000ms) for current post
  useEffect(() => {
    if (updates.length === 0) return;
    const currentPost = updates[currentPostIndex];
    if (!currentPost || !currentPost.images || currentPost.images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % currentPost.images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [updates, currentPostIndex]);

  const handleNextPost = () => {
    if (updates.length <= 1) {
      setNoMorePostsMsg(true);
      setTimeout(() => setNoMorePostsMsg(false), 3000);
      return;
    }
    setCurrentPostIndex((prev) => (prev + 1) % updates.length);
  };

  const currentPost = updates[currentPostIndex];

  const formatPostDate = (timestamp: any) => {
    if (!timestamp) return 'আজই পোস্ট করা হয়েছে';
    try {
      if (timestamp.toDate) {
        return format(timestamp.toDate(), 'PPP, p');
      }
      return format(new Date(timestamp), 'PPP, p');
    } catch {
      return 'সংরক্ষিত সময়';
    }
  };

  return (
    <div className="py-20 bg-emerald-50/40 border-y border-emerald-100/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Stay Updated
          </h2>
          <p className="text-emerald-700 md:text-lg font-medium tracking-wide">
            With Youbo Ogroni social  and welfare trust.
          </p>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mt-4"></div>
        </div>

        {/* Content Container */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-emerald-100 max-w-2xl mx-auto">
            <p className="text-gray-500 font-medium">আপডেট লোড হচ্ছে...</p>
          </div>
        ) : updates.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-emerald-100 max-w-2xl mx-auto">
            <p className="text-gray-600 font-semibold text-lg mb-2">no post avilable Right now .</p>
            <p className="text-gray-400 text-sm">নতুন পোস্ট যুক্ত করা হলে এখানে প্রদর্শিত হবে।</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 overflow-hidden max-w-3xl mx-auto">
            
            {/* Header / Title */}
            <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
              <span className="inline-block bg-emerald-500/30 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                সর্বশেষ আপডেট ({currentPostIndex + 1}/{updates.length})
              </span>
              <h3 className="text-2xl md:text-3xl font-bold leading-snug">
                {currentPost.title}
              </h3>
            </div>

            {/* Image Carousel */}
            {currentPost.images && currentPost.images.length > 0 && (
              <div className="relative bg-black group h-[300px] sm:h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImgIndex}
                    src={currentPost.images[currentImgIndex]}
                    alt={`Slide ${currentImgIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => setLightboxImage(currentPost.images[currentImgIndex])}
                  />
                </AnimatePresence>

                {/* Lightbox hint icon */}
                <button
                  onClick={() => setLightboxImage(currentPost.images[currentImgIndex])}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-opacity opacity-80 hover:opacity-100 z-10"
                  title="Click to enlarge"
                >
                  <Maximize2 size={18} />
                </button>

                {/* Image Navigation Arrows */}
                {currentPost.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev - 1 + currentPost.images.length) % currentPost.images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-80 hover:opacity-100 focus:outline-none z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={() => setCurrentImgIndex((prev) => (prev + 1) % currentPost.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all opacity-80 hover:opacity-100 focus:outline-none z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight size={22} />
                    </button>

                    {/* Image Counter Badge */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm z-10">
                      {currentImgIndex + 1} / {currentPost.images.length}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Description & Footer Details */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="prose prose-emerald max-w-none">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed whitespace-pre-line font-normal">
                  {currentPost.description}
                </p>
              </div>

              {/* Date & Time */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center text-sm text-gray-500 gap-2">
                <p className="font-medium">
                  📅 {formatPostDate(currentPost.createdAt)}
                </p>
              </div>

              {/* Change Post Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleNextPost}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Change post</span>
                  <ArrowRight size={18} />
                </button>

                {noMorePostsMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-amber-600 font-semibold text-sm bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
                  >
                    no post avilable Right now .
                  </motion.p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Lightbox / Fullscreen Image Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Close image modal"
              >
                <X size={24} />
              </button>

              <img
                src={lightboxImage}
                alt="Enlarged update image"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
