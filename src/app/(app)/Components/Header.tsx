"use client";
import Link from "next/link";
import { Briefcase, Search, List, LogIn, LogOut } from "lucide-react";
import { useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/logout");
      toast("Logout Successful");
      router.replace('/')
    } catch (error) {
      console.error("Logout failed:", error);
      toast("Error while Logout");
    }
  }, []);

  return (
    <header className="fixed w-full bg-[#111] text-gray-400 flex justify-between items-center py-4 px-6 shadow-md z-50">
      <Link href="/" className="text-4xl font-extrabold text-white">
        Ski↑↑<span className="text-blue-500">Pay</span>
      </Link>

      <nav className="flex space-x-6">
        {[
          {
            href: "/internships",
            icon: <Briefcase className="w-6 h-6 text-white" />,
            label: "Internships",
          },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="relative group"
            aria-label={item.label}
          >
            <div className="flex items-center justify-center relative">
              <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg group-hover:scale-110">
                {item.icon}
              </div>
              <p className="absolute top-full mt-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
                {item.label}
              </p>
            </div>
          </Link>
        ))}

        {/* Login / Logout Button */}
        {session ? (
          <button
            onClick={handleLogout}
            className="relative group flex items-center cursor-pointer justify-center"
            aria-label="Logout"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-red-500 to-pink-500 shadow-lg group-hover:scale-110">
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <p className="absolute top-full mt-1 px-3 py-1 bg-red-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
              Logout
            </p>
          </button>
        ) : (
          <Link
            href="/signIn"
            className="relative group flex items-center justify-center"
            aria-label="Login"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg group-hover:scale-110">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <p className="absolute top-full mt-1 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:translate-y-1 shadow-md">
              Login
            </p>
          </Link>
        )}
      </nav>
    </header>
  );
}
