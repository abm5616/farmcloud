
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getOffers } from '@/lib/api';
import type { Offer } from '@/lib/types';

const mockOffers = [
  { id: 1, name: "Whole Goat - Boer Breed", type: "WHOLE", animal: "Goat", price: "1200", original: null, stock: 8, active: true, featured: true },
  { id: 2, name: "Whole Sheep - Najdi", type: "WHOLE", animal: "Sheep", price: "1800", original: null, stock: 5, active: true, featured: true },
  { id: 3, name: "Half Goat - Mixed Cut", type: "HALF", animal: "Goat", price: "650", original: "750", stock: 12, active: true, featured: false },
  { id: 4, name: "Family Pack", type: "PACKAGE", animal: "Mixed", price: "450", original: null, stock: 20, active: true, featured: true },
  { id: 5, name: "Premium Cuts Package", type: "CUTS", animal: "Mixed", price: "580", original: "650", stock: 15, active: true, featured: false },
];

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await getOffers();
        const data = Array.isArray(response) ? response : response.results || [];
        setOffers(data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  const filtered = offers.filter((o) => {
    const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase());
    const matchesActive = filterActive === "all" || (filterActive === "active" ? o.is_active : !o.is_active);
    return matchesSearch && matchesActive;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Offers & Packages" />
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Offers</div>
              <div className="text-[1.5rem] font-bold">{offers.length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Active</div>
              <div className="text-[1.5rem] font-bold text-success">{offers.filter(o => o.is_active).length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Featured</div>
              <div className="text-[1.5rem] font-bold text-warning">{offers.filter(o => o.is_featured).length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Stock</div>
              <div className="text-[1.5rem] font-bold">{offers.reduce((sum, o) => sum + (o.stock_quantity || 0), 0)}</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5 shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search offers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-border rounded-lg"
              />
              <select value={filterActive} onChange={(e) => setFilterActive(e.target.value)} className="px-4 py-2 border border-border rounded-lg">
                <option value="all">All Offers</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg shadow">
            <div className="px-5 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-[1rem] font-semibold">Offers List ({filtered.length})</h2>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium text-sm">
                + New Offer
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Name</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Type</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Animal</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Price</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Stock</th>
                    <th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-muted">
                        {loading ? 'Loading...' : 'No offers found'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((offer, idx) => (
                      <tr key={offer.id} className={`border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer ${idx === filtered.length - 1 ? "border-b-0" : ""}`}>
                        <td className="px-5 py-3">
                          <div className="font-semibold text-[0.85rem]">{offer.name}</div>
                          {offer.is_featured && <span className="text-[0.7rem] text-warning">⭐ Featured</span>}
                        </td>
                        <td className="px-5 py-3 text-[0.85rem]">{offer.offer_type}</td>
                        <td className="px-5 py-3 text-[0.85rem]">{offer.animal_type || 'Mixed'}</td>
                        <td className="px-5 py-3">
                          <div className="font-semibold text-[0.85rem]">AED {offer.price}</div>
                          {offer.original_price && <span className="text-[0.75rem] text-muted line-through">AED {offer.original_price}</span>}
                        </td>
                        <td className="px-5 py-3 text-[0.85rem]">{offer.stock_quantity}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${offer.is_active ? "bg-success/10 text-success" : "bg-gray-500/10 text-muted"}`}>
                            {offer.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
