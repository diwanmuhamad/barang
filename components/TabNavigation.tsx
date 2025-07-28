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
    <div className="mb-6">
      <div className="flex justify-center space-x-1 p-1 rounded-lg max-w-4xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={
              activeTab === tab.id
                ? "px-6 py-3 text-sm font-medium text-white bg-gray-700 rounded-md transition-colors duration-200 h-[5px]"
                : "px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors duration-200"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
