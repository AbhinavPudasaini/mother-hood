import Sidebar from "../../components/ui/sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-green-50">
      <Sidebar />
      <div className="flex-1 ml-20 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}