import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Portal - DateSL",
    description: "Administrative Dashboard",
};

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-gray-100">
            {children}
        </div>
    );
}
