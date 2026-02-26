
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddAnimalModal from "@/components/AddAnimalModal";
import { getAnimals } from '@/lib/api';
import type { Animal } from '@/lib/types';

const mockAnimals = [
  { id: 1, tag: "GT-001", type: "Goat", breed: "Boer", weight: "28.5", age: 18, gender: "Male", status: "AVAILABLE", price: "1200" },
  { id: 2, tag: "SH-001", type: "Sheep", breed: "Najdi", weight: "38.0", age: 24, gender: "Female", status: "AVAILABLE", price: "1800" },
  { id: 3, tag: "GT-002", type: "Goat", breed: "Damascus", weight: "32.0", age: 20, gender: "Male", status: "RESERVED", price: "1400" },
  { id: 4, tag: "GT-003", type: "Goat", breed: "Boer", weight: "26.0", age: 16, gender: "Female", status: "AVAILABLE", price: "1100" },
  { id: 5, tag: "SH-002", type: "Sheep", breed: "Awassi", weight: "40.5", age: 28, gender: "Male", status: "SOLD", price: "2000" },
];

const statusColors = {
  AVAILABLE: "bg-success/10 text-success",
  RESERVED: "bg-warning/10 text-amber-700",
  SOLD: "bg-gray-500/10 text-muted",
  PROCESSING: "bg-blue-500/10 text-blue-700",
};

export default function InventoryPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const response = await getAnimals();
      const data = Array.isArray(response) ? response : response.results || [];
      setAnimals(data);
    } catch (error) {
      console.error('Failed to fetch animals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const filtered = animals.filter((a) => {
    const matchesSearch = a.tag_number?.toLowerCase().includes(search.toLowerCase()) || a.breed_name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || a.animal_type === filterType.toUpperCase();
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: animals.length,
    available: animals.filter((a) => a.status === "AVAILABLE").length,
    reserved: animals.filter((a) => a.status === "RESERVED").length,
    goats: animals.filter((a) => a.animal_type === "GOAT").length,
    sheep: animals.filter((a) => a.animal_type === "SHEEP").length,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Inventory" />
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Animals</div>
              <div className="text-[1.5rem] font-bold">{stats.total}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Available</div>
              <div className="text-[1.5rem] font-bold text-success">{stats.available}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Reserved</div>
              <div className="text-[1.5rem] font-bold text-warning">{stats.reserved}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Goats</div>
              <div className="text-[1.5rem] font-bold">{stats.goats} 🐐</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Sheep</div>
              <div className="text-[1.5rem] font-bold">{stats.sheep} 🐑</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by tag or breed..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border border-border rounded-lg">
                <option value="all">All Types</option>
                <option value="Goat">Goats</option>
                <option value="Sheep">Sheep</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-border rounded-lg">
                <option value="all">All Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-[1rem] font-semibold">Animals ({filtered.length})</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium text-sm"
              >
                + Add Animal
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Tag</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Type</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Breed</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Weight (kg)</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Age (months)</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Gender</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-muted">
                        {loading ? 'Loading...' : 'No animals found'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((animal, idx) => (
                      <tr key={animal.id} className={`border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer ${idx === filtered.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-5 py-3 text-[0.85rem] font-semibold text-primary">{animal.tag_number}</td>
                        <td className="px-5 py-3 text-[0.85rem]">{animal.animal_type}</td>
                        <td className="px-5 py-3 text-[0.85rem]">{animal.breed_name || 'N/A'}</td>
                        <td className="px-5 py-3 text-[0.85rem]">{animal.weight}</td>
                        <td className="px-5 py-3 text-[0.85rem]">{animal.age_months}</td>
                        <td className="px-5 py-3 text-[0.85rem]">{animal.gender}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${statusColors[animal.status as keyof typeof statusColors]}`}>
                            {animal.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[0.85rem] font-semibold">AED {animal.price}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddAnimalModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchAnimals}
      />
    </div>
  );
}
