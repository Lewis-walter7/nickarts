export default function Terms() {
    const points = [
        {
            title: "Artistic Sovereignty",
            desc: "All creative works, physical or digital, remain the intellectual property of NickArts Studio and the original creator. Acquisition grants the right to possess and display, but not to reproduce for commercial gain."
        },
        {
            title: "Commission Protocols",
            desc: "Private commissions require a non-refundable initiation fee of 35%. Final delivery is subject to aesthetic alignment. We do not guarantee a specific result, but a specific mastery."
        },
        {
            title: "Logistics & Liability",
            desc: "Risk of loss transfers to the collector upon hand-off to the specialized logistics partner. We provide full transit insurance as standard to mitigate all atmospheric risks."
        },
        {
            title: "Digital Masters (NFTs)",
            desc: "Digital works are governed by the underlying smart contract. Resale royalties are hard-coded at 10% to support the ongoing studio vision."
        }
    ];

    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-20 px-6 md:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Governance Agreement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-white">
                        Terms of <span className="text-primary italic">Service.</span>
                    </h1>
                    <p className="text-zinc-500 max-w-xl text-sm uppercase tracking-widest font-bold mt-4">
                        Effective Date: December 2025
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {points.map((point, i) => (
                        <div key={i} className="glass p-8 md:p-12 rounded-[32px] border-white/5 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-primary font-black text-2xl italic opacity-50">0{i + 1}</span>
                                <h2 className="text-2xl font-bold text-white">{point.title}</h2>
                            </div>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                {point.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-40 glass p-10 rounded-3xl border-white/5">
                    <h3 className="text-white font-bold mb-4">Governing Law</h3>
                    <p className="text-zinc-500 text-sm">
                        These terms are governed by the laws of the Czech Republic. Any disputes will be settled in the specialized courts of Prague.
                    </p>
                </div>
            </main>
        </div>
    );
}
