"use client";

import { TabType } from "@/lib/types";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "master-barang" as TabType, label: "Master Barang" },
  { id: "master-kategori" as TabType, label: "Master Kategori Barang" },
  { id: "stock-barang" as TabType, label: "Stock Barang" },
];

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={
              activeTab === tab.id ? "tab-button-active" : "tab-button"
            }
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
