import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, ArrowLeft, Download } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Layout';

export const AllGalleryPage = () => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setImages(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, []);

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `youbo-ograni-image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback for CORS issues with download
      window.open(url, '_blank');
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-sm py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <Link to="/" className="text-emerald-700 hover:text-emerald-800 transition-colors mr-4">
            <ArrowLeft size={24} />
          </Link>
          <div className="text-2xl font-bold tracking-tight text-emerald-700">
            যুব অগ্রণী
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-emerald-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-200 text-lg md:text-xl font-medium tracking-wider uppercase mb-4"
          >
            Youbo Ogroni Social And Welfare Trust
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight"
          >
            সম্পূর্ণ গ্যালারি
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-emerald-400 mx-auto rounded-full mb-8"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100 font-medium max-w-3xl mx-auto"
          >
            আমাদের সমাজ গঠনের প্রতিটি মুহূর্তের ছবি
          </motion.p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {images.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">কোনো ছবি পাওয়া যায়নি।</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {images.map((img, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                key={idx} 
                onClick={() => setSelectedIndex(idx)} 
                className="break-inside-avoid overflow-hidden rounded-2xl group relative bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={img.url} 
                  alt={`Gallery image ${idx + 1}`} 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          >
            {/* Top Bar */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
              <div className="text-white/60 text-sm font-medium px-4">
                {selectedIndex + 1} / {images.length}
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleDownload(images[selectedIndex].url)} 
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
                  title="Download Image"
                >
                  <Download size={24} />
                </button>
                <button 
                  onClick={() => setSelectedIndex(null)} 
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all z-50 backdrop-blur-sm"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all z-50 backdrop-blur-sm"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image */}
            <div className="w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={() => setSelectedIndex(null)}>
              <motion.img 
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                src={images[selectedIndex].url} 
                alt="Full screen gallery" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};
