import { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, onSnapshot, deleteDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Settings, ImagePlus, MessageSquareText, LogOut, Eye, X, Upload } from 'lucide-react';
import { format } from 'date-fns';

export const AdminPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'control' && <ControlTab />}
          {activeTab === 'add-images' && <AddImagesTab />}
          {activeTab === 'form-lookup' && <FormLookupTab />}
        </div>
      </div>

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
  const [counts, setCounts] = useState({ totalStories: 0, totalImages: 0, totalForms: 0 });

  useEffect(() => {
    // Fetch user defined stats
    const unsubStats = onSnapshot(doc(db, 'settings', 'stats'), (docSnap) => {
      if (docSnap.exists()) setStats(docSnap.data() as any);
    });
    
    // Fetch actual counts
    const unsubMembers = onSnapshot(collection(db, 'members'), (snap) => setCounts(p => ({ ...p, totalStories: snap.size })));
    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snap) => setCounts(p => ({ ...p, totalImages: snap.size })));
    const unsubForms = onSnapshot(collection(db, 'messages'), (snap) => setCounts(p => ({ ...p, totalForms: snap.size })));

    return () => { unsubStats(); unsubMembers(); unsubGallery(); unsubForms(); };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats.members || 0} />
        <StatCard title="Total Onusthan" value={stats.onusthan || 0} />
        <StatCard title="Total Members (Profiles)" value={counts.totalStories} />
        <StatCard title="Total Gallery Images" value={counts.totalImages} />
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
  const [stats, setStats] = useState({ members: '', puruskrito: '', brikho: '', onusthan: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'stats')).then(snap => {
      if (snap.exists()) setStats(snap.data() as any);
    });
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    await setDoc(doc(db, 'settings', 'stats'), {
      members: Number(stats.members),
      puruskrito: Number(stats.puruskrito),
      brikho: Number(stats.brikho),
      onusthan: Number(stats.onusthan)
    });
    setSaving(false);
    alert('Stats updated successfully!');
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Control Panel</h2>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6 border-b pb-4">আমাদের প্রভাব - স্ট্যাটস পরিবর্তন</h3>
        <form onSubmit={handleSave} className="space-y-6">
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
          <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AddImagesTab = () => {
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    const unsubM = onSnapshot(collection(db, 'members'), (snap) => setMembers(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    const unsubG = onSnapshot(collection(db, 'gallery'), (snap) => setGallery(snap.docs.map(d => ({id: d.id, ...d.data()}))));
    return () => { unsubM(); unsubG(); };
  }, []);

  const deleteDocItem = async (col: string, id: string) => {
    if(confirm('Are you sure you want to delete this?')) {
      await deleteDoc(doc(db, col, id));
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Images & content</h2>
      
      {/* Members Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Members</h3>
          <button onClick={() => setShowMemberModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
            <ImagePlus size={18} /> Add Member
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {members.map(m => (
            <div key={m.id} className="bg-white p-4 rounded-xl border relative group">
              <button onClick={() => deleteDocItem('members', m.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
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
          <h3 className="text-xl font-bold text-gray-800">Gallery Images</h3>
          <button onClick={() => setShowGalleryModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700">
            <ImagePlus size={18} /> Add Image
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gallery.map(g => (
            <div key={g.id} className="relative group rounded-xl overflow-hidden aspect-square border">
              <button onClick={() => deleteDocItem('gallery', g.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><X size={14}/></button>
              <img src={g.url} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {showMemberModal && <MemberModal onClose={() => setShowMemberModal(false)} />}
      {showGalleryModal && <GalleryModal onClose={() => setShowGalleryModal(false)} />}
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
const MemberModal = ({ onClose }: any) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!file) return alert('Please select an image');
    setLoading(true);
    try {
      const imgRef = ref(storage, `members/${Date.now()}_${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, 'members'), { name, role, desc, image: url, createdAt: new Date() });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error uploading');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between mb-6">
          <h3 className="font-bold text-xl">Add Member</h3>
          <button onClick={onClose}><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" required value={name} onChange={e=>setName(e.target.value)} className="w-full p-3 border rounded-lg" />
          <input type="text" placeholder="Role (e.g. সভাপতি)" required value={role} onChange={e=>setRole(e.target.value)} className="w-full p-3 border rounded-lg" />
          <textarea placeholder="Description" required value={desc} onChange={e=>setDesc(e.target.value)} className="w-full p-3 border rounded-lg" rows={3} />
          <input type="file" accept="image/*" required onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" />
          <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold">{loading ? 'Saving...' : 'Save Member'}</button>
        </form>
      </div>
    </div>
  );
};

const GalleryModal = ({ onClose }: any) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!file) return alert('Please select an image');
    setLoading(true);
    try {
      const imgRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      await addDoc(collection(db, 'gallery'), { url, createdAt: new Date() });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error uploading');
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
          <input type="file" accept="image/*" required onChange={e => setFile(e.target.files?.[0] || null)} className="w-full" />
          <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-lg font-bold">{loading ? 'Uploading...' : 'Upload Image'}</button>
        </form>
      </div>
    </div>
  );
};
