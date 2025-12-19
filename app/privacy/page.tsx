export default function Privacy() {
    const sections = [
        {
            title: "Vision & Transparency",
            content: "At NickArts Studio, we treat your data with the same precision as our physical masterpieces. Transparency is our core aesthetic."
        },
        {
            title: "Collection Intelligence",
            content: "We collect minimal data necessary to facilitate private acquisitions, secure shipping, and studio communications. This include names, secure delivery addresses, and contact protocols."
        },
        {
            title: "Physical & Digital Sovereignty",
            content: "Your acquisition records are stored in high-security repositories. Digital certificates of authenticity (NFT metadata) are stored on decentralized ledgers, ensuring your ownership remains immutable."
        },
        {
            title: "Global Logistics Security",
            content: "To ensure museum-grade delivery, we share necessary logistics data with our specialized fine-art transit partners under strict non-disclosure agreements."
        }
    ];

    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-20 px-6 md:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Integrity Protocol
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-white">
                        Privacy <span className="text-primary italic">Statement.</span>
                    </h1>
                    <p className="text-zinc-500 max-w-xl text-sm uppercase tracking-widest font-bold mt-4">
                        Last Updated: December 2025
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-16">
                    {sections.map((section, i) => (
                        <div key={i} className="space-y-4">
                            <h2 className="text-2xl font-bold text-white border-l-2 border-primary pl-6">{section.title}</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed pl-6">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-32 pt-12 border-t border-white/5 text-zinc-600 text-sm">
                    <p>For detailed data requests or integrity inquiries, contact: security@nickarts.com</p>
                </div>
            </main>
        </div>
    );
}
