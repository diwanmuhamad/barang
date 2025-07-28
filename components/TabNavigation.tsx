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
      <div className="flex justify-center p-1 rounded-lg max-w-4xl mx-auto h-[35px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={
              activeTab === tab.id
                ? `px-7 text-sm font-medium text-black bg-gray-300 rounded-md transition-colors duration-200 ${
                    tab.id === "master-kategori"
                      ? "rounded-r-none rounded-l-none"
                      : tab.id === "stock-barang"
                      ? "rounded-l-none"
                      : "rounded-r-none"
                  }`
                : `px-7 text-sm font-medium border border-black text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors duration-200 ${
                    tab.id === "master-kategori"
                      ? "rounded-r-none rounded-l-none border-r-0 border-l-0"
                      : tab.id === "stock-barang"
                      ? "rounded-l-none"
                      : "rounded-r-none"
                  }`
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
