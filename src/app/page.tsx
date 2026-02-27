import Biography from '../components/Biography';
import PhotoGallery from '../components/PhotoGallery';
import Contact from '../components/Contact';
import Hero from '../components/Hero';
import VideoGallery from '../components/VideoGallery';
// import Events from '../components/Events';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-ando-navy">
      <Hero />
      <Biography />
      <PhotoGallery />
      {/* <Events /> */}
      <VideoGallery />
      <Contact />
      <Footer />
    </main>
  );
}