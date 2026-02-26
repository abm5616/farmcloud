"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AddUserModal from "@/components/AddUserModal";
import EditUserModal from "@/components/EditUserModal";
import { getUsers, deleteUser, toggleUserStatus } from '@/lib/api';
import type { User } from '@/lib/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      const data = Array.isArray(response) ? response : response.results || [];
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-red-500/10 text-red-700",
      MANAGER: "bg-blue-500/10 text-blue-700",
      STAFF: "bg-green-500/10 text-green-700",
      DELIVERY: "bg-amber-500/10 text-amber-700",
    };
    return colors[role] || "bg-gray-500/10 text-gray-700";
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm('Are you sure you want to delete ' + user.full_name + '?')) return;
    
    try {
      await deleteUser(user.id);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await toggleUserStatus(user.id);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update user status');
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    administrators: users.filter(u => u.role === 'ADMIN').length,
    staff: users.filter(u => u.role !== 'ADMIN').length,
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Users & Permissions" />
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Total Users</div>
              <div className="text-[1.5rem] font-bold">{stats.total}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Active</div>
              <div className="text-[1.5rem] font-bold text-success">{stats.active}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Administrators</div>
              <div className="text-[1.5rem] font-bold text-destructive">{stats.administrators}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow">
              <div className="text-[0.75rem] text-muted font-medium mb-1">Staff Members</div>
              <div className="text-[1.5rem] font-bold">{stats.staff}</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 shadow mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex-1 min-w-[250px]">
                <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm">+ Add User</button>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg shadow">
            <div className="px-5 py-4 border-b border-border"><h2 className="text-[1rem] font-semibold">User List ({filteredUsers.length})</h2></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50"><th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">User</th><th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">Email</th><th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">Role</th><th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">Status</th><th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">Last Login</th><th className="text-left px-5 py-3 text-[0.75rem] font-semibold text-muted uppercase tracking-wide">Actions</th></tr></thead>
                <tbody>{loading ? (<tr><td colSpan={6} className="px-5 py-8 text-center text-muted">Loading users...</td></tr>) : filteredUsers.length === 0 ? (<tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No users found</td></tr>) : (filteredUsers.map((user, idx) => (<tr key={user.id} className={'border-b border-gray-100 hover:bg-gray-50/50 transition-colors ' + (idx === filteredUsers.length - 1 ? "border-b-0" : "")}><td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">{user.avatar || user.username.charAt(0).toUpperCase()}</div><div><div className="font-medium text-[0.85rem]">{user.full_name}</div><div className="text-[0.75rem] text-muted">@{user.username}</div></div></div></td><td className="px-5 py-3 text-[0.85rem] text-muted">{user.email}</td><td className="px-5 py-3"><span className={'inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ' + getRoleColor(user.role)}>{user.role}</span></td><td className="px-5 py-3"><button onClick={() => handleToggleStatus(user)} className={'inline-flex items-center px-[0.6rem] py-1 rounded-full text-[0.7rem] font-semibold ' + (user.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-gray-500/10 text-muted')}>{user.status === 'ACTIVE' ? '● Active' : '○ Inactive'}</button></td><td className="px-5 py-3 text-[0.85rem] text-muted">{user.last_login_display}</td><td className="px-5 py-3"><div className="flex gap-2"><button onClick={() => handleEditUser(user)} className="px-3 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">Edit</button>{user.role !== 'ADMIN' && (<button onClick={() => handleDeleteUser(user)} className="px-3 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors">Delete</button>)}</div></td></tr>)))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={fetchUsers} />
      <EditUserModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSuccess={fetchUsers} user={selectedUser} />
    </div>
  );
}
