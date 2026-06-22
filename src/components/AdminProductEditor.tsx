import { useState } from "react";
import { Product } from "@/lib/products";
import { ProductCard3D } from "./ProductCard3D";
import { Save, X } from "lucide-react";

type AdminProductEditorProps = {
  initialProduct?: Partial<Product>;
  onSave: (product: Partial<Product>) => Promise<void>;
  onCancel: () => void;
};

export function AdminProductEditor({ initialProduct, onSave, onCancel }: AdminProductEditorProps) {
  const [product, setProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    subtitle: "",
    price: 0,
    category: "Streaming",
    color: "#ff0000",
    logo: "",
    emoji: "",
    image: "",
    is_active: true,
    ...initialProduct,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof Product, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(product);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Formulaire (Gauche) */}
        <div className="flex-1 p-6 border-r border-white/5 overflow-y-auto max-h-[85vh]">
          <h2 className="text-2xl font-bold mb-6 text-white">
            {initialProduct?.id ? "Modifier le produit" : "Nouveau Produit"}
          </h2>
          
          <div className="space-y-4">
            {!initialProduct?.id && (
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">ID (Identifiant unique, ex: netflix-1-mois)</label>
                <input 
                  type="text" 
                  value={product.id || ""} 
                  onChange={(e) => handleChange("id", e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white font-mono"
                  placeholder="identifiant-unique"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Nom du Produit</label>
                <input 
                  type="text" 
                  value={product.name || ""} 
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                  placeholder="Ex: Netflix Premium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Prix (€)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={product.price || 0} 
                  onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Sous-titre (Description courte)</label>
              <input 
                type="text" 
                value={product.subtitle || ""} 
                onChange={(e) => handleChange("subtitle", e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                placeholder="Ex: 1 Écran • 1 Mois"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Catégorie</label>
                <select 
                  value={product.category || "Streaming"} 
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                >
                  <option value="Streaming">Streaming</option>
                  <option value="VPN">VPN</option>
                  <option value="Fortnite">Fortnite</option>
                  <option value="Fortnite Rare">Fortnite Rare</option>
                  <option value="V-Bucks">V-Bucks</option>
                  <option value="Steam">Steam</option>
                  <option value="Discord">Discord</option>
                  <option value="Twitch">Twitch</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Couleur Principale (Hex)</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={product.color || "#ff0000"} 
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                  />
                  <input 
                    type="text" 
                    value={product.color || ""} 
                    onChange={(e) => handleChange("color", e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-white font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Logo (SimpleIcons Slug)</label>
                <input 
                  type="text" 
                  value={product.logo || ""} 
                  onChange={(e) => handleChange("logo", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                  placeholder="Ex: netflix, disneyplus..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-1">Ou Emoji</label>
                <input 
                  type="text" 
                  value={product.emoji || ""} 
                  onChange={(e) => handleChange("emoji", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-white"
                  placeholder="Ex: 🎬, 🎮..."
                />
              </div>
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input 
                type="checkbox" 
                checked={product.is_active} 
                onChange={(e) => handleChange("is_active", e.target.checked)}
                className="w-4 h-4 rounded bg-black/50 border border-white/10 accent-primary"
              />
              <span className="text-sm font-bold text-white">Produit Actif (Visible sur la boutique)</span>
            </label>

          </div>
          
          <div className="mt-8 flex gap-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving || !product.id || !product.name}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? "Sauvegarde..." : "Enregistrer le produit"}
            </button>
            <button 
              onClick={onCancel}
              className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl flex justify-center items-center transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Aperçu (Droite) */}
        <div className="w-full md:w-[450px] bg-black/50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-xs font-bold text-white/30 uppercase tracking-widest">
            Aperçu en Direct
          </div>
          <div className="w-full max-w-[320px] pointer-events-none mt-6">
            <ProductCard3D product={product as Product} />
          </div>
        </div>

      </div>
    </div>
  );
}
