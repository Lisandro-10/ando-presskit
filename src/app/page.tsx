import Hero from '../components/Hero';
import Events from '../components/Events';
import LiveSets from '../components/LiveSets';
import Contact from '../components/Contact';
import { presskitData } from '../../lib/data';

export default function Home() {
  return (
    <main className="min-h-screen bg-ando-navy">
      <Hero {...presskitData.hero} />
      <Events {...presskitData.events} />
      <LiveSets sets={presskitData.liveSets} />
      <Contact {...presskitData.contact} />
    </main>
  );
}
