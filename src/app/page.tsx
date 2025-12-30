
import Biography from '../components/Biography';
import PhotoGallery from '../components/PhotoGallery';
import Contact from '../components/Contact';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen bg-ando-navy">
      <Hero />
      <Biography />
      <PhotoGallery />
      {/* <Discography /> */}
      {/* <Stats /> */}
      {/* <TechRider /> */}
      <Contact />
    </main>
  );
}
