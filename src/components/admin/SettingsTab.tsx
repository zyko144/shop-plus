import { Save, Trash2 } from "lucide-react";
import type { PromoCode } from "./types";

export function SettingsTab({
  storeSettings,
  onSettingsChange,
  onSaveSettings,
  promos,
  newPromo,
  onNewPromoChange,
  onCreatePromo,
  onDeletePromo,
}: {
  storeSettings: Record<string, string>;
  onSettingsChange: (patch: Record<string, string>) => void;
  onSaveSettings: () => void;
  promos: PromoCode[];
  newPromo: { code: string; discount: number; max_uses: number };
  onNewPromoChange: (patch: Partial<{ code: string; discount: number; max_uses: number }>) => void;
  onCreatePromo: () => void;
  onDeletePromo: (code: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Paramètres globaux */}
      <div className="glass rounded-2xl p-8 border border-border/50">
        <h2 className="text-2xl font-bold mb-6">Paramètres de la Boutique</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Lien du Serveur Discord (Bouton Support)
            </label>
            <input
              type="text"
              value={storeSettings.discord_link || ""}
              onChange={e => onSettingsChange({ discord_link: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 focus:border-gray-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Bandeau d'Annonce (laisser vide pour cacher)
            </label>
            <input
              type="text"
              value={storeSettings.banner_text || ""}
              onChange={e => onSettingsChange({ banner_text: e.target.value })}
              placeholder="EX: SOLDES EXCEPTIONNELLES : -20%..."
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 focus:border-gray-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Mode Maintenance
            </label>
            <select
              value={storeSettings.maintenance_mode || "false"}
              onChange={e => onSettingsChange({ maintenance_mode: e.target.value })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 focus:border-gray-500 outline-none transition-colors"
            >
              <option value="false">Désactivé (Boutique ouverte)</option>
              <option value="true">Activé (Boutique fermée)</option>
            </select>
            {storeSettings.maintenance_mode === "true" && (
              <p className="text-gray-400 text-xs mt-2 font-medium">⚠️ Attention : le site sera complètement inaccessible pour les clients !</p>
            )}
          </div>

          <button
            onClick={onSaveSettings}
            className="mt-8 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 w-full justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            <Save size={18} />
            Enregistrer les Paramètres
          </button>
        </div>
      </div>

      {/* Codes Promo */}
      <div className="glass rounded-2xl p-8 border border-border/50">
        <h2 className="text-2xl font-bold mb-6">Codes Promo</h2>

        {/* Formulaire Création Promo */}
        <div className="flex flex-wrap items-end gap-4 mb-8 bg-black/30 p-4 rounded-xl border border-white/5">
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Code Promo</label>
            <input
              type="text"
              value={newPromo.code}
              onChange={e => onNewPromoChange({ code: e.target.value })}
              placeholder="ex: SOLDES20"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-gray-500 outline-none uppercase"
            />
          </div>
          <div className="w-24 shrink-0">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Réduc (%)</label>
            <input
              type="number"
              min="1" max="100"
              value={newPromo.discount}
              onChange={e => onNewPromoChange({ discount: parseInt(e.target.value) || 0 })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-gray-500 outline-none"
            />
          </div>
          <div className="w-24 shrink-0">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Util. max</label>
            <input
              type="number"
              min="1"
              value={newPromo.max_uses}
              onChange={e => onNewPromoChange({ max_uses: parseInt(e.target.value) || 0 })}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-gray-500 outline-none"
            />
          </div>
          <button
            onClick={onCreatePromo}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-bold text-sm h-[38px] transition"
          >
            Créer
          </button>
        </div>

        {/* Liste des codes */}
        <div className="space-y-3">
          {promos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Aucun code promo actif.</p>
          ) : promos.map(promo => (
            <div key={promo.code} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10">
              <div>
                <div className="font-bold text-lg text-primary">{promo.code} <span className="text-sm text-white/50 bg-white/10 px-2 py-0.5 rounded ml-2">-{promo.discount_percentage}%</span></div>
                <div className="text-xs text-muted-foreground mt-1">
                  Utilisations : {promo.current_uses} / {promo.max_uses}
                </div>
              </div>
              <button
                onClick={() => onDeletePromo(promo.code)}
                className="p-2 bg-gray-500/20 text-gray-500 hover:bg-gray-500/40 rounded-lg transition"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
