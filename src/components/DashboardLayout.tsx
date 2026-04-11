import { type ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import ParticleBackground from "./ParticleBackground";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen grain-overlay scanlines">
      <AppSidebar />
      <main className="flex-1 ml-[240px] relative">
        <div className="absolute inset-0 grid-overlay pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <ParticleBackground variant="dashboard" particleCount={40} />
        </div>
        <div className="relative z-10 p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
