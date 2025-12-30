import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ando-navy px-6 text-center">
      <h1 className="text-8xl font-bold text-ando-cyan md:text-9xl">404</h1>
      <p className="mt-4 text-xl text-ando-text md:text-2xl">
        Página no encontrada
      </p>
      <p className="mt-2 text-ando-text/60">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border-2 border-ando-cyan bg-transparent px-8 py-3 font-semibold text-ando-cyan transition-all hover:bg-ando-cyan hover:text-ando-navy"
      >
        Volver al inicio
      </Link>
    </main>
  );
}