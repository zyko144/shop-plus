import { createFileRoute } from "@tanstack/react-router";
import { Crown, CheckCircle, Star, Shield, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { toast } from "sonner";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
  head: () => ({ meta: [{ title: "Devenir VIP Premium — SHOP+" }] })
});

function PremiumPage() {
  const { add, setOpen } = useCart();

  const handleSubscribe = () => {
    add({
      id: "premium-vip-sub",
      name: "Abonnement Premium VIP",
      subtitle: "1 Mois d'avantages exclusifs",
      price: 5,
      category: "Premium",
      emoji: "👑",
      color: "#a855f7"
    });
    toast.success("Abonnement ajouté au panier !");
    setOpen(true);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-purple-500/30">
      <Header />
      <CartDrawer />
      
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative">
        {/* Effet d'arrière-plan */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Section Texte / Explications */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-sm">
              <Star size={16} className="fill-purple-500" /> Le club le plus fermé
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Passez au niveau supérieur avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Premium VIP</span>.
            </h1>
            
            <p className="text-xl text-white/60 leading-relaxed">
              Ne payez plus jamais le prix fort. Rejoignez l'élite et bénéficiez de réductions massives automatiques sur vos achats, et d'un accès direct à notre équipe sur Discord.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-1">
                  <Crown size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Réduction de -30%</h3>
                  <p className="text-sm text-white/60">Valable sur 10 commandes entières (hors services Discord). La réduction s'applique automatiquement dans votre panier.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-1">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Salon VIP Discord</h3>
                  <p className="text-sm text-white/60">Accédez au salon privé sur notre serveur Discord. Discutez en priorité avec le staff et profitez d'offres secrètes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                <div className="w-10 h-10 shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mt-1">
                  <Star size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Statut Prestige</h3>
                  <p className="text-sm text-white/60">Affichez fièrement votre badge de Couronne VIP sur votre espace client.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carte de Prix / Achat */}
          <div className="lg:justify-self-end w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="glass rounded-[2.5rem] p-8 border-2 border-purple-500/50 relative overflow-hidden group hover:border-purple-400 transition-colors shadow-[0_0_50px_rgba(168,85,247,0.2)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-[60px] rounded-full group-hover:scale-110 transition-transform"></div>
              
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
                  <Crown size={40} />
                </div>
                
                <div>
                  <h2 className="text-3xl font-black mb-2">Premium VIP</h2>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">5€</span>
                    <span className="text-xl text-white/40 font-bold mb-2">/mois</span>
                  </div>
                </div>
                
                <ul className="space-y-3 text-left bg-black/40 rounded-2xl p-6 border border-white/5">
                  <li className="flex items-center gap-3 font-medium">
                    <CheckCircle size={18} className="text-green-400 shrink-0" />
                    <span>Badge <strong>VIP</strong> Exclusif</span>
                  </li>
                  <li className="flex items-center gap-3 font-medium">
                    <CheckCircle size={18} className="text-green-400 shrink-0" />
                    <span><strong>-30%</strong> sur 10 commandes</span>
                  </li>
                  <li className="flex items-center gap-3 font-medium">
                    <CheckCircle size={18} className="text-green-400 shrink-0" />
                    <span>Rôle <strong>Discord VIP</strong></span>
                  </li>
                  <li className="flex items-center gap-3 font-medium opacity-60 text-sm">
                    <CheckCircle size={18} className="text-white/40 shrink-0" />
                    <span>Activation manuelle rapide</span>
                  </li>
                </ul>
                
                <button 
                  onClick={handleSubscribe}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                >
                  Devenir Premium <ArrowRight size={20} />
                </button>
                <p className="text-xs text-white/40">
                  Abonnement d'un mois. Sans engagement automatique.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
