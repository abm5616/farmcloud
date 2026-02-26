'use client';

import { useState } from 'react';
import Modal from './Modal';
import { updateOrder } from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  totalAmount: string;
  currentPaymentStatus: string;
  onPaymentUpdated: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  orderId,
  totalAmount,
  currentPaymentStatus,
  onPaymentUpdated,
}: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (paymentStatus === currentPaymentStatus) {
      onClose();
      return;
    }

    setError('');
    setLoading(true);

    try {
      await updateOrder(orderId, { payment_status: paymentStatus });
      onPaymentUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Payment Status">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Total Amount Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">AED {totalAmount}</p>
        </div>

        {/* Payment Status Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Status
          </label>
          <div className="space-y-2">
            <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              paymentStatus === 'pending'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="pending"
                checked={paymentStatus === 'pending'}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="mr-3 w-4 h-4 text-red-500 focus:ring-red-500"
              />
              <div className="flex-1">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Pending
                </span>
                <p className="text-xs text-gray-500 mt-1">Payment not received</p>
              </div>
            </label>

            <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              paymentStatus === 'partial'
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="partial"
                checked={paymentStatus === 'partial'}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="mr-3 w-4 h-4 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex-1">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  Partial
                </span>
                <p className="text-xs text-gray-500 mt-1">Partial payment received</p>
              </div>
            </label>

            <label className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              paymentStatus === 'paid'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="paid"
                checked={paymentStatus === 'paid'}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="mr-3 w-4 h-4 text-green-500 focus:ring-green-500"
              />
              <div className="flex-1">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Paid
                </span>
                <p className="text-xs text-gray-500 mt-1">Full payment received</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Payment'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
