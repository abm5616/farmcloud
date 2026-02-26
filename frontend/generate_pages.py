"""Generate all remaining admin pages"""

inventory_page = '''
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

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
  const [animals] = useState(mockAnimals);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = animals.filter((a) => {
    const matchesSearch = a.tag.toLowerCase().includes(search.toLowerCase()) || a.breed.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || a.type === filterType;
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: animals.length,
    available: animals.filter((a) => a.status === "AVAILABLE").length,
    reserved: animals.filter((a) => a.status === "RESERVED").length,
    goats: animals.filter((a) => a.type === "Goat").length,
    sheep: animals.filter((a) => a.type === "Sheep").length,
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
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium text-sm">
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
                  {filtered.map((animal, idx) => (
                    <tr key={animal.id} className={`border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer ${idx === filtered.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-5 py-3 text-[0.85rem] font-semibold text-primary">{animal.tag}</td>
                      <td className="px-5 py-3 text-[0.85rem]">{animal.type}</td>
                      <td className="px-5 py-3 text-[0.85rem]">{animal.breed}</td>
                      <td className="px-5 py-3 text-[0.85rem]">{animal.weight}</td>
                      <td className="px-5 py-3 text-[0.85rem]">{animal.age}</td>
                      <td className="px-5 py-3 text-[0.85rem]">{animal.gender}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${statusColors[animal.status]}`}>
                          {animal.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[0.85rem] font-semibold">AED {animal.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'''

offers_page = '''
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

const mockOffers = [
  { id: 1, name: "Whole Goat - Boer Breed", type: "WHOLE", animal: "Goat", price: "1200", original: null, stock: 8, active: true, featured: true },
  { id: 2, name: "Whole Sheep - Najdi", type: "WHOLE", animal: "Sheep", price: "1800", original: null, stock: 5, active: true, featured: true },
  { id: 3, name: "Half Goat - Mixed Cut", type: "HALF", animal: "Goat", price: "650", original: "750", stock: 12, active: true, featured: false },
  { id: 4, name: "Family Pack", type: "PACKAGE", animal: "Mixed", price: "450", original: null, stock: 20, active: true, featured: true },
  { id: 5, name: "Premium Cuts Package", type: "CUTS", animal: "Mixed", price: "580", original: "650", stock: 15, active: true, featured: false },
];

export default function OffersPage() {
  const [offers] = useState(mockOffers);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("all");

  const filtered = offers.filter((o) => {
    const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase());
    const matchesActive = filterActive === "all" || (filterActive === "active" ? o.active : !o.active);
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
              <div className="text-[1.5rem] font-bold text-success">{offers.filter(o => o.active).length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Featured</div>
              <div className="text-[1.5rem] font-bold text-warning">{offers.filter(o => o.featured).length}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Stock</div>
              <div className="text-[1.5rem] font-bold">{offers.reduce((sum, o) => sum + o.stock, 0)}</div>
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
                  {filtered.map((offer, idx) => (
                    <tr key={offer.id} className={`border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer ${idx === filtered.length - 1 ? "border-b-0" : ""}`}>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-[0.85rem]">{offer.name}</div>
                        {offer.featured && <span className="text-[0.7rem] text-warning">⭐ Featured</span>}
                      </td>
                      <td className="px-5 py-3 text-[0.85rem]">{offer.type}</td>
                      <td className="px-5 py-3 text-[0.85rem]">{offer.animal}</td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-[0.85rem]">AED {offer.price}</div>
                        {offer.original && <span className="text-[0.75rem] text-muted line-through">AED {offer.original}</span>}
                      </td>
                      <td className="px-5 py-3 text-[0.85rem]">{offer.stock}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ${offer.active ? "bg-success/10 text-success" : "bg-gray-500/10 text-muted"}`}>
                          {offer.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'''

# Write files
with open("app/inventory/page.tsx", "w", encoding="utf-8") as f:
    f.write(inventory_page)
print("✓ Created inventory/page.tsx")

with open("app/offers/page.tsx", "w", encoding="utf-8") as f:
    f.write(offers_page)
print("✓ Created offers/page.tsx")

print("\n✅ All pages generated successfully!")
