/**
 * Migration script: uploads current content from lib/data.ts + public/ to Sanity.
 * Run with: npx tsx scripts/migrate.ts
 *
 * Idempotent: uses deterministic _id + createOrReplace — safe to re-run.
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

// Rank strings that sort correctly alphabetically for initial ordering
function rank(index: number): string {
  return String(index).padStart(6, '0')
}

async function uploadAsset(filePath: string, type: 'image' | 'file') {
  const absPath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''))
  const stream = fs.createReadStream(absPath)
  const filename = path.basename(absPath)
  const asset = await client.assets.upload(type, stream, { filename })
  console.log(`  uploaded ${filename} → ${asset._id}`)
  return asset
}

async function main() {
  // ── Photos ──────────────────────────────────────────────────────────────────
  console.log('\n📷  Migrating photos...')
  const photos = [
    { src: '/photos/fiesta_under.jpeg', title: 'RANCHO APARTE', description: '' },
    { src: '/photos/finca-la-anita.jpg', title: 'FINCA LA ANITA', description: '' },
    { src: '/photos/piba_16-05-2026.jpg', title: 'PIBÄ BAR', description: '' },
    { src: '/photos/finca_anita_byn.jpeg', title: 'SUNSET FINCA LA ANITA', description: '' },
  ]

  for (const [i, photo] of photos.entries()) {
    const asset = await uploadAsset(photo.src, 'image')
    await client.createOrReplace({
      _id: `photo-${i}`,
      _type: 'photo',
      title: photo.title,
      description: photo.description,
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      orderRank: rank(i),
    })
    console.log(`  ✓ photo-${i}: ${photo.title}`)
  }

  // ── Videos ──────────────────────────────────────────────────────────────────
  console.log('\n🎬  Migrating videos...')
  const videos = [
    { src: '/videos/video-1.mp4', orientation: 'wide' },
    { src: '/videos/piba_16-05-2026.mp4', orientation: 'tall' },
    { src: '/videos/rancho_aparte_3.mp4', orientation: 'wide' },
    { src: '/videos/piba.mp4', orientation: 'tall' },
    { src: '/videos/video-2.mp4', orientation: 'wide' },
    { src: '/videos/video-5.mp4', orientation: 'tall' },
  ]

  for (const [i, video] of videos.entries()) {
    const asset = await uploadAsset(video.src, 'file')
    await client.createOrReplace({
      _id: `video-${i}`,
      _type: 'video',
      file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } },
      orientation: video.orientation,
      orderRank: rank(i),
    })
    console.log(`  ✓ video-${i}: ${path.basename(video.src)}`)
  }

  // ── Hero background ─────────────────────────────────────────────────────────
  console.log('\n🖼️   Uploading hero background...')
  const heroAsset = await uploadAsset('/photos/hero-bg.jpg', 'image')

  // ── Live Sets ────────────────────────────────────────────────────────────────
  console.log('\n🎵  Migrating live sets...')
  const liveSets = [
    { title: 'Hidden Echoes Vol. 1', trackUrl: 'https://soundcloud.com/ando-ku/ando-hidden-echoes-set-vol-1' },
    { title: 'Echoes in the Dark Set (Vol.2)', trackUrl: 'https://soundcloud.com/ando-ku/ando-echoes-in-the-dark-set' },
  ]

  for (const [i, set] of liveSets.entries()) {
    await client.createOrReplace({
      _id: `liveSet-${i}`,
      _type: 'liveSet',
      title: set.title,
      trackUrl: set.trackUrl,
      orderRank: rank(i),
    })
    console.log(`  ✓ liveSet-${i}: ${set.title}`)
  }

  // ── Contacts ─────────────────────────────────────────────────────────────────
  console.log('\n📞  Migrating contacts...')
  const contacts = [
    { name: 'Lisandro Andia', email: 'lisandroandia14@gmail.com', phone: '+54 9 261 2567201', instagram: 'https://instagram.com/lisan_andia' },
    { name: 'Juan Pablo Andia', phone: '+54 9 261 2191185', instagram: 'https://instagram.com/coloandia' },
  ]

  for (const [i, contact] of contacts.entries()) {
    await client.createOrReplace({
      _id: `contact-${i}`,
      _type: 'contact',
      name: contact.name,
      email: (contact as { email?: string }).email,
      phone: contact.phone,
      instagram: contact.instagram,
      orderRank: rank(i),
    })
    console.log(`  ✓ contact-${i}: ${contact.name}`)
  }

  // ── Site Settings (singleton) ─────────────────────────────────────────────
  console.log('\n⚙️   Creating siteSettings singleton...')
  const biographyColumn1 = [
    { _key: 'seg-1-0', text: 'ANDO', emphasis: 'brand' },
    { _key: 'seg-1-1', text: ' es un proyecto de música House conformado por Juan Pablo y Lisandro Andia, dos primos unidos por la música y el descubrimiento de sonidos en conjunto. Su propuesta sonora transita entre la profundidad del ' },
    { _key: 'seg-1-2', text: 'Progressive House', emphasis: 'strong' },
    { _key: 'seg-1-3', text: ' y la energía del ' },
    { _key: 'seg-1-4', text: 'Tech House', emphasis: 'strong' },
    { _key: 'seg-1-5', text: ', convergiendo siempre en un groove persistente que funciona como hilo conductor de su identidad. La narrativa de sus sets es progresiva, evolucionando desde sonidos orgánicos hacia momentos de mayor intensidad.' },
  ]
  const biographyColumn2 = [
    { _key: 'seg-2-0', text: 'Lo que define a ' },
    { _key: 'seg-2-1', text: 'ANDO', emphasis: 'brand' },
    { _key: 'seg-2-2', text: ' es la química natural en el set. Haber crecido juntos escuchando música les permite retroalimentar sus gustos logrando una conexión que se traduce en un sello propio.' },
  ]

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    heroTagline: 'Progressive House/ Tech House',
    heroImage: { _type: 'image', asset: { _type: 'reference', _ref: heroAsset._id } },
    biographyColumn1,
    biographyColumn2,
    socials: {
      instagram: 'https://instagram.com/ando.ku',
      soundcloud: '#',
      spotify: '#',
    },
    directEmail: 'info.ando.ku@gmail.com',
  })
  console.log('  ✓ siteSettings')

  console.log('\n✅  Migration complete!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
