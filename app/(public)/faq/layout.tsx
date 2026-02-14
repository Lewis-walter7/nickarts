import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Common Inquiries",
    description: "Specialized vision requires direct dialogue. Find answers to frequently asked questions about NickArts commissions, shipping, and material resilience.",
};

export default function FAQLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
