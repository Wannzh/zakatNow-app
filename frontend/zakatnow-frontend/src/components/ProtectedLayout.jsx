import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function ProtectedLayout({ children, isAdmin = false }) {
  return (
    <div className="flex min-h-screen">
      {isAdmin ? <Sidebar /> : null}
      <div className="flex-1 flex flex-col">
        {!isAdmin ? <Navbar /> : null}
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
