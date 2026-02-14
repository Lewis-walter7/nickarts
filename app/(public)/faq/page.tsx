'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How do I inquire about a private commission?",
            answer: "Private commissions begin with a dialogue. You can reach out via our contact form. We will discuss your vision, space requirements, and timeline before providing a formal proposal."
        },
        {
            question: "Do physical pieces come with certificates of authenticity?",
            answer: "Yes, every original physical masterpiece is accompanied by a museum-grade certificate of authenticity, hand-signed and sealed. Digital works are verified via blockchain-secured certificates."
        },
        {
            question: "What are the shipping and handling protocols?",
            answer: "We utilize specialized fine-art logistics for global delivery. Every piece is crated in industrial-grade plywood and climate-controlled during transit. Fully insured door-to-door service is standard."
        },
        {
            question: "Can I visit the studio in Nairobi?",
            answer: "The NickArts Studio is a private creative sanctuary in Nairobi. We host exclusive 'In-Process' viewings for established collectors by appointment only. Please contact us for current availability."
        },
        {
            question: "What materials are used for physical works?",
            answer: "We prioritize industrial resilience and organic flow. Our primary mediums include acrylic resins, salvaged steel, architectural-grade pigments, and sustainably sourced oversized canvases."
        }
    ];

    return (
        <div className="min-h-screen bg-dark glow-bg selection:bg-primary selection:text-white">
            <main className="relative pt-32 pb-20 px-6 md:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-16 md:mb-20 text-center items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Studio Intelligence
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] text-white">
                        Common <span className="text-primary italic">Inquiries.</span>
                    </h1>
                </div>

                {/* Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`glass rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 border-white/5 ${openIndex === i ? 'border-primary/20 bg-primary/[0.02]' : 'hover:border-white/10'}`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full px-6 md:px-8 py-6 md:py-8 flex items-center justify-between text-left group"
                            >
                                <span className={`text-base md:text-lg font-bold transition-colors ${openIndex === i ? 'text-primary' : 'text-white group-hover:text-primary'}`}>
                                    {faq.question}
                                </span>
                                <div className={`w-8 h-8 shrink-0 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-500 ${openIndex === i ? 'rotate-180 bg-primary border-primary text-white' : 'text-zinc-500'}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </button>

                            <div
                                className={`px-6 md:px-8 transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-96 pb-6 md:pb-8 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                            >
                                <p className="text-zinc-400 leading-relaxed text-sm md:text-lg pt-2">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 glass p-8 md:p-12 rounded-[32px] md:rounded-[40px] text-center border-white/5">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Still seeking clarity?</h2>
                    <p className="text-zinc-500 mb-8 text-sm md:text-base">Specialized vision requires direct dialogue. Our team is ready.</p>
                    <Link
                        href="/contact"
                        className="inline-flex w-full sm:w-auto justify-center bg-primary text-white font-black uppercase tracking-[0.2em] px-10 py-4 rounded-xl hover:bg-primary-hover transition-all"
                    >
                        Connect Directly
                    </Link>
                </div>
            </main>
        </div>
    );
}
