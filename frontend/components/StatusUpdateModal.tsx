'use client';

import { useState } from 'react';
import Modal from './Modal';
import { updateOrder } from '@/lib/api';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  currentStatus: string;
  onStatusUpdated: () => void;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'preparing', label: 'Preparing', color: 'bg-purple-100 text-purple-800' },
  { value: 'ready', label: 'Ready for Delivery', color: 'bg-green-100 text-green-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-gray-100 text-gray-800' },
];

export default function StatusUpdateModal({
  isOpen,
  onClose,
  orderId,
  currentStatus,
  onStatusUpdated,
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setError('');
    setLoading(true);

    try {
      await updateOrder(orderId, { status: selectedStatus });
      onStatusUpdated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Order Status">
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Status
          </label>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status.value}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStatus === status.value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status.value}
                  checked={selectedStatus === status.value}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mr-3 w-4 h-4 text-green-500 focus:ring-green-500"
                />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                  {status.label}
                </span>
              </label>
            ))}
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
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
