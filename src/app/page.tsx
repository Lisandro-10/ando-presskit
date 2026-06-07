import Biography from '../components/Biography';
import LiveSets from '../components/LiveSets';
import PhotoGallery from '../components/PhotoGallery';
import Contact from '../components/Contact';
import Hero from '../components/Hero';
import VideoGallery from '../components/VideoGallery';
import Footer from '../components/Footer';
import { client } from '../../sanity/client';
import { urlFor } from '../../sanity/image';
import { PRESSKIT_QUERY } from '../../sanity/queries';
import type { BiographySegment, Photo, Video, LiveSet, Contact as ContactType } from '../../lib/data';

export const revalidate = 60;

export default async function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await client.fetch(PRESSKIT_QUERY);

  const settings = data?.settings ?? {};

  const photos: Photo[] = (data?.photos ?? []).map((p: any) => ({
    src: p.image ? urlFor(p.image).width(1200).url() : '',
    title: p.title ?? '',
    description: p.description ?? '',
  }));

  const videos: Video[] = (data?.videos ?? []).map((v: any) => ({
    src: v.src ?? '',
    orientation: v.orientation,
    poster: v.poster ?? undefined,
  }));

  const liveSets: LiveSet[] = (data?.liveSets ?? []).map((s: any) => ({
    title: s.title ?? '',
    trackUrl: s.trackUrl ?? '',
    description: s.description,
  }));

  const contacts: ContactType[] = (data?.contacts ?? []).map((c: any) => ({
    name: c.name ?? '',
    email: c.email,
    phone: c.phone ?? '',
    instagram: c.instagram ?? '',
  }));

  const heroImageUrl: string | undefined = settings.heroImage
    ? urlFor(settings.heroImage).width(1920).url()
    : undefined;

  const column1: BiographySegment[] = settings.biographyColumn1 ?? [];
  const column2: BiographySegment[] = settings.biographyColumn2 ?? [];

  return (
    <main className="min-h-screen bg-ando-navy">
      <Hero
        tagline={settings.heroTagline}
        heroImageUrl={heroImageUrl}
      />
      <Biography column1={column1} column2={column2} />
      <LiveSets sets={liveSets} />
      <PhotoGallery photos={photos} />
      <VideoGallery videos={videos} />
      <Contact contacts={contacts} directEmail={settings.directEmail} />
      <Footer />
    </main>
  );
}
