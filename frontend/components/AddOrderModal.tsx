"use client";

import { useState, useEffect } from 'react';
import Modal from './Modal';
import QuickAddCustomerModal from './QuickAddCustomerModal';
import { createOrder, getCustomers, getAnimals, getOffers } from '@/lib/api';
import type { Customer, Animal, Offer } from '@/lib/types';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface OrderItem {
  type: 'animal' | 'offer';
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function AddOrderModal({ isOpen, onClose, onSuccess }: AddOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [showQuickAddCustomer, setShowQuickAddCustomer] = useState(false);
  
  const [formData, setFormData] = useState({
    customer: '',
    delivery_method: 'HOME_DELIVERY',
    delivery_address: '',
    delivery_date: '',
    payment_method: 'CASH',
    delivery_fee: '50',
    discount_amount: '0',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      // Set default delivery date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData(prev => ({
        ...prev,
        delivery_date: tomorrow.toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [customersResp, animalsResp, offersResp] = await Promise.all([
        getCustomers(),
        getAnimals(),
        getOffers()
      ]);
      // Extract results from paginated responses
      const customersData = Array.isArray(customersResp) ? customersResp : customersResp.results || [];
      const animalsData = Array.isArray(animalsResp) ? animalsResp : animalsResp.results || [];
      const offersData = Array.isArray(offersResp) ? offersResp : offersResp.results || [];
      
      setCustomers(customersData);
      setAnimals(animalsData.filter(a => a.status === 'AVAILABLE'));
      setOffers(offersData.filter(o => o.is_active));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleCustomerAdded = async (customer: Customer) => {
    setCustomers([...customers, customer]);
    setFormData(prev => ({ ...prev, customer: customer.id.toString() }));
    await fetchData();
  };

  const addItem = (type: 'animal' | 'offer', id: number, name: string, price: number) => {
    const existing = items.find(i => i.type === type && i.id === id);
    if (existing) {
      setItems(items.map(i => 
        i.type === type && i.id === id 
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setItems([...items, { type, id, name, price, quantity: 1 }]);
    }
  };

  const removeItem = (type: 'animal' | 'offer', id: number) => {
    setItems(items.filter(i => !(i.type === type && i.id === id)));
  };

  const updateQuantity = (type: 'animal' | 'offer', id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(type, id);
    } else {
      setItems(items.map(i => 
        i.type === type && i.id === id ? { ...i, quantity } : i
      ));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = parseFloat(formData.delivery_fee) || 0;
    const discount = parseFloat(formData.discount_amount) || 0;
    const total = subtotal + deliveryFee - discount;
    return { subtotal, deliveryFee, discount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    setLoading(true);
    try {
      const { subtotal, deliveryFee, discount, total } = calculateTotals();
      
      const orderData = {
        customer: parseInt(formData.customer),
        delivery_method: formData.delivery_method,
        delivery_address: formData.delivery_address,
        delivery_date: formData.delivery_date,
        payment_method: formData.payment_method,
        payment_status: 'UNPAID',
        status: 'PENDING',
        subtotal: subtotal.toFixed(2),
        delivery_fee: deliveryFee.toFixed(2),
        discount_amount: discount.toFixed(2),
        total_amount: total.toFixed(2),
        notes: formData.notes,
        items: items.map(item => ({
          item_name: item.name,
          quantity: item.quantity,
          unit_price: item.price.toFixed(2),
          ...(item.type === 'animal' ? { animal: item.id } : { offer: item.id })
        }))
      };

      await createOrder(orderData);
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customer: '',
      delivery_method: 'HOME_DELIVERY',
      delivery_address: '',
      delivery_date: '',
      payment_method: 'CASH',
      delivery_fee: '50',
      discount_amount: '0',
      notes: '',
    });
    setItems([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill delivery address when customer is selected
    if (name === 'customer') {
      const customer = customers.find(c => c.id === parseInt(value));
      if (customer && customer.address_line1) {
        setFormData(prev => ({
          ...prev,
          delivery_address: `${customer.address_line1}, ${customer.city}`
        }));
      }
    }
    
    // Set delivery fee to 0 for farm pickup
    if (name === 'delivery_method' && value === 'FARM_PICKUP') {
      setFormData(prev => ({ ...prev, delivery_fee: '0' }));
    }
  };

  const { subtotal, deliveryFee, discount, total } = calculateTotals();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
          <div className="flex gap-2">
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.full_name} - {customer.phone_number}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowQuickAddCustomer(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 whitespace-nowrap"
            >
              + New
            </button>
          </div>
        </div>

        {/* Add Items Section */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-3">Order Items</h3>
          
          {/* Current Items */}
          {items.length > 0 && (
            <div className="space-y-2 mb-4">
              {items.map((item, idx) => (
                <div key={`${item.type}-${item.id}`} className="flex items-center justify-between bg-white p-3 rounded border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">AED {item.price} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.type, item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.type, item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.type, item.id)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                  <div className="ml-4 font-semibold text-sm">
                    AED {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Items Dropdowns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Add Animal</label>
              <select
                onChange={(e) => {
                  const animal = animals.find(a => a.id === parseInt(e.target.value));
                  if (animal) {
                    addItem('animal', animal.id, `${animal.tag_number} - ${animal.breed_name || animal.animal_type}`, parseFloat(animal.price));
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select animal</option>
                {animals.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.tag_number} - AED {animal.price}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Add Offer</label>
              <select
                onChange={(e) => {
                  const offer = offers.find(o => o.id === parseInt(e.target.value));
                  if (offer) {
                    addItem('offer', offer.id, offer.name, parseFloat(offer.price));
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select offer</option>
                {offers.map(offer => (
                  <option key={offer.id} value={offer.id}>
                    {offer.name} - AED {offer.price}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method *</label>
            <select
              name="delivery_method"
              value={formData.delivery_method}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="HOME_DELIVERY">Home Delivery</option>
              <option value="FARM_PICKUP">Farm Pickup</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {formData.delivery_method === 'HOME_DELIVERY' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
            <input
              type="text"
              name="delivery_address"
              value={formData.delivery_address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Payment & Pricing */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (AED)</label>
            <input
              type="number"
              step="0.01"
              name="delivery_fee"
              value={formData.delivery_fee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (AED)</label>
            <input
              type="number"
              step="0.01"
              name="discount_amount"
              value={formData.discount_amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>AED {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee:</span>
            <span>AED {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Discount:</span>
            <span className="text-red-600">- AED {discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span className="text-primary">AED {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => { onClose(); resetForm(); }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>

      <QuickAddCustomerModal
        isOpen={showQuickAddCustomer}
        onClose={() => setShowQuickAddCustomer(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </Modal>
  );
}
