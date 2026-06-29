import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const Hero = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 text-white min-h-[90vh] flex items-center">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
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
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
        >
          তরুণদের শক্তি, <br className="hidden sm:block" />
          <span className="text-emerald-300">সমাজের অগ্রগতি</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl md:text-3xl text-emerald-100 font-medium mb-12 max-w-3xl mx-auto"
        >
          সমাজ গড়ার অঙ্গীকারে আমরা যুব অগ্রণী
        </motion.p>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => scrollTo('contact')}
          className="bg-white text-emerald-800 hover:bg-emerald-50 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
        >
          আমাদের সাথে যুক্ত হন
        </motion.button>
      </div>
    </div>
  );
};

export const About = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আমাদের সম্পর্কে</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            যুব অগ্রণী (youbo Ogroni) একটি যুব-চালিত সামাজিক সংগঠন, যা তরুণ প্রজন্মের সক্রিয় অংশগ্রহণের মাধ্যমে সমাজে ইতিবাচক পরিবর্তন আনার লক্ষ্যে প্রতিষ্ঠিত হয়েছে।
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            আমাদের সংগঠন শিক্ষা সহায়তা, বৃক্ষরোপণের মাধ্যমে পরিবেশ সংরক্ষণ এবং সম্প্রদায় গঠনের মতো বিভিন্ন ফ্রন্টে অক্লান্তভাবে কাজ করে যাচ্ছে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">শিক্ষা সহায়তা</h3>
            <p className="text-gray-600 leading-relaxed">আমরা স্থানীয় বিদ্যালয়ের মেধাবী ছাত্র-ছাত্রীদের শিক্ষায় উৎসাহিত করতে পুরস্কার ও স্বীকৃতি প্রদান করি।</p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300">
            <div className="text-6xl mb-6">🌳</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">পরিবেশ রক্ষা</h3>
            <p className="text-gray-600 leading-relaxed">জলবায়ু পরিবর্তনের মোকাবিলা এবং এলাকাকে সবুজ করে তুলতে আমরা নিয়মিত বৃক্ষরোপণ কর্মসূচির আয়োজন করি।</p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center transition-all duration-300">
            <div className="text-6xl mb-6">❤️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">সমাজ সেবা</h3>
            <p className="text-gray-600 leading-relaxed">স্থানীয় অনুষ্ঠানের আয়োজন, মানুষকে একত্রিত করা এবং সম্প্রীতি বৃদ্ধির লক্ষ্যে আমরা বিভিন্ন সমাজকল্যাণমূলক কাজ করে থাকি।</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const Highlight = () => {
  const [stats, setStats] = useState({ puruskrito: 500, brikho: 1000, members: 50, onusthan: 20 });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'stats'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStats({
          puruskrito: data.puruskrito || 500,
          brikho: data.brikho || 1000,
          members: data.members || 50,
          onusthan: data.onusthan || 20
        });
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      <div className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আমাদের প্রভাব</h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              সামাজিক কল্যাণে আমাদের ধারাবাহিক প্রচেষ্টার কিছু উল্লেখযোগ্য পরিসংখ্যান যা আমাদের অনুপ্রেরণা জোগায়।
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">{stats.puruskrito}+</div>
              <p className="text-gray-600 font-medium">শিক্ষার্থী পুরস্কৃত</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">{stats.brikho}+</div>
              <p className="text-gray-600 font-medium">বৃক্ষরোপণ</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">{stats.members}+</div>
              <p className="text-gray-600 font-medium">সক্রিয় সদস্য</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">{stats.onusthan}+</div>
              <p className="text-gray-600 font-medium">সফল অনুষ্ঠান</p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="relative py-24 bg-emerald-900 overflow-hidden text-white">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaves" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50 20c-10 10-20 0-20 0s0 20 10 30c10-10 20 0 20 0s0-20-10-30z" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaves)"/>
          </svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ rotate: -15, scale: 0.8 }}
            whileInView={{ rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Leaf className="w-20 h-20 text-emerald-400 mx-auto mb-8" />
          </motion.div>
          <p className="text-emerald-200 text-lg md:text-xl font-medium tracking-wider uppercase mb-2">
            Youbo Ogroni Social And Welfare Trust
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">বৃক্ষরোপণ অভিযান</h2>
          <p className="text-xl md:text-2xl text-emerald-100/90 leading-relaxed font-medium">
            যুব অগ্রণী নিয়মিতভাবে স্থানীয় এলাকায় বৃক্ষরোপণ অভিযানের আয়োজন করে থাকে। স্থানীয় বাসিন্দাদের মধ্যে বিনামূল্যে চারাগাছ বিতরণ এবং যুবসমাজের মাঝে পরিবেশ সংরক্ষণ সম্পর্কে সচেতনতা বৃদ্ধি করা আমাদের অন্যতম প্রধান লক্ষ্য।
          </p>
        </div>
      </div>
    </>
  );
};
