"use client";

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { createAnimal, getBreeds } from '@/lib/api';
import type { Breed } from '@/lib/types';

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAnimalModal({ isOpen, onClose, onSuccess }: AddAnimalModalProps) {
  const [loading, setLoading] = useState(false);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [formData, setFormData] = useState({
    tag_number: '',
    animal_type: 'GOAT',
    breed: '',
    weight: '',
    age_months: '',
    gender: 'MALE',
    status: 'AVAILABLE',
    price: '',
    location: 'Main Farm',
  });

  useEffect(() => {
    if (isOpen) {
      fetchBreeds();
    }
  }, [isOpen]);

  const fetchBreeds = async () => {
    try {
      const data = await getBreeds();
      setBreeds(data);
    } catch (error) {
      console.error('Failed to fetch breeds:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAnimal({
        ...formData,
        weight: parseFloat(formData.weight),
        age_months: parseInt(formData.age_months),
        price: parseFloat(formData.price),
        breed: formData.breed ? parseInt(formData.breed) : undefined,
        date_acquired: new Date().toISOString().split('T')[0],
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        tag_number: '',
        animal_type: 'GOAT',
        breed: '',
        weight: '',
        age_months: '',
        gender: 'MALE',
        status: 'AVAILABLE',
        price: '',
        location: 'Main Farm',
      });
    } catch (error) {
      console.error('Failed to create animal:', error);
      alert('Failed to create animal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredBreeds = breeds.filter(b => b.animal_type === formData.animal_type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Animal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tag Number *</label>
            <input
              type="text"
              name="tag_number"
              value={formData.tag_number}
              onChange={handleChange}
              required
              placeholder="GT-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Animal Type *</label>
            <select
              name="animal_type"
              value={formData.animal_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="GOAT">Goat</option>
              <option value="SHEEP">Sheep</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
            <select
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select breed</option>
              {filteredBreeds.map(breed => (
                <option key={breed.id} value={breed.id}>{breed.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age (months) *</label>
            <input
              type="number"
              name="age_months"
              value={formData.age_months}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
              <option value="PROCESSING">Processing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Animal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
