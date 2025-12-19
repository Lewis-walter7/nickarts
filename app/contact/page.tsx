import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Start the Dialogue",
    description: "Connect with the NickArts studio in Nairobi. Inquire about private commissions, gallery acquisitions, or press collaborations.",
};

export default function Contact() {
    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-16 px-6 md:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-16 md:mb-20 text-center items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Direct Communication
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-white">
                        Start the <br />
                        <span className="text-primary italic">Dialogue.</span>
                    </h1>
                    <p className="text-zinc-500 max-w-xl text-base md:text-lg mt-4 px-4">
                        Whether you're inquiring about a private commission, a gallery listing, or a press collaboration, our studio team is here to assist.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                    {/* Contact Form */}
                    <div className="lg:col-span-3 glass p-6 md:p-16 rounded-[32px] md:rounded-[40px] border border-white/5">
                        <form className="space-y-6 md:space-y-8">
                            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Subject</label>
                                <select className="w-full bg-zinc-900 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                                    <option>Private Commission Inquiry</option>
                                    <option>Gallery Acquisition</option>
                                    <option>Press & Media</option>
                                    <option>General Question</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Describe your vision or inquiry..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 py-3.5 md:px-6 md:py-4 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                />
                            </div>

                            <button className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-primary-hover shadow-[0_0_40px_rgba(255,77,0,0.2)] transition-all">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Details */}
                    <div className="lg:col-span-2 space-y-10 md:space-y-12 pt-4 md:pt-8 px-4 md:px-0 relative">
                        <div className="space-y-4">
                            <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em]">The Studio</h3>
                            <p className="text-white text-2xl font-bold leading-tight">
                                Nairobi, <br />
                                Kenya
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em]">Communication</h3>
                            <p className="text-white text-2xl font-bold">
                                +254 720 013 389
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.3em]">Social Flows</h3>
                            <div className="flex flex-wrap gap-6">
                                {[
                                    { name: "Instagram", href: "https://www.instagram.com/wayneotanga/" },
                                    { name: "WhatsApp", href: "https://wa.me/+254720013389" },
                                    { name: "TikTok", href: "https://tiktok.com/@nickarts19" }
                                ].map((social) => (
                                    <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-primary transition-colors">
                                        {social.name}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Back Glow */}
                        <div className="absolute -bottom-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full -z-10" />
                    </div>
                </div>
            </main>
        </div>
    );
}
