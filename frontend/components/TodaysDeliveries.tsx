"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrders } from '@/lib/api';
import type { Order } from '@/lib/types';

const statusStyles: Record<string, string> = {
  OUT_FOR_DELIVERY: "bg-purple-500/10 text-purple-600",
  PREPARING: "bg-warning/10 text-amber-700",
  READY: "bg-green-500/10 text-green-600",
  CONFIRMED: "bg-blue-500/10 text-blue-600",
};

const statusLabels: Record<string, string> = {
  OUT_FOR_DELIVERY: "En Route",
  PREPARING: "Preparing",
  READY: "Ready",
  CONFIRMED: "Scheduled",
};

export default function TodaysDeliveries() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeliveries() {
      try {
        const response = await getOrders();
        const orders = Array.isArray(response) ? response : response.results || [];
        
        // Filter today's deliveries
        const today = new Date().toISOString().split('T')[0];
        const todaysDeliveries = orders.filter(order => 
          order.delivery_date && 
          order.delivery_date.startsWith(today) &&
          ['CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(order.status)
        ).slice(0, 3);
        
        setDeliveries(todaysDeliveries);
      } catch (error) {
        console.error('Failed to fetch deliveries:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeliveries();
  }, []);
  return (
    <div className="bg-card border border-border rounded-lg shadow">
      <div className="px-5 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-[1rem] font-semibold">Today's Deliveries</h2>
        <button 
          onClick={() => router.push('/orders')}
          className="text-[0.8rem] text-primary font-medium hover:underline"
        >
          View All →
        </button>
      </div>
      <div className="p-5 space-y-4">
        {loading ? (
          <div className="text-center text-muted py-4">Loading deliveries...</div>
        ) : deliveries.length === 0 ? (
          <div className="text-center text-muted py-4">No deliveries scheduled for today</div>
        ) : (
          deliveries.map((delivery, idx) => (
            <div
              key={delivery.id}
              className={`flex justify-between items-center pb-4 ${
                idx < deliveries.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div>
                <div className="text-[0.85rem] font-medium">
                  {delivery.order_number} – {delivery.customer_name || `Customer #${delivery.customer}`}
                </div>
                <div className="text-[0.75rem] text-muted mt-0.5">
                  {delivery.delivery_address || delivery.delivery_method} · {delivery.delivery_date ? new Date(delivery.delivery_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'TBD'}
                </div>
              </div>
              <span
                className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${
                  statusStyles[delivery.status] || 'bg-gray-100 text-gray-600'
                }`}
              >
                {statusLabels[delivery.status] || delivery.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
