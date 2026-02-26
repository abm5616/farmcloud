"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { getSettings, updateSettings } from '@/lib/api';
import type { Settings } from '@/lib/types';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    business_name: "FarmCloud Livestock",
    email: "admin@farmcloud.ae",
    phone: "+971 50 123 4567",
    address: "Dubai, UAE",
    currency: "AED",
    timezone: "Asia/Dubai",
    language: "en",
    email_notifications: true,
    sms_notifications: false,
    order_alerts: true,
    low_stock_alerts: true,
    delivery_fee: "50",
    tax_rate: "5",
    min_order_amount: "100",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      setSettings({
        business_name: data.business_name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        currency: data.currency,
        timezone: data.timezone,
        language: data.language,
        email_notifications: data.email_notifications,
        sms_notifications: data.sms_notifications,
        order_alerts: data.order_alerts,
        low_stock_alerts: data.low_stock_alerts,
        delivery_fee: data.delivery_fee,
        tax_rate: data.tax_rate,
        min_order_amount: data.min_order_amount,
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      alert("✓ Settings saved successfully!");
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <Topbar title="Settings" />

        <div className="p-8">
          {/* Tabs */}
          <div className="bg-card border border-border rounded-lg shadow mb-6">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "general"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                ⚙️ General
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "business"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                🏢 Business
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "notifications"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === "pricing"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                💰 Pricing
              </button>
            </div>

            <div className="p-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                          </label>
                          <select
                            name="currency"
                            value={settings.currency}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          >
                            <option value="AED">AED - UAE Dirham</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select
                            name="timezone"
                            value={settings.timezone}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          >
                            <option value="Asia/Dubai">Dubai (GST +4)</option>
                            <option value="Asia/Riyadh">Riyadh (AST +3)</option>
                            <option value="UTC">UTC</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          name="language"
                          value={settings.language}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="en">English</option>
                          <option value="ar">Arabic</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Settings */}
              {activeTab === "business" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          name="business_name"
                          value={settings.business_name}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={settings.address}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted">Receive updates via email</div>
                        </div>
                        <input
                          type="checkbox"
                          name="email_notifications"
                          checked={settings.email_notifications}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-12 h-6"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">SMS Notifications</div>
                          <div className="text-sm text-muted">Get SMS alerts for important events</div>
                        </div>
                        <input
                          type="checkbox"
                          name="sms_notifications"
                          checked={settings.sms_notifications}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-12 h-6"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">Order Alerts</div>
                          <div className="text-sm text-muted">Get notified when new orders arrive</div>
                        </div>
                        <input
                          type="checkbox"
                          name="order_alerts"
                          checked={settings.order_alerts}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-12 h-6"
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">Low Stock Alerts</div>
                          <div className="text-sm text-muted">Alert when inventory is running low</div>
                        </div>
                        <input
                          type="checkbox"
                          name="low_stock_alerts"
                          checked={settings.low_stock_alerts}
                          onChange={handleChange}
                          disabled={loading}
                          className="w-12 h-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Settings */}
              {activeTab === "pricing" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pricing Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default Delivery Fee (AED)
                          </label>
                          <input
                            type="number"
                            name="delivery_fee"
                            value={settings.delivery_fee}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tax Rate (%)
                          </label>
                          <input
                            type="number"
                            name="tax_rate"
                            value={settings.tax_rate}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Order Amount (AED)
                          </label>
                          <input
                            type="number"
                            name="min_order_amount"
                            value={settings.min_order_amount}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-border flex justify-end gap-3">
                <button
                  onClick={fetchSettings}
                  disabled={loading || saving}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || saving}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
