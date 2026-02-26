"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: "📊", label: "Dashboard", href: "/" },
  { icon: "📦", label: "Orders", href: "/orders" },
  { icon: "👥", label: "Customers", href: "/customers" },
  { icon: "🐐", label: "Inventory", href: "/inventory" },
  { icon: "🏷️", label: "Offers", href: "/offers" },
  { icon: "🧾", label: "Invoices", href: "/invoices" },
];

const analyticsItems = [
  { icon: "📈", label: "Reports", href: "/reports" },
];

const settingsItems = [
  { icon: "⚙️", label: "Settings", href: "/settings" },
  { icon: "🔐", label: "Users", href: "/users" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-sidebar-bg text-sidebar-fg fixed left-0 top-0 bottom-0 flex flex-col z-50">
      {/* Header */}
      <div className="p-5 border-b border-sidebar-accent">
        <div className="flex items-center gap-2 text-sidebar-highlight font-bold text-[1.3rem]">
          <span className="text-[1.6rem]">🐐</span>
          FarmCloud
        </div>
        <div className="text-[0.7rem] text-sidebar-muted mt-1 uppercase tracking-wider">
          Admin Portal
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-[0.65rem] rounded text-[0.875rem] transition-all ${
                isActive
                  ? "bg-sidebar-highlight text-white font-medium"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-fg"
              }`}
            >
              <span className="text-[1.1rem] w-6 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        {/* Analytics Section */}
        <div className="pt-6">
          <div className="text-[0.7rem] text-sidebar-muted uppercase tracking-wider px-3 py-2">
            Analytics
          </div>
          {analyticsItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-[0.65rem] rounded text-[0.875rem] transition-all ${
                  isActive
                    ? "bg-sidebar-highlight text-white font-medium"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-fg"
                }`}
              >
                <span className="text-[1.1rem] w-6 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Settings Section */}
        <div className="pt-6">
          <div className="text-[0.7rem] text-sidebar-muted uppercase tracking-wider px-3 py-2">
            Settings
          </div>
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-[0.65rem] rounded text-[0.875rem] transition-all ${
                  isActive
                    ? "bg-sidebar-highlight text-white font-medium"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-fg"
                }`}
              >
                <span className="text-[1.1rem] w-6 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer - User Info */}
      <div className="p-4 border-t border-sidebar-accent flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-sidebar-highlight flex items-center justify-center text-white text-[0.85rem] font-semibold">
          AM
        </div>
        <div className="flex-1">
          <div className="text-[0.85rem] font-medium">Ahmed M.</div>
          <div className="text-[0.7rem] text-sidebar-muted">Manager</div>
        </div>
      </div>
    </aside>
  );
}
