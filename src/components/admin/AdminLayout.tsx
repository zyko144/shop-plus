import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { BarChart3, ShoppingCart, Package, Layers, Settings, MessageSquare } from "lucide-react";

export type AdminTab = "overview" | "orders" | "stocks" | "products" | "settings" | "support" | "users";

const TABS: { id: AdminTab; label: string; icon: ReactNode; activeClass: string }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: <BarChart3 size={20} />, activeClass: "bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
  { id: "products", label: "Produits", icon: <ShoppingCart size={20} />, activeClass: "bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
  { id: "orders", label: "Commandes", icon: <Package size={20} />, activeClass: "bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
  { id: "stocks", label: "Stocks", icon: <Layers size={20} />, activeClass: "bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
  { id: "users", label: "Utilisateurs", icon: <div className="text-xl leading-none">👥</div>, activeClass: "bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
  { id: "settings", label: "Paramètres", icon: <Settings size={20} />, activeClass: "bg-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
  { id: "support", label: "Support En Direct", icon: <MessageSquare size={20} />, activeClass: "bg-gray-500 shadow-[0_0_20px_rgba(255,255,255,0.4)]" },
];

export function AdminLayout({
  activeTab,
  onTabChange,
  children,
}: {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-400">
            Panel Administrateur
          </h1>
          <div className="px-4 py-2 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-500 font-bold text-sm">
            Mode Super Admin
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id ? `${tab.activeClass} text-white` : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
