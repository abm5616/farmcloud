"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders } from '@/lib/api';
import type { Order } from '@/lib/types';

const orders: any[] = [];

const getStatusStyle = (status: string) => {
  const styles: Record<string, string> = {
    PENDING: "bg-blue-500/10 text-blue-600",
    CONFIRMED: "bg-success/10 text-success",
    PREPARING: "bg-warning/10 text-amber-700",
    OUT_FOR_DELIVERY: "bg-purple-500/10 text-purple-600",
    DELIVERED: "bg-gray-500/10 text-muted",
    CANCELLED: "bg-destructive/10 text-destructive",
  };
  return styles[status] || "bg-gray-500/10 text-muted";
};

export default function OrdersTable() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getOrders();
        const data = Array.isArray(response) ? response : response.results || [];
        setOrders(data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg shadow">
        <div className="p-5 text-center text-muted">Loading orders...</div>
      </div>
    );
  }
  return (
    <div className="bg-card border border-border rounded-lg shadow">
      <div className="px-5 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-[1rem] font-semibold">Recent Orders</h2>
        <button 
          onClick={() => router.push('/orders')}
          className="text-[0.8rem] text-primary font-medium hover:underline"
        >
          View All →
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                Order
              </th>
              <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                Customer
              </th>
              <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                Items
              </th>
              <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                Total
              </th>
              <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                Payment
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-muted">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                    idx === orders.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <td className="px-5 py-3 text-[0.85rem] font-semibold text-primary">
                    #{order.order_number}
                  </td>
                  <td className="px-5 py-3 text-[0.85rem]">{order.customer_name || `Customer #${order.customer}`}</td>
                  <td className="px-5 py-3 text-[0.85rem]">{order.items && order.items.length > 0 ? order.items[0]?.item_name : 'N/A'}</td>
                  <td className="px-5 py-3 text-[0.85rem]">AED {order.total_amount}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${
                        getStatusStyle(order.status)
                      }`}
                    >
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 text-[0.85rem] font-medium ${
                      order.payment_status === "PAID" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {order.payment_status === "PAID" ? "Paid" : "Unpaid"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
