"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddCustomerModal from "@/components/AddCustomerModal";
import { getCustomers } from '@/lib/api';
import type { Customer } from "@/lib/types";

const mockCustomers: Customer[] = [
  {
    id: 1,
    full_name: "Mohammed Al-Rashid",
    phone_number: "+971501234567",
    email: "mohammed@email.com",
    address_line1: "123 Dubai St",
    city: "Dubai",
    emirate: "DUBAI",
    customer_type: "INDIVIDUAL",
    preferred_language: "EN",
    is_active: true,
    is_vip: true,
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-02-20T14:30:00Z",
    last_order_date: "2026-02-20T14:30:00Z",
    total_orders_count: 15,
    total_spent: 18500,
  },
  {
    id: 2,
    full_name: "Fatima Khalil",
    phone_number: "+971509876543",
    email: "fatima@email.com",
    address_line1: "456 Sharjah Rd",
    city: "Sharjah",
    emirate: "SHARJAH",
    customer_type: "INDIVIDUAL",
    preferred_language: "AR",
    is_active: true,
    is_vip: false,
    created_at: "2026-01-20T11:00:00Z",
    updated_at: "2026-02-18T16:00:00Z",
    last_order_date: "2026-02-18T16:00:00Z",
    total_orders_count: 8,
    total_spent: 9200,
  },
  {
    id: 3,
    full_name: "Ali Hassan",
    phone_number: "+971505551234",
    email: "ali@email.com",
    address_line1: "789 Abu Dhabi Ave",
    city: "Abu Dhabi",
    emirate: "ABU_DHABI",
    customer_type: "BUSINESS",
    preferred_language: "EN",
    is_active: true,
    is_vip: true,
    created_at: "2025-12-10T09:00:00Z",
    updated_at: "2026-02-25T12:00:00Z",
    last_order_date: "2026-02-25T12:00:00Z",
    total_orders_count: 22,
    total_spent: 32400,
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVIP, setFilterVIP] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "orders" | "spent" | "recent">("spent");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers();
      const data = Array.isArray(response) ? response : response.results || [];
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter and sort
  const filteredCustomers = customers
    .filter((c) => {
      const matchesSearch =
        c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone_number.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVIP = filterVIP === null || c.is_vip === filterVIP;
      return matchesSearch && matchesVIP;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.full_name.localeCompare(b.full_name);
        case "orders":
          return b.total_orders_count - a.total_orders_count;
        case "spent":
          return b.total_spent - a.total_spent;
        case "recent":
          return (
            new Date(b.last_order_date || 0).getTime() -
            new Date(a.last_order_date || 0).getTime()
          );
        default:
          return 0;
      }
    });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Customers" />
        
        <div className="p-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="text-[0.8rem] text-muted font-medium mb-2">Total Customers</div>
              <div className="text-[1.75rem] font-bold">{customers.length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="text-[0.8rem] text-muted font-medium mb-2">VIP Customers</div>
              <div className="text-[1.75rem] font-bold">
                {customers.filter((c) => c.is_vip).length}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="text-[0.8rem] text-muted font-medium mb-2">Total Orders</div>
              <div className="text-[1.75rem] font-bold">
                {customers.reduce((sum, c) => sum + c.total_orders_count, 0)}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="text-[0.8rem] text-muted font-medium mb-2">Total Revenue</div>
              <div className="text-[1.75rem] font-bold">
                AED {customers.reduce((sum, c) => sum + c.total_spent, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-card border border-border rounded-lg p-5 shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <select
                  value={filterVIP === null ? "all" : filterVIP ? "vip" : "regular"}
                  onChange={(e) =>
                    setFilterVIP(
                      e.target.value === "all" ? null : e.target.value === "vip"
                    )
                  }
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Customers</option>
                  <option value="vip">VIP Only</option>
                  <option value="regular">Regular Only</option>
                </select>
              </div>
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="spent">Sort by: Total Spent</option>
                  <option value="orders">Sort by: Order Count</option>
                  <option value="recent">Sort by: Recent Activity</option>
                  <option value="name">Sort by: Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-card border border-border rounded-lg shadow">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-[1rem] font-semibold">
                Customer List ({filteredCustomers.length})
              </h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium text-sm"
              >
                + Add Customer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Contact
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Location
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Orders
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Total Spent
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Last Order
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, idx) => (
                    <tr
                      key={customer.id}
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                        idx === filteredCustomers.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {customer.full_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[0.875rem] font-semibold">
                              {customer.full_name}
                            </div>
                            <div className="text-[0.75rem] text-muted">
                              {customer.customer_type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-[0.85rem]">{customer.phone_number}</div>
                        <div className="text-[0.75rem] text-muted">{customer.email}</div>
                      </td>
                      <td className="px-5 py-3 text-[0.85rem]">
                        <div>{customer.city}</div>
                        <div className="text-[0.75rem] text-muted">
                          {customer.emirate.replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[0.85rem] font-semibold">
                        {customer.total_orders_count}
                      </td>
                      <td className="px-5 py-3 text-[0.85rem] font-bold text-primary">
                        AED {customer.total_spent.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-[0.85rem] text-muted">
                        {customer.last_order_date
                          ? new Date(customer.last_order_date).toLocaleDateString()
                          : "Never"}
                      </td>
                      <td className="px-5 py-3">
                        {customer.is_vip && (
                          <span className="inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold bg-warning/10 text-amber-700">
                            ⭐ VIP
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddCustomerModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCustomers}
      />
    </div>
  );
}
