import { motion } from 'motion/react';
import { Target, Users, BookOpen, HeartHandshake } from 'lucide-react';

const goals = [
  {
    icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
    title: "শিক্ষার প্রসার",
    description: "প্রতিটি সুবিধাবঞ্চিত শিশুর কাছে মানসম্মত শিক্ষা পৌঁছে দেওয়া এবং তাদের ভবিষ্যৎ সুনিশ্চিত করা।"
  },
  {
    icon: <HeartHandshake className="w-8 h-8 text-emerald-600" />,
    title: "স্বাবলম্বী সমাজ",
    description: "কর্মসংস্থানমুখী প্রশিক্ষণ প্রদানের মাধ্যমে যুবসমাজকে আর্থিকভাবে স্বাবলম্বী করে তোলা।"
  },
  {
    icon: <Target className="w-8 h-8 text-emerald-600" />,
    title: "স্বাস্থ্য সচেতনতা",
    description: "প্রত্যন্ত অঞ্চলে বিনামূল্যে চিকিৎসা শিবির ও স্বাস্থ্য সচেতনতামূলক প্রচারভিযান পরিচালনা করা।"
  },
  {
    icon: <Users className="w-8 h-8 text-emerald-600" />,
    title: "সামাজিক সম্প্রীতি",
    description: "সাংস্কৃতিক অনুষ্ঠান ও কর্মশালার মাধ্যমে সমাজের সব স্তরের মানুষের মধ্যে সম্প্রীতির বন্ধন দৃঢ় করা।"
  }
];

export const FutureGoals = () => {
  return (
    <div className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">আমাদের ভবিষ্যতের লক্ষ্য</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            আমরা স্বপ্ন দেখি এমন একটি সমাজের যেখানে প্রতিটি মানুষের সমান সুযোগ থাকবে। আমাদের আগামী দিনের কিছু প্রধান লক্ষ্য নিচে তুলে ধরা হলো।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {goals.map((goal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {goal.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{goal.title}</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {goal.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
