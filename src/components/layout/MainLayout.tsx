import { useState } from "react";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { HamburgerMenu } from "./HamburgerMenu";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setMenuOpen(true)} />
      <main className="pt-14 pb-16 min-h-screen">
        {children}
      </main>
      <BottomNav />
      <HamburgerMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </div>
  );
};
