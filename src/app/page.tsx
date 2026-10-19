import Hero from '../components/Hero';
import Events from '../components/Events';
import LiveSets from '../components/LiveSets';
import TechRider from '../components/TechRider';
import Contact from '../components/Contact';
import { presskitData } from '../../lib/data';

export default function Home() {
  return (
    <main className="min-h-screen bg-ando-navy">
      <Hero {...presskitData.hero} />
      <Events {...presskitData.events} />
      <LiveSets sets={presskitData.liveSets} />
      <TechRider setups={presskitData.techRider} />
      <Contact {...presskitData.contact} />
    </main>
  );
}
