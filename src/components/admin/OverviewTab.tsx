import { DollarSign, Package, Clock, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useCountUp } from "@/hooks/useCountUp";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a238ff', '#f47521'];

function StatCard({ label, value, decimals = 0, suffix = "", icon, accent }: { label: string; value: number; decimals?: number; suffix?: string; icon: React.ReactNode; accent: string }) {
  const { ref, display } = useCountUp(value, { decimals, scrollTrigger: false });
  return (
    <div ref={ref as never} className={`stat-card rounded-2xl p-6 border-t-4 flex items-center justify-between`} style={{ borderTopColor: accent }}>
      <div>
        <p className="text-muted-foreground font-medium mb-1">{label}</p>
        <h2 className="font-display text-3xl font-black">{display}{suffix}</h2>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}1a`, color: accent }}>
        {icon}
      </div>
    </div>
  );
}

export function OverviewTab({
  totalRevenue,
  orderCount,
  pendingCount,
  salesByDay,
  topProducts,
}: {
  totalRevenue: number;
  orderCount: number;
  pendingCount: number;
  salesByDay: { name: string; total: number }[];
  topProducts: { name: string; value: number }[];
}) {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Chiffre d'affaires" value={totalRevenue} decimals={2} suffix="€" icon={<DollarSign size={24} />} accent="#ef4444" />
        <StatCard label="Commandes totales" value={orderCount} icon={<Package size={24} />} accent="#f97316" />
        <StatCard label="En attente" value={pendingCount} icon={<Clock size={24} />} accent="#eab308" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-2xl p-6 border border-border/50">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-red-500" />
            Ventes des 7 derniers jours
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}€`} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#ff0033' }}
                />
                <Line type="monotone" dataKey="total" stroke="#ff0033" strokeWidth={3} dot={{ fill: '#ff0033', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-border/50">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Package size={18} className="text-orange-500" />
            Top 5 Produits Vendus
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #333', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">Pas assez de données pour le moment.</p>
            )}
          </div>
          {topProducts.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {topProducts.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
