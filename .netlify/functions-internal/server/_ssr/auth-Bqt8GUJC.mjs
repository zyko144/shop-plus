import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Bd3tHH6h.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-C8BY853h.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Bqt8GUJC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const [mode, setMode] = (0, import_react.useState)("login");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const { user } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (user) navigate({ to: "/" });
	}, [user, navigate]);
	const submit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { username }
					}
				});
				if (error) throw error;
				toast.success("Compte créé ! Vérifie tes emails pour confirmer ton adresse.", { duration: 6e3 });
				setMode("login");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Connecté !");
			}
		} catch (e) {
			console.error("Auth error:", e);
			toast.error(e?.message || "Erreur du serveur d'envoi d'emails (SMTP).");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen relative overflow-hidden bg-black grid place-items-center px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 overflow-hidden pointer-events-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1/4 left-1/4 w-32 h-32 bg-red-600/30 rounded-full mix-blend-screen filter blur-[50px] animate-pulse",
						style: { animationDuration: "4s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-1/4 right-1/3 w-40 h-40 bg-orange-600/20 rounded-full mix-blend-screen filter blur-[60px] animate-pulse",
						style: { animationDuration: "6s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/40 rounded-full mix-blend-screen filter blur-[100px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/netflix.svg",
						alt: "Netflix",
						className: "absolute top-[10%] left-[10%] w-16 h-16 opacity-30 filter blur-[2px] invert",
						style: { animation: "float 6s ease-in-out infinite" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/twitch.svg",
						alt: "Twitch",
						className: "absolute top-[15%] right-[20%] w-14 h-14 opacity-40 filter blur-[1px] invert",
						style: { animation: "float 7s ease-in-out infinite 1s reverse" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/discord.svg",
						alt: "Discord",
						className: "absolute top-[5%] right-[40%] w-12 h-12 opacity-30 filter blur-[3px] invert",
						style: { animation: "float 8s ease-in-out infinite 2s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/xbox.svg",
						alt: "Xbox",
						className: "absolute top-[8%] left-[40%] w-12 h-12 opacity-30 filter blur-[1.5px] invert",
						style: { animation: "float 6.5s ease-in-out infinite 0.5s reverse" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/youtube.svg",
						alt: "YouTube",
						className: "absolute top-[40%] left-[5%] w-16 h-12 opacity-40 filter blur-[1.5px] invert",
						style: { animation: "float 5s ease-in-out infinite 1.5s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/disneyplus.svg",
						alt: "Disney+",
						className: "absolute top-[35%] right-[8%] w-20 h-10 opacity-30 filter blur-[2px] invert",
						style: { animation: "float 9s ease-in-out infinite reverse" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/steam.svg",
						alt: "Steam",
						className: "absolute top-[55%] left-[20%] w-14 h-14 opacity-30 filter blur-[3px] invert",
						style: { animation: "float 6s ease-in-out infinite 0.5s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/nintendoswitch.svg",
						alt: "Switch",
						className: "absolute top-[42%] left-[32%] w-12 h-12 opacity-40 filter blur-[1.5px] invert",
						style: { animation: "float 7.5s ease-in-out infinite 1.8s reverse" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/primevideo.svg",
						alt: "Prime",
						className: "absolute top-[60%] right-[15%] w-16 h-8 opacity-30 filter blur-[1.5px] invert",
						style: { animation: "float 7s ease-in-out infinite 1s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/hulu.svg",
						alt: "Hulu",
						className: "absolute top-[45%] right-[25%] w-16 h-8 opacity-20 filter blur-[2px] invert",
						style: { animation: "float 8s ease-in-out infinite 1.5s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/spotify.svg",
						alt: "Spotify",
						className: "absolute bottom-[20%] left-[10%] w-14 h-14 opacity-40 filter blur-[2px] invert",
						style: { animation: "float 8s ease-in-out infinite 2.5s reverse" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/epicgames.svg",
						alt: "Epic Games",
						className: "absolute bottom-[10%] right-[25%] w-14 h-16 opacity-30 filter blur-[3px] invert",
						style: { animation: "float 6.5s ease-in-out infinite" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/crunchyroll.svg",
						alt: "Crunchyroll",
						className: "absolute bottom-[25%] right-[5%] w-14 h-14 opacity-50 filter blur-[1px] invert",
						style: { animation: "float 5.5s ease-in-out infinite 3s" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/playstation.svg",
						alt: "PlayStation",
						className: "absolute bottom-[35%] left-[30%] w-16 h-12 opacity-30 filter blur-[1px] invert",
						style: { animation: "float 7s ease-in-out infinite 0.8s reverse" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://cdn.jsdelivr.net/npm/simple-icons@11.0.0/icons/appletv.svg",
						alt: "Apple TV",
						className: "absolute bottom-[15%] left-[60%] w-14 h-8 opacity-30 filter blur-[2.5px] invert",
						style: { animation: "float 6s ease-in-out infinite 2s" }
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md relative z-10 p-8 space-y-8 rounded-[2rem] border border-red-500/20 bg-black/40 backdrop-blur-2xl",
				style: { boxShadow: "0 0 80px -20px rgba(220,38,38,0.3), inset 0 0 20px -10px rgba(220,38,38,0.2)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-black shadow-[0_0_40px_rgba(220,38,38,0.4)] border border-red-600/30 mb-4 overflow-hidden p-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo.png",
									alt: "SHOP+ Logo",
									className: "w-full h-full object-contain drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2",
								children: [mode === "login" ? "Connexion" : "Rejoindre", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]",
									children: "SHOP+"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-red-200/60 font-medium",
								children: "L'accès premium à vos plateformes préférées."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-4",
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									value: username,
									onChange: (e) => setUsername(e.target.value),
									placeholder: "Votre pseudo",
									className: "w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "Adresse email",
									className: "w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "password",
									minLength: 6,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "Mot de passe",
									className: "w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: loading,
									className: "w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold tracking-wide disabled:opacity-50 hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.6)] hover:-translate-y-0.5 transition-all duration-300",
									children: loading ? "Chargement..." : mode === "login" ? "Accéder à mon compte" : "Créer mon compte"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-center text-sm text-white/50 pt-2",
						children: [
							mode === "login" ? "Nouveau sur SHOP+ ?" : "Vous avez déjà un compte ?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMode(mode === "login" ? "signup" : "login"),
								className: "text-red-400 font-bold hover:text-red-300 transition-colors",
								children: mode === "login" ? "Créer un compte" : "Se connecter"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      ` } })
		]
	});
}
//#endregion
export { AuthPage as component };
