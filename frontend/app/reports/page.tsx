"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getOrders, getCustomers, getAnimals } from '@/lib/api';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topCustomer: '',
    topCustomerSpent: 0,
    animalsSold: 0,
    conversionRate: 0,
    growthRate: 0,
  });

  const [salesByDay, setSalesByDay] = useState<{day: string, amount: number}[]>([]);

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [ordersResp, customersResp, animalsResp] = await Promise.all([
        getOrders(),
        getCustomers(),
        getAnimals()
      ]);

      // Extract results from paginated responses
      const orders = Array.isArray(ordersResp) ? ordersResp : ordersResp.results || [];
      const customers = Array.isArray(customersResp) ? customersResp : customersResp.results || [];
      const animals = Array.isArray(animalsResp) ? animalsResp : animalsResp.results || [];

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || '0'), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Find top customer
      const customerSpending = customers.map(c => ({
        name: c.full_name,
        spent: c.total_spent || 0
      })).sort((a, b) => b.spent - a.spent);
      
      const animalsSold = animals.filter(a => a.status === 'SOLD').length;

      setStats({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topCustomer: customerSpending[0]?.name || 'N/A',
        topCustomerSpent: customerSpending[0]?.spent || 0,
        animalsSold,
        conversionRate: 85.5,
        growthRate: 12.3,
      });

      // Simulate sales by day data
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          day: date.toLocaleDateString('en-US', {weekday: 'short'}),
          amount: Math.floor(Math.random() * 5000) + 1000
        };
      });
      setSalesByDay(last7Days);

    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: string) => {
    alert(`📊 Exporting report as ${format.toUpperCase()}\n\n✓ In production, this would generate a ${format.toUpperCase()} file with all report data`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Reports & Analytics" />

        <div className="p-8">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportReport('pdf')}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm"
              >
                📥 Export PDF
              </button>
              <button
                onClick={() => exportReport('excel')}
                className="px-4 py-2 bg-green-500/10 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors font-medium text-sm"
              >
                📊 Export Excel
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="text-[0.8rem] text-muted font-medium">Total Revenue</div>
                <div className="text-[1.2rem]">💰</div>
              </div>
              <div className="text-[1.75rem] font-bold mb-1">AED {stats.totalRevenue.toLocaleString()}</div>
              <div className="text-[0.75rem] text-success">↑ {stats.growthRate}% from last period</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="text-[0.8rem] text-muted font-medium">Total Orders</div>
                <div className="text-[1.2rem]">📦</div>
              </div>
              <div className="text-[1.75rem] font-bold mb-1">{stats.totalOrders}</div>
              <div className="text-[0.75rem] text-muted">Avg: AED {stats.averageOrderValue.toFixed(2)}</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="text-[0.8rem] text-muted font-medium">Animals Sold</div>
                <div className="text-[1.2rem]">🐐</div>
              </div>
              <div className="text-[1.75rem] font-bold mb-1">{stats.animalsSold}</div>
              <div className="text-[0.75rem] text-muted">Conversion: {stats.conversionRate}%</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-5 shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="text-[0.8rem] text-muted font-medium">Top Customer</div>
                <div className="text-[1.2rem]">⭐</div>
              </div>
              <div className="text-[1rem] font-bold mb-1">{stats.topCustomer}</div>
              <div className="text-[0.75rem] text-muted">AED {stats.topCustomerSpent.toLocaleString()}</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Sales Chart */}
            <div className="bg-card border border-border rounded-lg p-6 shadow">
              <h3 className="text-[1rem] font-semibold mb-4">Sales Trend (Last 7 Days)</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {salesByDay.map((day, idx) => {
                  const maxAmount = Math.max(...salesByDay.map(d => d.amount));
                  const height = (day.amount / maxAmount) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full group">
                        <div
                          className="w-full bg-primary rounded-t transition-all hover:bg-primary-dark"
                          style={{height: `${height * 2}px`}}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          AED {day.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-[0.7rem] text-muted">{day.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-card border border-border rounded-lg p-6 shadow">
              <h3 className="text-[1rem] font-semibold mb-4">Order Status Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completed</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-success h-3 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>In Progress</span>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-warning h-3 rounded-full" style={{width: '30%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Pending</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: '20%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cancelled</span>
                    <span className="font-semibold">5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-destructive h-3 rounded-full" style={{width: '5%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Reports */}
            <div className="bg-card border border-border rounded-lg p-6 shadow">
              <h3 className="text-[1rem] font-semibold mb-4">Quick Reports</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium text-sm">📊 Sales Report</div>
                  <div className="text-xs text-muted">Detailed sales analysis</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium text-sm">👥 Customer Report</div>
                  <div className="text-xs text-muted">Customer analytics</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium text-sm">🐐 Inventory Report</div>
                  <div className="text-xs text-muted">Stock and animals</div>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="font-medium text-sm">💵 Financial Report</div>
                  <div className="text-xs text-muted">Revenue and expenses</div>
                </button>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="bg-card border border-border rounded-lg p-6 shadow lg:col-span-2">
              <h3 className="text-[1rem] font-semibold mb-4">Performance Indicators</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success">85.5%</div>
                  <div className="text-sm text-muted mt-1">Customer Satisfaction</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">92.3%</div>
                  <div className="text-sm text-muted mt-1">On-Time Delivery</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">3.2 days</div>
                  <div className="text-sm text-muted mt-1">Avg Processing Time</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success">AED 1,250</div>
                  <div className="text-sm text-muted mt-1">Avg Order Value</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
