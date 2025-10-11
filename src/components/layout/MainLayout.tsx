import { BottomNav } from "./BottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-16 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
