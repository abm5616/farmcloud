"use client";

import { useEffect, useState } from "react";
import { getOrders, getCustomers, getAnimals } from '@/lib/api';

interface KPIData {
  todaysOrders: number;
  todaysRevenue: number;
  pendingOrders: number;
  availableStock: number;
}

export default function KPICards() {
  const [data, setData] = useState<KPIData>({
    todaysOrders: 0,
    todaysRevenue: 0,
    pendingOrders: 0,
    availableStock: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersResp, animalsResp] = await Promise.all([
          getOrders(),
          getAnimals()
        ]);

        // Extract results from paginated responses
        const orders = Array.isArray(ordersResp) ? ordersResp : ordersResp.results || [];
        const animals = Array.isArray(animalsResp) ? animalsResp : animalsResp.results || [];

        const revenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0);
        const pending = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
        const available = animals.filter(a => a.status === 'AVAILABLE').length;

        setData({
          todaysOrders: orders.length,
          todaysRevenue: revenue,
          pendingOrders: pending,
          availableStock: available,
        });
      } catch (error) {
        console.error('Failed to fetch KPI data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Today's Orders */}
      <div className="bg-card border border-border rounded-lg p-5 shadow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[0.8rem] text-muted font-medium">Today's Orders</span>
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-[1.1rem]">
            📦
          </div>
        </div>
        <div className="text-[1.75rem] font-bold leading-none mb-1">{data.todaysOrders}</div>
        <div className="text-[0.75rem] text-success flex items-center gap-1">
          ↑ 20% vs yesterday
        </div>
      </div>

      {/* Today's Revenue */}
      <div className="bg-card border border-border rounded-lg p-5 shadow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[0.8rem] text-muted font-medium">Today's Revenue</span>
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-[1.1rem]">
            💰
          </div>
        </div>
        <div className="text-[1.75rem] font-bold leading-none mb-1">
          AED {data.todaysRevenue.toLocaleString()}
        </div>
        <div className="text-[0.75rem] text-success flex items-center gap-1">
          ↑ 12% vs yesterday
        </div>
      </div>

      {/* Pending Orders */}
      <div className="bg-card border border-border rounded-lg p-5 shadow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[0.8rem] text-muted font-medium">Pending Orders</span>
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-[1.1rem]">
            ⏳
          </div>
        </div>
        <div className="text-[1.75rem] font-bold leading-none mb-1">{data.pendingOrders}</div>
        <div className="text-[0.75rem] text-destructive flex items-center gap-1">
          ↓ 2 from yesterday
        </div>
      </div>

      {/* Available Stock */}
      <div className="bg-card border border-border rounded-lg p-5 shadow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[0.8rem] text-muted font-medium">Available Stock</span>
          <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center text-[1.1rem]">
            🐐
          </div>
        </div>
        <div className="text-[1.75rem] font-bold leading-none mb-1">{data.availableStock}</div>
        <div className="text-[0.75rem] text-muted">18 goats, 16 sheep</div>
      </div>
    </div>
  );
}
