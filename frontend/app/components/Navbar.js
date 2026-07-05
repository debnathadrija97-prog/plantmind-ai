"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareText, Network, Factory } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Factory },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/copilot", label: "Copilot", icon: MessageSquareText },
    { href: "/graph", label: "Knowledge Graph", icon: Network },
  ];

  return (
    <nav className="bg-[#1e1b2e]/80 backdrop-blur border-b border-violet-800/40 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="bg-violet-500 rounded-lg p-1.5">
          <Factory size={18} className="text-white" />
        </div>
        <span className="font-bold text-violet-100 text-lg">PlantMind AI</span>
      </div>
      <div className="flex gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-violet-500 text-white"
                  : "text-violet-300 hover:bg-[#2a2340]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}