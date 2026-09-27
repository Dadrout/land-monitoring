import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f6f8fb]">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header title={title} subtitle={subtitle} />
        {children}
      </div>
    </div>
  );
}
