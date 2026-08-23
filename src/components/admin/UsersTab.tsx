type AdminUserRow = {
  id: string;
  email: string | null;
  username: string | null;
  plus_coins: number | null;
  is_premium: boolean | null;
  premium_orders_left: number | null;
};

export function UsersTab({
  usersList,
  onGrantPremium,
}: {
  usersList: AdminUserRow[];
  onGrantPremium: (userId: string) => void;
}) {
  return (
    <div className="glass rounded-2xl overflow-hidden border border-border/50">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <div className="text-2xl">👥</div> Gestion des Utilisateurs
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/40 text-muted-foreground text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Utilisateur</th>
              <th className="p-4 font-semibold">Coins</th>
              <th className="p-4 font-semibold">Statut Premium</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {usersList.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun utilisateur trouvé.</td>
              </tr>
            ) : usersList.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white/90">{u.email || 'Email introuvable'}</div>
                  <div className="text-xs text-muted-foreground">{u.username || 'Anonyme'} (ID: {u.id.slice(0, 8)})</div>
                </td>
                <td className="p-4 font-bold text-yellow-500">
                  {u.plus_coins || 0} Coins
                </td>
                <td className="p-4">
                  {u.is_premium ? (
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400 w-fit">
                        👑 Premium Actif
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {u.premium_orders_left || 0} commande(s) remisée(s) restante(s)
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Classique</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onGrantPremium(u.id)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-purple-500/25 transition-all active:scale-95"
                  >
                    Accorder Premium (-30%)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
