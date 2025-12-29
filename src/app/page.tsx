
import Biography from '../components/Biography';
import PhotoGallery from '../components/PhotoGallery';
import Discography from '../components/Discography';
import Stats from '../components/Stats';
import TechRider from '../components/TechRider';
import Contact from '../components/Contact';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <main className="min-h-screen bg-ando-navy">
      <Hero />
      <Biography />
      <PhotoGallery />
      <Discography />
      <Stats />
      <TechRider />
      <Contact />
    </main>
  );
}
