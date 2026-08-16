import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, onSnapshot, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Settings, ImagePlus, MessageSquareText, LogOut, Eye, X, CheckSquare, Square, Edit, Plus, Trash2, ChevronLeft, ChevronRight, Video, Play } from 'lucide-react';
import { format } from 'date-fns';

export const AdminPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showImgbbModal, setShowImgbbModal] = useState(false);
  const [showMemberModalFromImgbb, setShowMemberModalFromImgbb] = useState(false);
  const [imgbbUploadedUrl, setImgbbUploadedUrl] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড ভুল।');
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-emerald-900">অ্যাডমিন প্যানেল</h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ইমেইল</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">পাসওয়ার্ড</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors">
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 bg-emerald-900 text-white flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold">যুব অগ্রণী</h2>
          <p className="text-emerald-300 text-sm">অ্যাডমিন প্যানেল</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Settings />} label="Control" active={activeTab === 'control'} onClick={() => setActiveTab('control')} />
          <NavItem icon={<ImagePlus />} label="Add Images" active={activeTab === 'add-images'} onClick={() => setActiveTab('add-images')} />
          <NavItem icon={<MessageSquareText />} label="Form Lookup" active={activeTab === 'form-lookup'} onClick={() => setActiveTab('form-lookup')} />
        </nav>
        <div className="p-4 border-t border-emerald-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8 z-40 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-emerald-900">Youbo Ogroni</h2>
          <button onClick={() => setShowImgbbModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium shadow-md transition-colors text-sm md:text-base whitespace-nowrap ml-2">
            Get Imgbb Link
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-16 md:pt-20 pb-24 md:pb-8">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'control' && <ControlTab />}
          {activeTab === 'add-images' && <AddImagesTab />}
          {activeTab === 'form-lookup' && <FormLookupTab />}
        </div>
      </div>

      {showImgbbModal && (
        <ImgbbModal 
          onClose={() => setShowImgbbModal(false)} 
          onAddAsMember={(url: string) => {
            setImgbbUploadedUrl(url);
            setShowImgbbModal(false);
            setShowMemberModalFromImgbb(true);
          }}
        />
      )}
      
      {showMemberModalFromImgbb && (
        <MemberModal 
          onClose={() => {
            setShowMemberModalFromImgbb(false);
            setImgbbUploadedUrl('');
          }} 
          member={{ image: imgbbUploadedUrl }} 
        />
      )}

      {/* Bottom Nav - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <MobileNavItem icon={<LayoutDashboard />} label="Dash" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <MobileNavItem icon={<Settings />} label="Control" active={activeTab === 'control'} onClick={() => setActiveTab('control')} />
        <MobileNavItem icon={<ImagePlus />} label="Images" active={activeTab === 'add-images'} onClick={() => setActiveTab('add-images')} />
        <MobileNavItem icon={<MessageSquareText />} label="Forms" active={activeTab === 'form-lookup'} onClick={() => setActiveTab('form-lookup')} />
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${active ? 'bg-emerald-800 text-white font-medium' : 'text-emerald-100 hover:bg-emerald-800/50'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors ${active ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// --- Sub Tabs ---

const DashboardTab = () => {
  const [stats, setStats] = useState({ members: 0, puruskrito: 0, brikho: 0, onusthan: 0 });
  const [counts, setCounts] = useState({ totalStories: 0, totalImages: 0, totalForms: 0, totalVideos: 0 });

  useEffect(() => {
    // Fetch user defined stats
    const unsubStats = onSnapshot(doc(db, 'settings', 'stats'), (docSnap) => {
      if (docSnap.exists()) setStats(docSnap.data() as any);
    });
    
    // Fetch actual counts
    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => setCounts(p => ({ ...p, totalStories: snap.size })));
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => setCounts(p => ({ ...p, totalImages: snap.size })));
    const unsubForms = onSnapshot(collection(db, 'messages'), (snap) => setCounts(p => ({ ...p, totalForms: snap.size })));
    const unsubVideos = onSnapshot(collection(db, 'keymoments'), (snap) => setCounts(p => ({ ...p, totalVideos: snap.size })));

    return () => { unsubStats(); unsubMembers(); unsubGallery(); unsubForms(); unsubVideos(); };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Members" value={stats.members || 0} />
        <StatCard title="Total Onusthan" value={stats.onusthan || 0} />
        <StatCard title="Total Members (Profiles)" value={counts.totalStories} />
        <StatCard title="Total Gallery Images" value={counts.totalImages} />
        <StatCard title="Key Moments Videos" value={counts.totalVideos} />
        <StatCard title="Total Forms Submitted" value={counts.totalForms} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string, value: number | string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 font-medium mb-2">{title}</p>
    <p className="text-3xl font-bold text-emerald-600">{value}</p>
  </div>
);

const ControlTab = () => {
  // Stats state
  const [stats, setStats] = useState({ members: '', puruskrito: '', brikho: '', onusthan: '' });
  const [savingStats, setSavingStats] = useState(false);

  // Logo state for Key Moments
  const [logoUrl, setLogoUrl] = useState('');
  const [savingLogo, setSavingLogo] = useState(false);

  // Key Moments Videos state
  const [videos, setVideos] = useState<any[]>([]);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState({
    filename: '',
    title: '',
    text: '',
    showInHome: false,
  });
  const [savingVideo, setSavingVideo] = useState(false);

  useEffect(() => {
    // Fetch stats
    getDoc(doc(db, 'settings', 'stats')).then(snap => {
      if (snap.exists()) setStats(snap.data() as any);
    });

    // Fetch key moments logo
    getDoc(doc(db, 'settings', 'keymoments')).then(snap => {
      if (snap.exists() && snap.data().logoUrl) {
        setLogoUrl(snap.data().logoUrl);
      }
    });

    // Listen to keymoments videos
    const q = query(collection(db, 'keymoments'), orderBy('createdAt', 'desc'));
    const unsubV = onSnapshot(q, snap => {
      setVideos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubV();
  }, []);

  const handleSaveStats = async (e: any) => {
    e.preventDefault();
    setSavingStats(true);
    await setDoc(doc(db, 'settings', 'stats'), {
      members: Number(stats.members),
      puruskrito: Number(stats.puruskrito),
      brikho: Number(stats.brikho),
      onusthan: Number(stats.onusthan)
    });
    setSavingStats(false);
    alert('Stats updated successfully!');
  };

  const handleSaveLogo = async (e: any) => {
    e.preventDefault();
    setSavingLogo(true);
    try {
      await setDoc(doc(db, 'settings', 'keymoments'), { logoUrl: logoUrl.trim() }, { merge: true });
      alert('Key Moments Logo updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update logo.');
    }
    setSavingLogo(false);
  };

  const currentHomeCount = videos.filter(v => v.showInHome && v.id !== editingVideoId).length;

  const handleToggleHome = async (video: any) => {
    const isEnabling = !video.showInHome;
    if (isEnabling) {
      const activeCount = videos.filter(v => v.showInHome).length;
      if (activeCount >= 2) {
        alert('Home section a 2 tar besi add kora jabe na! (Maximum 2 videos can be shown on home page). Please uncheck another video first.');
        return;
      }
    }
    try {
      await updateDoc(doc(db, 'keymoments', video.id), { showInHome: isEnabling });
    } catch (err) {
      console.error(err);
      alert('Failed to update video status');
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (checked && currentHomeCount >= 2) {
      alert('Home section a 2 tar besi add kora jabe na! (Maximum 2 videos can be shown on home page). Please uncheck another video first.');
      return;
    }
    setVideoForm({ ...videoForm, showInHome: checked });
  };

  const handleSaveVideo = async (e: any) => {
    e.preventDefault();
    if (!videoForm.filename.trim()) return alert('Please enter video filename (e.g. video1.mp4 or URL)');
    if (!videoForm.title.trim()) return alert('Please enter video title');

    if (videoForm.showInHome && currentHomeCount >= 2) {
      return alert('Home section a 2 tar besi add kora jabe na! Please uncheck another video first.');
    }

    setSavingVideo(true);
    try {
      const videoData = {
        filename: videoForm.filename.trim(),
        title: videoForm.title.trim(),
        text: videoForm.text.trim(),
        showInHome: !!videoForm.showInHome,
        createdAt: new Date(),
      };

      if (editingVideoId) {
        await updateDoc(doc(db, 'keymoments', editingVideoId), {
          filename: videoForm.filename.trim(),
          title: videoForm.title.trim(),
          text: videoForm.text.trim(),
          showInHome: !!videoForm.showInHome,
        });
        alert('Video updated successfully!');
        setEditingVideoId(null);
      } else {
        await addDoc(collection(db, 'keymoments'), videoData);
        alert('Video added to Key Moments successfully!');
      }

      setVideoForm({
        filename: '',
        title: '',
        text: '',
        showInHome: false,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save video.');
    }
    setSavingVideo(false);
  };

  const handleEditVideo = (video: any) => {
    setEditingVideoId(video.id);
    setVideoForm({
      filename: video.filename || '',
      title: video.title || '',
      text: video.text || '',
      showInHome: !!video.showInHome,
    });
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('Are you sure you want to delete this video from Key Moments?')) {
      await deleteDoc(doc(db, 'keymoments', id));
      if (editingVideoId === id) {
        setEditingVideoId(null);
        setVideoForm({ filename: '', title: '', text: '', showInHome: false });
      }
    }
  };

  const cancelEdit = () => {
    setEditingVideoId(null);
    setVideoForm({ filename: '', title: '', text: '', showInHome: false });
  };

  const resolveVideoUrlPreview = (fn: string) => {
    if (!fn) return '';
    const trimmed = fn.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:')) return trimmed;
    if (trimmed.startsWith('/')) return trimmed;
    return `/keymom/${trimmed}`;
  };

  return (
    <div className="max-w-4xl space-y-12 pb-12">
      <h2 className="text-2xl font-bold text-gray-900">Control Panel</h2>

      {/* 1. KEY MOMENTS VIDEO SECTION */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-100 space-y-8">
        <div className="border-b pb-4 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
              <Video className="text-emerald-600" size={24} />
              Key Moments - ভিডিও কন্ট্রোল (Add Video)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              ভিডিও ফাইল <code className="bg-gray-100 text-emerald-800 px-1 py-0.5 rounded font-mono font-bold">/keymom</code> ফোল্ডারে আপলোড করে ফাইলের নাম এখানে দিন।
            </p>
          </div>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200">
            Home Visible: {videos.filter(v => v.showInHome).length}/2
          </span>
        </div>

        {/* Video Add / Edit Form */}
        <form onSubmit={handleSaveVideo} className="space-y-5 bg-gray-50/70 p-5 md:p-6 rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-800 text-base">
              {editingVideoId ? 'ভিডিও এডিট করুন (Edit Video)' : 'নতুন ভিডিও যোগ করুন (Add Video)'}
            </h4>
            {editingVideoId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-xs text-gray-500 hover:text-red-600 font-bold underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Filename */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Filename <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder='e.g. "myvideo.mp4" or "event1.mp4" or URL'
                value={videoForm.filename}
                onChange={e => setVideoForm({ ...videoForm, filename: e.target.value })}
                className="w-full p-3 border rounded-xl bg-white font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Target path: <span className="font-mono text-emerald-700">{resolveVideoUrlPreview(videoForm.filename) || '/keymom/filename.mp4'}</span>
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder='e.g. "বৃক্ষরোপণ কর্মসূচি - ২০২৩"'
                value={videoForm.title}
                onChange={e => setVideoForm({ ...videoForm, title: e.target.value })}
                className="w-full p-3 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Text / Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Text / Description
            </label>
            <textarea
              rows={3}
              placeholder="ভিডিওটির সংক্ষিপ্ত বিবরণ বা বিস্তারিত লিখুন..."
              value={videoForm.text}
              onChange={e => setVideoForm({ ...videoForm, text: e.target.value })}
              className="w-full p-3 border rounded-xl bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Tick button to show in main page */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => handleCheckboxChange(!videoForm.showInHome)}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              {videoForm.showInHome ? (
                <CheckSquare className="text-emerald-600 w-6 h-6 flex-shrink-0" />
              ) : (
                <Square className="text-gray-400 w-6 h-6 flex-shrink-0" />
              )}
              <span className="text-sm font-bold text-gray-800">
                Show in main page (মূল পেজে প্রদর্শন করুন)
              </span>
            </button>
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded ml-auto font-medium">
              Home এ সর্বোচ্চ ২টি ভিডিও দেখানো যাবে
            </span>
          </div>

          {/* Real-time Preview Area */}
          {(videoForm.title || videoForm.filename) && (
            <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Live Video Card Preview:
              </span>
              <div className="flex items-start gap-4">
                <div className="w-24 h-16 bg-black rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 relative">
                  <video
                    src={resolveVideoUrlPreview(videoForm.filename)}
                    className="w-full h-full object-cover opacity-80"
                    muted
                  />
                  <Play size={16} className="absolute fill-white text-white opacity-90" />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 text-sm line-clamp-1">
                    {videoForm.title || 'Video Title'}
                  </h5>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                    {videoForm.text || 'Description preview will show here...'}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">
                    Src: {resolveVideoUrlPreview(videoForm.filename)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={savingVideo}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:shadow transition-colors disabled:opacity-50 text-sm flex items-center gap-2"
            >
              <Plus size={18} />
              <span>{savingVideo ? 'Saving...' : editingVideoId ? 'Update Video' : 'Save Video'}</span>
            </button>
            {editingVideoId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Existing Videos List */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 text-base flex items-center justify-between">
            <span>All Key Moments Videos ({videos.length})</span>
            <span className="text-xs text-gray-500 font-normal">
              Click checkbox to toggle visibility on Home (Max 2)
            </span>
          </h4>

          {videos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed">
              No videos added yet. Fill out the form above to add your first video.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((vid, i) => (
                <div
                  key={vid.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    vid.showInHome ? 'border-emerald-500 bg-emerald-50/40' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-gray-400">#{i + 1}</span>
                      <h5 className="font-bold text-gray-900 text-sm line-clamp-1">{vid.title}</h5>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEditVideo(vid)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit video"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete video"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{vid.text}</p>
                  
                  <div className="text-[11px] font-mono text-gray-400 truncate mb-3 bg-gray-100 p-1.5 rounded">
                    📁 {vid.filename}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => handleToggleHome(vid)}
                      className="flex items-center gap-1.5 text-xs font-bold"
                    >
                      {vid.showInHome ? (
                        <>
                          <CheckSquare size={16} className="text-emerald-600" />
                          <span className="text-emerald-800">Shown in Home (Visible)</span>
                        </>
                      ) : (
                        <>
                          <Square size={16} className="text-gray-400" />
                          <span className="text-gray-500 hover:text-gray-800">Show in Home</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. KEY MOMENTS LOGO SETTING */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-emerald-100 space-y-6">
        <div className="border-b pb-3">
          <h3 className="text-lg font-bold text-gray-900">
            Key Moments পেজের জন্য Youbo Ogroni লোগো
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Add logo of Youbo Ogroni only for Key Moments video player page.
          </p>
        </div>

        <form onSubmit={handleSaveLogo} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Logo Image URL (লোগোর লিংক)
            </label>
            <input
              type="url"
              placeholder="https://i.ibb.co/... or image URL"
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              ImgBB বা যেকোনো ইমেজ লিংক এখানে পেস্ট করুন।
            </p>
          </div>

          {/* Logo Circle Preview */}
          <div className="flex items-center gap-4 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-600 bg-white overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              ) : (
                <div className="w-full h-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                  YO
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Preview Display:</p>
              <h5 className="font-bold text-emerald-950 text-sm">
                Youbo Ogroni Social and Walfare Trust
              </h5>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingLogo}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
          >
            {savingLogo ? 'Saving Logo...' : 'Save Logo'}
          </button>
        </form>
      </div>

      {/* 3. STATS SETTING */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6 border-b pb-4">আমাদের প্রভাব - স্ট্যাটস পরিবর্তন</h3>
        <form onSubmit={handleSaveStats} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">সক্রিয় সদস্য (Members)</label>
              <input type="number" value={stats.members} onChange={e => setStats({...stats, members: e.target.value})} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">শিক্ষার্থী পুরস্কৃত</label>
              <input type="number" value={stats.puruskrito} onChange={e => setStats({...stats, puruskrito: e.target.value})} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">বৃক্ষরোপণ</label>
              <input type="number" value={stats.brikho} onChange={e => setStats({...stats, brikho: e.target.value})} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">সফল অনুষ্ঠান</label>
              <input type="number" value={stats.onusthan} onChange={e => setStats({...stats, onusthan: e.target.value})} className="w-full p-3 border rounded-lg" required />
            </div>
          </div>
          <button type="submit" disabled={savingStats} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50">
            {savingStats ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AddImagesTab = () => {
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    const unsubM = onSnapshot(collection(db, 'members'), (snap) => setMembers(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubG = onSnapshot(collection(db, 'gallery'), (snap) => setGallery(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const qU = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
    const unsubU = onSnapshot(qU, (snap) => setUpdates(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubM(); unsubG(); unsubU(); };
  }, []);

  const deleteDocItem = async (col: string, id: string) => {
    if(confirm('Are you sure you want to delete this item?')) {
      await deleteDoc(doc(db, col, id));
    }
  };

  const toggleShowInHome = async (id: string, currentStatus: boolean) => {
    if (!currentStatus) {
      const shownCount = gallery.filter(g => g.showInHome).length;
      if (shownCount >= 10) {
        alert('10 images are ✓ ticked to show in home page. If you want to add this, then remove one.');
        return;
      }
    }
    await updateDoc(doc(db, 'gallery', id), { showInHome: !currentStatus });
  };

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Images & Content</h2>

      {/* Updates Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Stay Updated Posts ({updates.length})</h3>
            <p className="text-xs text-gray-500">Add news, trust updates, and photos with live preview</p>
          </div>
          <button onClick={() => setShowUpdateModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-sm transition-colors">
            <Plus size={18} /> Add New Update
          </button>
        </div>

        {updates.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">
            No update posts created yet. Click "Add New Update" above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {updates.map(u => (
              <div key={u.id} className="bg-white p-5 rounded-2xl border relative group flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <button onClick={() => deleteDocItem('updates', u.id)} className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full z-10 shadow-md">
                  <X size={16}/>
                </button>
                <div>
                  <h4 className="font-bold text-gray-900 pr-8 text-lg mb-1">{u.title}</h4>
                  <p className="text-xs text-emerald-700 font-semibold mb-2">
                    📅 {u.createdAt ? format(u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt), 'PPP, p') : 'Just now'}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{u.description}</p>
                </div>
                {u.images && u.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 border-t pt-3">
                    {u.images.map((imgUrl: string, idx: number) => (
                      <img key={idx} src={imgUrl} alt={`Thumb ${idx}`} className="w-14 h-14 object-cover rounded-lg border flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Members Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Members</h3>
          <button onClick={() => { setEditingMember(null); setShowMemberModal(true); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
            <ImagePlus size={18} /> Add Member
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {members.map(m => (
            <div key={m.id} className="bg-white p-4 rounded-xl border relative group">
              <div className="absolute top-2 right-2 flex flex-col gap-2 z-10 md:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingMember(m); setShowMemberModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md"><Edit size={16}/></button>
                <button onClick={() => deleteDocItem('members', m.id)} className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md"><X size={16}/></button>
              </div>
              <img src={m.image} alt={m.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
              <p className="font-bold text-center text-sm">{m.name}</p>
              <p className="text-xs text-center text-emerald-600 font-medium">{m.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Gallery Images ({gallery.filter(g => g.showInHome).length}/10 in Home)</h3>
          <button onClick={() => setShowGalleryModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
            <ImagePlus size={18} /> Add Image
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gallery.map(g => (
            <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square border">
              <button onClick={() => deleteDocItem('gallery', g.id)} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full md:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity shadow-md z-10"><X size={16}/></button>
              <button 
                onClick={() => toggleShowInHome(g.id, g.showInHome)} 
                className={`absolute top-2 left-2 p-1 rounded-full z-10 transition-all ${g.showInHome ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100'}`}
                title="Show in Home Page"
              >
                {g.showInHome ? <CheckSquare size={16}/> : <Square size={16}/>}
              </button>
              <img src={g.url} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {showMemberModal && <MemberModal onClose={() => setShowMemberModal(false)} member={editingMember} />}
      {showGalleryModal && <GalleryModal onClose={() => setShowGalleryModal(false)} galleryCount={gallery.filter(g => g.showInHome).length} />}
      {showUpdateModal && <UpdateModal onClose={() => setShowUpdateModal(false)} />}
    </div>
  );
};

const FormLookupTab = () => {
  const [forms, setForms] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedForm, setSelectedForm] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => setForms(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => unsub();
  }, []);

  const filtered = forms.filter(f => f.name?.toLowerCase().includes(search.toLowerCase()) || f.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Form Lookup</h2>
        <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="px-4 py-2 border rounded-lg w-full md:w-64" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700 hidden md:table-cell">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(f => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{f.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{f.email}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setSelectedForm(f)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full inline-flex"><Eye size={20}/></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No forms found.</td></tr>}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-bold text-xl">Form Details</h3>
                <button onClick={() => setSelectedForm(null)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div><p className="text-sm text-gray-500">Name</p><p className="font-medium text-lg">{selectedForm.name}</p></div>
                <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{selectedForm.email}</p></div>
                <div><p className="text-sm text-gray-500">Phone</p><p className="font-medium">{selectedForm.phone || 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Date</p><p className="font-medium">{selectedForm.timestamp ? format(selectedForm.timestamp.toDate(), 'PPpp') : 'N/A'}</p></div>
                <div><p className="text-sm text-gray-500">Subject</p><p className="font-medium">{selectedForm.subject}</p></div>
                <div><p className="text-sm text-gray-500">Message</p><div className="bg-gray-50 p-4 rounded-lg mt-1 whitespace-pre-wrap">{selectedForm.message}</div></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


// Modals
const MemberModal = ({ onClose, member }: any) => {
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');
  const [desc, setDesc] = useState(member?.desc || '');
  const [imageUrl, setImageUrl] = useState(member?.image || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!imageUrl) return alert('Please enter an image URL');
    setLoading(true);
    try {
      if (member?.id) {
        await updateDoc(doc(db, 'members', member.id), { name, role, desc, image: imageUrl });
      } else {
        await addDoc(collection(db, 'members'), { name, role, desc, image: imageUrl, createdAt: new Date() });
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving member');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 my-8">
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-xl">{member ? 'Edit Member' : 'Add Member'}</h3>
          <button onClick={onClose}><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" required value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 border rounded-lg" />
          <input type="text" placeholder="Role (e.g. সভাপতি)" required value={role} onChange={e=>setRole(e.target.value)} className="w-full p-3 border rounded-lg" />
          <textarea placeholder="Description" required value={desc} onChange={e=>setDesc(e.target.value)} className="w-full p-3 border rounded-lg" rows={3} />
          
          <div>
            <label className="block text-sm font-medium mb-1">ImgBB URL (or any image link)</label>
            <input type="url" placeholder="https://i.ibb.co/..." required value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
          {imageUrl && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img src={imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-full mx-auto border" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}

          <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold mt-4">{loading ? 'Saving...' : (member ? 'Update Member' : 'Save Member')}</button>
        </form>
      </div>
    </div>
  );
};

const GalleryModal = ({ onClose, galleryCount }: any) => {
  const [imageUrl, setImageUrl] = useState('');
  const [showInHome, setShowInHome] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    if (!showInHome && galleryCount >= 10) {
      alert('10 images are ✓ ticked to show in home page. If you want to add this, then remove one.');
      return;
    }
    setShowInHome(!showInHome);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!imageUrl) return alert('Please enter an image URL');
    setLoading(true);
    try {
      await addDoc(collection(db, 'gallery'), { url: imageUrl, showInHome, createdAt: new Date() });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving image');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-xl">Add Gallery Image</h3>
          <button onClick={onClose}><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ImgBB URL (or any image link)</label>
            <input type="url" placeholder="https://i.ibb.co/..." required value={imageUrl} onChange={e=>setImageUrl(e.target.value)} className="w-full p-3 border rounded-lg" />
          </div>
          {imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
          
          <div className="flex items-center gap-2 pt-2">
            <button type="button" onClick={handleToggle} className={`p-1 rounded text-white ${showInHome ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              {showInHome ? <CheckSquare size={20}/> : <Square size={20}/>}
            </button>
            <span className="text-sm font-medium cursor-pointer" onClick={handleToggle}>Show in Home Page</span>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold mt-4">{loading ? 'Saving...' : 'Add Image'}</button>
        </form>
      </div>
    </div>
  );
};

const ImgbbModal = ({ onClose, onAddAsMember }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!file) return alert('Please select an image first.');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('https://api.imgbb.com/1/upload?key=8fb0a4e707c858edd73349d5cf4f6e14', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setUploadedUrl(data.data.url);
      } else {
        alert('Upload failed: ' + data.error.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading to ImgBB.');
    }
    setLoading(false);
  };

  const handleAddAsGallery = async () => {
    if(!uploadedUrl) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'gallery'), { src: uploadedUrl, createdAt: new Date(), showInHome: false });
      alert('Image added to gallery!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add to gallery.');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFile(null);
    setUploadedUrl('');
    // Reset file input
    const fileInput = document.getElementById('imgbb-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 z-[60] overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 my-8">
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-xl text-emerald-900">Get Imgbb Link</h3>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800"><X/></button>
        </div>
        
        {uploadedUrl ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
              <p className="text-sm font-bold text-emerald-700 mb-2">Image Uploaded Successfully!</p>
              <img src={uploadedUrl} alt="Uploaded" className="w-32 h-32 object-cover mx-auto rounded-lg shadow-sm mb-3 border border-emerald-100" />
              <input 
                type="text" 
                readOnly 
                value={uploadedUrl} 
                className="w-full p-2 text-sm border rounded bg-white text-gray-700 text-center mb-2 outline-none"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button 
                type="button"
                onClick={() => { navigator.clipboard.writeText(uploadedUrl); alert('Link Copied!'); }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium text-sm transition-colors mb-2"
              >
                Copy Link
              </button>
              
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-emerald-200">
                <button 
                  disabled={loading}
                  type="button" 
                  onClick={handleAddAsGallery}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                >
                  Add as a gallery image
                </button>
                <button 
                  type="button" 
                  onClick={() => onAddAsMember(uploadedUrl)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Add as a member
                </button>
              </div>
            </div>
            <button type="button" onClick={handleReset} className="w-full border border-emerald-600 text-emerald-700 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors">
              Upload New Image
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50 relative">
              <input 
                id="imgbb-upload"
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              {file ? (
                <div className="text-emerald-600 font-medium break-all">{file.name}</div>
              ) : (
                <div className="text-gray-500">
                  <ImagePlus className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="font-medium text-sm">Click to browse or drag image here</p>
                </div>
              )}
            </div>
            <button 
              disabled={loading || !file} 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              {loading ? 'Uploading...' : 'Get Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const UpdateModal = ({ onClose }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [previewImgIndex, setPreviewImgIndex] = useState(0);

  const validImages = images.map(i => i.trim()).filter(i => i.length > 0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = setInterval(() => {
      setPreviewImgIndex(prev => (prev + 1) % validImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [validImages.length]);

  const handleAddImageField = () => {
    if (images.length >= 10) {
      alert('Maximum 10 images allowed per update post.');
      return;
    }
    setImages([...images, '']);
  };

  const handleRemoveImageField = (index: number) => {
    if (images.length <= 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a title');
    const filteredImages = images.map(i => i.trim()).filter(i => i.length > 0);
    if (filteredImages.length === 0) return alert('Please enter at least 1 image URL');

    setLoading(true);
    try {
      await addDoc(collection(db, 'updates'), {
        title: title.trim(),
        description: description.trim(),
        images: filteredImages,
        createdAt: new Date(),
      });
      alert('Update post published successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to publish update post.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-6 md:p-8 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h3 className="font-bold text-2xl text-emerald-900">Add New Update Post</h3>
            <p className="text-xs text-gray-500">Live preview update post below as you type</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100">
            <X size={24}/>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title (শিরোনাম)</label>
              <input
                type="text"
                placeholder="Enter update title..."
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Description (বিস্তারিত)</label>
              <textarea
                placeholder="Enter update description text..."
                required
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-base"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">
                  Image Links (Max 10)
                </label>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  {images.length}/10
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}.</span>
                    <input
                      type="url"
                      placeholder="https://i.ibb.co/... (paste ImgBB or image URL)"
                      value={imgUrl}
                      onChange={e => handleImageChange(idx, e.target.value)}
                      className="flex-1 p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(idx)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove image field"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {images.length < 10 && (
                <button
                  type="button"
                  onClick={handleAddImageField}
                  className="mt-3 text-emerald-700 hover:text-emerald-800 font-bold text-sm flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={18} /> Add More Image Link ({images.length}/10)
                </button>
              )}
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-xl font-bold text-base shadow-md disabled:opacity-50 transition-colors mt-6"
            >
              {loading ? 'Publishing Post...' : 'Publish Update Post'}
            </button>
          </form>

          {/* Real-Time Live Preview */}
          <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-200 flex flex-col">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Eye size={16} /> Real-Time Live Preview
            </h4>

            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden flex-1 flex flex-col justify-between">
              <div>
                {/* Title */}
                <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
                  <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full uppercase">Preview</span>
                  <h5 className="font-bold text-lg leading-snug mt-1">
                    {title || 'Update Title Preview'}
                  </h5>
                </div>

                {/* Image Slide Preview */}
                <div className="relative bg-black h-48 flex items-center justify-center overflow-hidden">
                  {validImages.length > 0 ? (
                    <>
                      <img
                        src={validImages[previewImgIndex % validImages.length]}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800')}
                      />
                      {validImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setPreviewImgIndex((prev) => (prev - 1 + validImages.length) % validImages.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewImgIndex((prev) => (prev + 1) % validImages.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1.5 rounded-full"
                          >
                            <ChevronRight size={16} />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                            {(previewImgIndex % validImages.length) + 1} / {validImages.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-400 text-xs text-center p-4">
                      Add an image URL to see image carousel preview
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {description || 'Update description text will appear here as you type...'}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="p-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
                📅 {format(new Date(), 'PPP, p')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
