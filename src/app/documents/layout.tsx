import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
  description: "View document details",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function DocumentsLayout({ children }: RootLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {children}
    </div>
  );
}
