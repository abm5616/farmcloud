"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import KPICards from "@/components/KPICards";
import OrdersTable from "@/components/OrdersTable";
import QuickActions from "@/components/QuickActions";
import TodaysDeliveries from "@/components/TodaysDeliveries";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-[260px]">
        {/* Top Bar */}
        <Topbar title="Dashboard" />

        {/* Dashboard Content */}
        <div className="p-8">
          {/* KPI Cards */}
          <KPICards />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Recent Orders - Takes 2 columns */}
            <div className="lg:col-span-2">
              <OrdersTable />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <QuickActions />
              <TodaysDeliveries />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
