"use client";

import { useRouter } from 'next/navigation';

const actions = [
  { icon: "➕", label: "New Order", action: "orders" },
  { icon: "🐐", label: "Add Animal", action: "inventory" },
  { icon: "👥", label: "Add Customer", action: "customers" },
  { icon: "🧾", label: "Invoices", action: "invoices" },
];

export default function QuickActions() {
  const router = useRouter();

  const handleAction = (action: string) => {
    router.push(`/${action}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-[1rem] font-semibold">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 p-5">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleAction(action.action)}
            className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg bg-bg hover:border-primary hover:bg-primary/5 transition-all hover:shadow-md"
          >
            <span className="text-[1.5rem]">{action.icon}</span>
            <span className="text-[0.8rem] font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
