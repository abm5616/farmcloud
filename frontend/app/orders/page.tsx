"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddOrderModal from "@/components/AddOrderModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import StatusUpdateModal from "@/components/StatusUpdateModal";
import PaymentModal from "@/components/PaymentModal";
import { getOrders, deleteOrder } from '@/lib/api';
import type { Order } from "@/lib/types";

const mockOrders: Order[] = [
  {
    id: 1,
    order_number: "ORD-20260225-0001",
    customer: 1,
    customer_name: "Mohammed Al-Rashid",
    status: "PENDING",
    delivery_method: "HOME_DELIVERY",
    delivery_address: "123 Dubai Marina, Dubai",
    delivery_date: "2026-02-26",
    payment_status: "UNPAID",
    payment_method: "CASH",
    subtotal: "1200.00",
    delivery_fee: "50.00",
    discount_amount: "0.00",
    total_amount: "1250.00",
    amount_paid: "0.00",
    created_at: "2026-02-25T10:30:00Z",
    updated_at: "2026-02-25T10:30:00Z",
  },
  {
    id: 2,
    order_number: "ORD-20260225-0002",
    customer: 2,
    customer_name: "Fatima Khalil",
    status: "CONFIRMED",
    delivery_method: "HOME_DELIVERY",
    delivery_address: "456 Sharjah Road, Sharjah",
    delivery_date: "2026-02-27",
    payment_status: "PAID",
    payment_method: "CARD",
    subtotal: "900.00",
    delivery_fee: "40.00",
    discount_amount: "50.00",
    total_amount: "890.00",
    amount_paid: "890.00",
    created_at: "2026-02-25T11:00:00Z",
    updated_at: "2026-02-25T12:00:00Z",
  },
  {
    id: 3,
    order_number: "ORD-20260225-0003",
    customer: 3,
    customer_name: "Ali Hassan",
    status: "PREPARING",
    delivery_method: "FARM_PICKUP",
    delivery_date: "2026-02-26",
    payment_status: "PAID",
    payment_method: "BANK_TRANSFER",
    subtotal: "1800.00",
    delivery_fee: "0.00",
    discount_amount: "0.00",
    total_amount: "1800.00",
    amount_paid: "1800.00",
    created_at: "2026-02-24T15:00:00Z",
    updated_at: "2026-02-25T09:00:00Z",
  },
  {
    id: 4,
    order_number: "ORD-20260224-0015",
    customer: 1,
    customer_name: "Mohammed Al-Rashid",
    status: "OUT_FOR_DELIVERY",
    delivery_method: "HOME_DELIVERY",
    delivery_address: "123 Dubai Marina, Dubai",
    delivery_date: "2026-02-25",
    payment_status: "PAID",
    payment_method: "CASH",
    subtotal: "650.00",
    delivery_fee: "50.00",
    discount_amount: "0.00",
    total_amount: "700.00",
    amount_paid: "700.00",
    created_at: "2026-02-24T08:00:00Z",
    updated_at: "2026-02-25T14:00:00Z",
  },
  {
    id: 5,
    order_number: "ORD-20260223-0012",
    customer: 2,
    customer_name: "Fatima Khalil",
    status: "COMPLETED",
    delivery_method: "HOME_DELIVERY",
    delivery_date: "2026-02-24",
    payment_status: "PAID",
    payment_method: "CARD",
    subtotal: "2400.00",
    delivery_fee: "50.00",
    discount_amount: "100.00",
    total_amount: "2350.00",
    amount_paid: "2350.00",
    created_at: "2026-02-23T10:00:00Z",
    updated_at: "2026-02-24T16:00:00Z",
    completed_at: "2026-02-24T16:00:00Z",
  },
];

const statusColors = {
  PENDING: "bg-gray-500/10 text-gray-700",
  CONFIRMED: "bg-blue-500/10 text-blue-700",
  PREPARING: "bg-warning/10 text-amber-700",
  READY: "bg-purple-500/10 text-purple-700",
  OUT_FOR_DELIVERY: "bg-indigo-500/10 text-indigo-700",
  DELIVERED: "bg-success/10 text-success",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const paymentColors = {
  UNPAID: "text-destructive",
  PARTIAL: "text-warning",
  PAID: "text-success",
  REFUNDED: "text-muted",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders();
      // API returns paginated response, extract results array
      const data = Array.isArray(response) ? response : response.results || [];
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesPayment = filterPayment === "all" || order.payment_status === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleUpdatePayment = (order: Order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await deleteOrder(orderId);
      await fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order');
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    confirmed: orders.filter((o) => o.status === "CONFIRMED" || o.status === "PREPARING").length,
    inProgress: orders.filter((o) => o.status === "OUT_FOR_DELIVERY" || o.status === "READY").length,
    completed: orders.filter((o) => o.status === "COMPLETED" || o.status === "DELIVERED").length,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Orders" />

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Orders</div>
              <div className="text-[1.5rem] font-bold">{stats.total}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Pending</div>
              <div className="text-[1.5rem] font-bold text-gray-600">{stats.pending}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Confirmed</div>
              <div className="text-[1.5rem] font-bold text-blue-600">{stats.confirmed}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">In Progress</div>
              <div className="text-[1.5rem] font-bold text-warning">{stats.inProgress}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Completed</div>
              <div className="text-[1.5rem] font-bold text-success">{stats.completed}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-5 shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by order number or customer..."
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
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PREPARING">Preparing</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Payments</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="PARTIAL">Partial</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-card border border-border rounded-lg shadow">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-[1rem] font-semibold">Orders ({filteredOrders.length})</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium text-sm"
              >
                + New Order
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Order #
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Customer
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Payment
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Total
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Delivery
                    </th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-right px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, idx) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer ${
                        idx === filteredOrders.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-[0.85rem] font-semibold text-primary">
                        {order.order_number}
                      </td>
                      <td className="px-5 py-3 text-[0.85rem]">{order.customer_name}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${
                            statusColors[order.status]
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className={`px-5 py-3 text-[0.85rem] font-medium ${paymentColors[order.payment_status]}`}>
                        {order.payment_status}
                      </td>
                      <td className="px-5 py-3 text-[0.85rem] font-semibold">
                        AED {parseFloat(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-[0.75rem] text-muted">
                        {order.delivery_method.replace("_", " ")}
                      </td>
                      <td className="px-5 py-3 text-[0.85rem] text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleViewDetails(order); }}
                            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                            title="View Details"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order); }}
                            className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                            title="Update Status"
                          >
                            Status
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdatePayment(order); }}
                            className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                            title="Update Payment"
                          >
                            Payment
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                            title="Delete Order"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddOrderModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchOrders}
      />
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={selectedOrder}
      />
      <StatusUpdateModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        orderId={selectedOrder?.id || 0}
        currentStatus={selectedOrder?.status.toLowerCase() || 'pending'}
        onStatusUpdated={() => { fetchOrders(); setShowStatusModal(false); }}
      />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderId={selectedOrder?.id || 0}
        totalAmount={selectedOrder?.total_amount || '0'}
        currentPaymentStatus={selectedOrder?.payment_status.toLowerCase() || 'pending'}
        onPaymentUpdated={() => { fetchOrders(); setShowPaymentModal(false); }}
      />
    </div>
  );
}
