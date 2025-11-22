import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function ProtectedLayout({ children, isAdmin = false }) {
  return (
    <div className="flex min-h-screen">
      {isAdmin ? <Sidebar /> : null}
      <div className="flex flex-col flex-1">
        {!isAdmin ? <Navbar /> : null}
        <main className="flex-1">{children}</main>
        {isAdmin ? null : <Footer />}
      </div>
    </div>
  );
}
