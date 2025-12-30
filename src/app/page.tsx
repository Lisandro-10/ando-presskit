
import Biography from '../components/Biography';
import PhotoGallery from '../components/PhotoGallery';
import Contact from '../components/Contact';
import Hero from '../components/Hero';
import VideoGallery from '../components/VideoGallery';

export default function Home() {
  return (
    <main className="min-h-screen bg-ando-navy">
      <Hero />
      <Biography />
      <PhotoGallery />
      <VideoGallery />
      {/* <Discography /> */}
      {/* <Stats /> */}
      {/* <TechRider /> */}
      <Contact />
    </main>
  );
}
