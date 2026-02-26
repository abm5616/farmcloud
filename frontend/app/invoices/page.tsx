"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getOrders } from '@/lib/api';
import type { Order } from '@/lib/types';

export default function InvoicesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      const data = Array.isArray(response) ? response : response.results || [];
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.payment_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.payment_status === 'PAID').length,
    unpaid: orders.filter(o => o.payment_status === 'UNPAID').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.total_amount || '0'), 0),
    collected: orders.filter(o => o.payment_status === 'PAID').reduce((sum, o) => sum + parseFloat(o.total_amount || '0'), 0),
  };

  const downloadInvoice = (order: Order) => {
    alert(`📥 Downloading invoice for ${order.order_number}\n\n✓ In production, this would generate a PDF invoice using a library like jsPDF or React-PDF`);
  };

  const sendInvoice = (order: Order) => {
    alert(`📧 Sending invoice ${order.order_number} to ${order.customer_name}\n\n✓ In production, this would email the invoice to the customer`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Invoices" />

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Invoices</div>
              <div className="text-[1.5rem] font-bold">{stats.total}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Paid</div>
              <div className="text-[1.5rem] font-bold text-success">{stats.paid}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Unpaid</div>
              <div className="text-[1.5rem] font-bold text-destructive">{stats.unpaid}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Revenue</div>
              <div className="text-[1.5rem] font-bold">AED {stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Collected</div>
              <div className="text-[1.5rem] font-bold text-success">AED {stats.collected.toLocaleString()}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-5 shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by invoice number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIAL">Partial</option>
              </select>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-card border border-border rounded-lg shadow">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-[1rem] font-semibold">Invoices ({filteredInvoices.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Invoice #
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Payment Status
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-muted">
                        Loading invoices...
                      </td>
                    </tr>
                  ) : filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-muted">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((order, idx) => (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                          idx === filteredInvoices.length - 1 ? "border-b-0" : ""
                        }`}
                      >
                        <td className="px-5 py-3 text-[0.85rem] font-semibold text-primary">
                          INV-{order.order_number}
                        </td>
                        <td className="px-5 py-3 text-[0.85rem]">{order.customer_name}</td>
                        <td className="px-5 py-3 text-[0.85rem] text-muted">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3 text-[0.85rem] font-semibold">
                          AED {parseFloat(order.total_amount).toLocaleString()}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${
                              order.payment_status === 'PAID'
                                ? 'bg-success/10 text-success'
                                : order.payment_status === 'PARTIAL'
                                ? 'bg-warning/10 text-amber-700'
                                : 'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => downloadInvoice(order)}
                              className="px-3 py-1 text-xs bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20 transition-colors"
                              title="Download PDF"
                            >
                              📥 PDF
                            </button>
                            <button
                              onClick={() => sendInvoice(order)}
                              className="px-3 py-1 text-xs bg-green-500/10 text-green-600 rounded hover:bg-green-500/20 transition-colors"
                              title="Send Email"
                            >
                              📧 Send
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
