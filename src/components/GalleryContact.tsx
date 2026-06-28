import { useState, useEffect } from 'react';
import { Send, MapPin, Phone, Mail, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const defaultImages: string[] = [];

export const Gallery = () => {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gallery'), (snap) => {
      if (!snap.empty) {
        // filter images that have showInHome = true
        const homeImages = snap.docs.filter(d => d.data().showInHome).map(d => d.data().url);
        // Only show up to 10
        if (homeImages.length > 0) {
          setImages(homeImages.slice(0, 10));
        } else {
          setImages([]);
        }
      } else {
        setImages([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="py-24 bg-white min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">গ্যালারি</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">ছবি লোড হচ্ছে...</div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-500 py-12">কোনো ছবি পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((src, idx) => (
              <div key={idx} onClick={() => setSelectedImg(src)} className="cursor-pointer overflow-hidden rounded-2xl group relative bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 aspect-square">
                <img 
                  src={src} 
                  alt={`Gallery image ${idx + 1}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link to="/gallery" className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-md">
            আরও ছবি দেখুন
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
            <button onClick={() => setSelectedImg(null)} className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full transition-colors z-50">
              <X size={32} />
            </button>
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }} 
              src={selectedImg} 
              alt="Full screen gallery" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        timestamp: new Date()
      });
      alert('আপনার বার্তা গৃহীত হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      alert('দুঃখিত, কোনো একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
    setSubmitting(false);
  };

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">যোগাযোগ করুন</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Left Form */}
          <div className="p-8 md:p-12 lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">সম্পূর্ণ নাম <span className="text-emerald-500">*</span></label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" placeholder="আপনার নাম লিখুন" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ইমেইল ঠিকানা <span className="text-emerald-500">*</span></label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ফোন নম্বর</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" placeholder="আপনার ফোন নম্বর" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">বিষয় <span className="text-emerald-500">*</span></label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium" placeholder="যোগাযোগের কারণ" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">আপনার বার্তা <span className="text-emerald-500">*</span></label>
                <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium resize-none" placeholder="আপনার বিস্তারিত বার্তা এখানে লিখুন..." />
              </div>
              <button disabled={submitting} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/30">
                <Send size={20} />
                <span className="text-lg">{submitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
              </button>
            </form>
            <div className="mt-8 text-center border-t border-gray-100 pt-6">
               <a href="https://instagram.com/creator_shyamchand_07" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-emerald-600 font-medium transition-colors">Powered by Youbo Ograni</a>
            </div>
          </div>

          {/* Right Info */}
          <div className="bg-emerald-900 p-8 md:p-12 text-white flex flex-col justify-center lg:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-10 text-white">যোগাযোগের তথ্য</h3>
              <div className="space-y-10">
                <div className="flex items-start gap-5">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shrink-0 border border-white/10">
                    <MapPin className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-white">ঠিকানা</h4>
                    <p className="text-emerald-50 text-lg leading-relaxed">অরঙ্গাবাদ, মুর্শিদাবাদ<br/>পশ্চিমবঙ্গ, ভারত - 742201</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shrink-0 border border-white/10">
                    <Phone className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-white">ফোন</h4>
                    <p className="text-emerald-50 text-lg">+91 9134002625</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl shrink-0 border border-white/10">
                    <Mail className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-white">ইমেইল</h4>
                    <p className="text-emerald-50 text-lg">info@youboograni.org</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
