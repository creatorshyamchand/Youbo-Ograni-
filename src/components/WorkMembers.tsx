import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const workStories = [
  {
    id: 1,
    title: 'মাধ্যমিক কৃতি সংবর্ধনা অনুষ্ঠান',
    quote: '"আমাদের এই আয়োজনের মূল লক্ষ্য হলো সমাজের মানুষকে একসাথে আনা, সম্প্রীতি বাড়ানো এবং শিক্ষাপ্রতিষ্ঠানকে সম্পৃক্ত করা। এটি একেবারেই অরাজনৈতিকভাবে করার চেষ্টা করা হয়েছে। স্থানীয় মানুষের সহযোগিতাই এমন আয়োজনের সবচেয়ে বড় শক্তি। আমরা বিশ্বাস করি, সমাজের ভালোর জন্য একসাথে কাজ করাই সবচেয়ে জরুরি।"',
    tags: ['#স্থানীয়অনুষ্ঠান', '#স্কুলসম্পৃক্ততা', '#অরাজনৈতিকউদ্যোগ', '#সমাজেরকথা']
  },
  {
    id: 2,
    title: 'বস্ত্র বিতরণ কর্মসূচি',
    quote: '"শীতের শুরুতে অসহায় মানুষদের পাশে দাঁড়ানোর লক্ষ্য নিয়ে আমরা এই কর্মসূচি গ্রহণ করেছি। এলাকার বিভিন্ন প্রান্তের মানুষের কাছে শীতবস্ত্র পৌঁছে দেওয়া হয়েছে। সবার সম্মিলিত চেষ্টাতেই এই ধরনের উদ্যোগ সফল করা সম্ভব। সমাজের প্রতিটি স্তরের মানুষের সহযোগিতা আমাদের অনুপ্রাণিত করে।"',
    tags: ['#বস্ত্রবিতরণ', '#মানবিকউদ্যোগ', '#শীতেরপ্রস্তুতি', '#একসাথেএগিয়েচলা']
  },
  {
    id: 3,
    title: 'স্বেচ্ছায় রক্তদান শিবির',
    quote: '"রক্তের অভাবে যেন কোনো রোগীর প্রাণ না যায়, সেই ভাবনা থেকেই এই রক্তদান শিবিরের আয়োজন। এলাকার অসংখ্য যুবক-যুবতী স্বতঃস্ফূর্তভাবে এগিয়ে এসে রক্তদান করেছেন। এই মহৎ কাজের মাধ্যমে আমরা সমাজের প্রতি আমাদের দায়বদ্ধতা পালনের চেষ্টা করেছি।"',
    tags: ['#রক্তদান', '#জীবনবাঁচান', '#মহৎকাজ', '#যুবসমাজেরউদ্যোগ']
  },
  {
    id: 4,
    title: 'পরিচ্ছন্নতা অভিযান',
    quote: '"পরিবেশ সুন্দর ও বাসযোগ্য রাখার উদ্দেশ্যে আমরা এলাকার বিভিন্ন স্থানে পরিচ্ছন্নতা অভিযান পরিচালনা করেছি। রাস্তাঘাট পরিষ্কার করা এবং ডেঙ্গু সচেতনতা বৃদ্ধির লক্ষ্যে এই কাজ করা হয়েছে। সুস্থ সমাজ গড়তে পরিচ্ছন্নতার বিকল্প নেই।"',
    tags: ['#পরিচ্ছন্নতা', '#সুস্থপরিবেশ', '#সচেতনতাবৃদ্ধি', '#সবুজপৃথিবী']
  }
];

export const Work = () => {
  const [currentStory, setCurrentStory] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % workStories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আমাদের কাজ</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="relative min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-emerald-50/50 rounded-[2rem] p-8 md:p-12 lg:p-16 border border-emerald-100/50 shadow-sm relative overflow-hidden w-full max-w-4xl mx-auto"
            >
              <div className="absolute top-0 left-0 w-3 h-full bg-emerald-500"></div>
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-8">{workStories[currentStory].title}</h3>
              <blockquote className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-10 relative z-10 font-medium">
                {workStories[currentStory].quote}
              </blockquote>
              <div className="flex flex-wrap gap-3">
                {workStories[currentStory].tags.map(tag => (
                  <span key={tag} className="text-emerald-800 font-bold bg-emerald-100 px-4 py-2 rounded-full text-sm tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-12 space-x-3">
            {workStories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStory(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${idx === currentStory ? 'bg-emerald-500 w-10' : 'bg-gray-300 w-3 hover:bg-emerald-300'}`}
                aria-label={`Go to story slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const fallbackMembers: any[] = [];

export const Members = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [members, setMembers] = useState<any[]>(fallbackMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'members'), (snap) => {
      if (!snap.empty) {
        setMembers(snap.docs.map(d => ({id: d.id, ...d.data()})));
      } else {
        setMembers([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (members.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % members.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [members.length]);

  if (loading) {
    return (
      <div className="py-24 bg-gray-50 min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আমাদের বিশেষ সদস্যবৃন্দ</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-500">সদস্যদের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="py-24 bg-gray-50 min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আমাদের বিশেষ সদস্যবৃন্দ</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-500">কোনো সদস্য যোগ করা হয়নি।</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আমাদের বিশেষ সদস্যবৃন্দ</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-sm mx-auto md:max-w-3xl relative">
          <div className="overflow-hidden relative h-[420px] md:h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 w-full max-w-md text-center border border-gray-100">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-emerald-100 shadow-inner">
                    <img src={members[currentIndex].image} alt={members[currentIndex].name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{members[currentIndex].name}</h3>
                  <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold px-5 py-1.5 rounded-full text-sm mb-5">
                    {members[currentIndex].role}
                  </span>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {members[currentIndex].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center mt-8 gap-6">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + members.length) % members.length)}
              className="bg-white hover:bg-emerald-50 text-emerald-800 p-3 rounded-full border border-emerald-200 shadow-md hover:shadow-lg transition-all"
              aria-label="Previous member"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-sm font-bold text-gray-700 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
              {currentIndex + 1} / {members.length}
            </span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % members.length)}
              className="bg-white hover:bg-emerald-50 text-emerald-800 p-3 rounded-full border border-emerald-200 shadow-md hover:shadow-lg transition-all"
              aria-label="Next member"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
