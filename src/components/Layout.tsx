import { useState, useEffect } from 'react';
import { Menu, X, ArrowUp, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { id: 'home', label: 'হোম' },
  { id: 'about', label: 'আমাদের সম্পর্কে' },
  { id: 'updates', label: 'আপডেটসমূহ' },
  { id: 'keymoments', label: 'কি মোমেন্টস' },
  { id: 'work', label: 'আমাদের কাজ' },
  { id: 'members', label: 'সদস্যবৃন্দ' },
  { id: 'gallery', label: 'গ্যালারি' },
  { id: 'contact', label: 'যোগাযোগ' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className={`text-2xl font-bold tracking-tight cursor-pointer ${isScrolled ? 'text-emerald-700' : 'text-white'}`} onClick={() => scrollTo('home')}>
          যুব অগ্রণী
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className={`font-medium hover:text-emerald-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white/90'}`}>
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className={isScrolled ? 'text-gray-800' : 'text-white'}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col space-y-4"
          >
            {navLinks.map(link => (
              <button key={link.id} onClick={() => scrollTo(link.id)} className="text-gray-800 font-medium text-left hover:text-emerald-600 px-2 py-2 rounded-md hover:bg-gray-50">
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">যুব অগ্রণী</h2>
        <p className="text-emerald-400 mb-2 font-medium tracking-wide uppercase">Youbo Ogroni Social And Welfare Trust</p>
        <p className="text-gray-300 font-bold mb-4 bg-gray-800 inline-block px-4 py-2 rounded-lg border border-gray-700">Registration Number : 121500026/25</p>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">তরুণ প্রজন্মের হাত ধরে নতুন সমাজ গঠন</p>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
          {navLinks.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(link.id);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-emerald-400 transition-colors font-medium">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-white bg-gray-800 hover:bg-emerald-600 p-3 rounded-full transition-all">
            <Facebook size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white bg-gray-800 hover:bg-emerald-600 p-3 rounded-full transition-all">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white bg-gray-800 hover:bg-emerald-600 p-3 rounded-full transition-all">
            <Twitter size={20} />
          </a>
        </div>

        <div className="border-t border-gray-800 pt-8 text-sm flex flex-col sm:flex-row justify-center items-center gap-2">
          <p>© 2024 যুব অগ্রণী. সর্বস্বত্ব সংরক্ষিত।</p>
          <span className="hidden sm:inline text-gray-600">|</span>
          <p className="text-emerald-500 font-semibold">Gen-Z সমর্থিত সংগঠন</p>
        </div>
        
        <div className="mt-6">
          <a href="https://creatorshyamchand.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-gray-800 hover:bg-emerald-600 text-gray-300 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm">
            Contact Developer
          </a>
        </div>
      </div>
    </footer>
  );
};

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all z-50 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
