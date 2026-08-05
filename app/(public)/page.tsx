import Image from "next/image";
import Link from "next/link";
import dbConnect from "@/lib/db";
import GalleryWork from "@/models/GalleryWork";

export const dynamic = 'force-dynamic';

interface FeaturedWork {
  _id: string;
  title: string;
  category: string;
  year: string;
  images?: string[];
  /** Pre-multi-image records stored a single URL here. */
  imageUrl?: string;
  price?: number;
  isSold?: boolean;
}

async function getFeaturedWorks(): Promise<FeaturedWork[]> {
  try {
    await dbConnect();
    const works = await GalleryWork.find({}).sort({ createdAt: -1 }).limit(4).lean();
    return JSON.parse(JSON.stringify(works));
  } catch (error) {
    console.error("Failed to fetch featured works", error);
    return [];
  }
}

export default async function Home() {
  const featuredWorks = await getFeaturedWorks();

  return (
    <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-dark">
      <main className="relative pt-32 pb-10 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center min-h-[80vh]">
          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold tracking-widest text-primary uppercase w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Elite Contemporary Artistic Vision
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-white max-w-lg">
              Create. Exhibit. <br />
              <span className="text-primary accent-display">Feel.</span>
            </h1>

            <p className="max-w-lg text-lg md:text-lg text-zinc-400 leading-relaxed">
              Draws inspiration from travel, lived experiences, and the power of imagination. Each piece captures moments, emotions, and stories gathered from different places and cultures, transforming them into expressive works of art.
              Working across oil, acrylic, and charcoal pencil, the studio creates, exhibits, and transcends visual boundaries—inviting viewers to feel, reflect, and connect beyond the canvas.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/gallery" className="px-8 py-4 rounded-xl bg-primary text-dark font-bold text-lg hover:bg-primary-hover shadow-[0_0_30px_rgba(201,162,39,0.3)] transition-all flex items-center gap-2 group">
                Enter Gallery
                <svg className="group-hover:translate-x-1 transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
              </Link>
              <Link href="/about" className="px-8 py-4 rounded-xl glass text-white font-bold text-lg hover:bg-white/10 transition-all">
                The Process
              </Link>
            </div>

          </div>

          {/* Hero Visuals */}
          <div className="relative group">
            {/* The Floating Art Piece */}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl scale-100 xl:scale-105 group-hover:scale-105 xl:group-hover:scale-110 transition-transform duration-700 bg-zinc-900 border border-white/10 aspect-[4/3]">
              <Image
                src="/hero-art.png"
                alt="Contemporary Masterpiece"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Floating UI Elements */}
            <div className="absolute -top-6 -right-6 z-20 glass p-4 rounded-2xl animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20m10-10H2" /></svg>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-white">Original Available</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -left-10 z-20 glass p-4 rounded-2xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">Origin</p>
                  <p className="text-xs md:text-sm font-bold text-white">Nairobi Studio</p>
                </div>
              </div>
            </div>

            {/* Backglow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full -z-10" />
          </div>
        </div>

        {/* Studio Preview Section */}
        <section className="mt-40 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-video border border-white/5 order-2 lg:order-1">
            <Image
              src="/studio-preview.png"
              alt="The NickArts studio in Nairobi"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            />
          </div>

          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <h2 className="text-4xl font-bold tracking-tight">Our <span className="text-primary accent-display">Process</span></h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              At Nick Arts Studio, our process begins with movement—travel, observation, and lived experience. Moments are captured through photographs, sketches, and memory, drawing inspiration from places, people, and emotions encountered along the journey.
            </p>
            <div className="space-y-4 pt-4">
              {[
                "Reimagined through thoughtful composition and experimentation",
                "Layers built slowly using oil, acrylic, and charcoal pencil",
                "Refined with intention to preserve the rawness of the moment"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <div className="w-1 h-1 rounded-full bg-primary group-hover:bg-white" />
                  </div>
                  <span className="text-zinc-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Gallery Section */}
        <section className="mt-40">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">Featured <span className="text-primary">Masterpieces</span></h2>
              <p className="text-zinc-400 max-w-md">Our latest curation of high-contrast contemporary works, ready for private acquisition.</p>
            </div>
            <Link href="/gallery" className="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2 hover:gap-4 transition-all group">
              View Full Collection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredWorks.map((work: FeaturedWork) => {
              const imageUrl = work.images?.[0] ?? work.imageUrl ?? '/hero-art.png';

              return (
                <Link key={work._id} href={`/gallery/${work._id}`} className="group cursor-pointer block focus-ring rounded-2xl">
                  {/* Matted rather than cropped — object-cover would cut the edges
                      off any work that isn't this cell's aspect ratio. */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden artwork-mat border border-white/5 mb-6 p-3">
                    <Image
                      src={imageUrl}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-3 group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-widest">
                      {work.category}
                    </div>
                    {work.isSold && (
                      <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-black text-white uppercase tracking-widest">
                        Sold
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{work.title}</h3>
                      <p className="text-zinc-400 text-sm">
                        {work.year} Edition {work.price ? `• KES ${work.price.toLocaleString()}` : ''}{work.isSold ? ' • Sold' : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
            {featuredWorks.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-400 border border-dashed border-zinc-800 rounded-2xl">
                No featured works available at the moment.
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-40 relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 p-12 md:p-20 text-center">
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-white max-w-3xl">
              Ready to define your <br /><span className="text-primary accent-display">private space?</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl">
              Commissions, acquisitions and studio visits all start with a conversation.
              Tell us what you have in mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/contact"
                className="bg-primary text-dark font-bold px-8 py-4 rounded-xl hover:bg-primary-hover transition-all focus-ring"
              >
                Start a Conversation
              </Link>
              <Link
                href="/gallery"
                className="glass text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all focus-ring"
              >
                Browse the Collection
              </Link>
            </div>
          </div>
          {/* Background Glows for CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[120%] bg-primary/20 blur-[150px] -z-10 rounded-full" />
        </section>
      </main>
    </div>
  );
}
