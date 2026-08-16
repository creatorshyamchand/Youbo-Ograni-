/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer, BackToTop } from './components/Layout';
import { Hero, About, Highlight } from './components/HeroAbout';
import { StayUpdated } from './components/StayUpdated';
import { KeyMomentsSection } from './components/KeyMomentsSection';
import { Work, Members } from './components/WorkMembers';
import { Gallery, Contact } from './components/GalleryContact';
import { FutureGoals } from './components/FutureGoals';
import { AdminPanel } from './pages/Admin';
import { AllGalleryPage } from './pages/AllGalleryPage';
import { KeyMomentsPage } from './pages/KeyMomentsPage';

function MainSite() {
  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      <main>
        <section id="home"><Hero /></section>
        <section id="about"><About /></section>
        <section id="updates"><StayUpdated /></section>
        <section id="keymoments"><KeyMomentsSection /></section>
        <section id="work"><Work /></section>
        <section id="members"><Members /></section>
        <section id="gallery"><Gallery /></section>
        <Highlight />
        <FutureGoals />
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/gallery" element={<AllGalleryPage />} />
        <Route path="/key-moments" element={<KeyMomentsPage />} />
        <Route path="/keymoments" element={<KeyMomentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
