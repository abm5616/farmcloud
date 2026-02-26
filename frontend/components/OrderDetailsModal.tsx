'use client';

import Modal from './Modal';
import type { Order } from '@/lib/types';
import { generateInvoicePDF } from '@/lib/pdfService';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-purple-100 text-purple-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
  };

  const paymentStatusColors = {
    pending: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-orange-100 text-orange-800',
  };

  const handleDownloadPDF = () => {
    generateInvoicePDF(order);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.order_number}`}>
      <div className="space-y-6">
        {/* Status Section */}
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Order Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Payment Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[order.payment_status as keyof typeof paymentStatusColors]}`}>
              {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-medium">{order.payment_method}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Delivery Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <span className="font-medium">{order.delivery_type}</span>
            </div>
            {order.delivery_date && (
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">{new Date(order.delivery_date).toLocaleDateString()}</span>
              </div>
            )}
            {order.delivery_address && (
              <div>
                <p className="text-gray-500 mb-1">Address:</p>
                <p className="font-medium">{order.delivery_address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-start py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{item.item_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} × AED {item.unit_price}</p>
                </div>
                <p className="font-medium">AED {(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <span>AED {order.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery Fee:</span>
            <span>AED {order.delivery_fee}</span>
          </div>
          {parseFloat(order.discount_amount || '0') > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Discount:</span>
              <span>- AED {order.discount_amount}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>AED {order.total_amount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Download Invoice
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
