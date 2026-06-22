import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-Bd3tHH6h.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DTdYFO5Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)({
	user: null,
	session: null,
	profile: null,
	loading: true,
	profileError: null,
	signOut: async () => {}
});
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [profileError, setProfileError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const fetchProfile = async (userId) => {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
			if (error) setProfileError(error.message || JSON.stringify(error));
			else setProfileError(null);
			if (data) setProfile(data);
		};
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
			setSession(s);
			if (s?.user) fetchProfile(s.user.id);
			else {
				setProfile(null);
				setLoading(false);
			}
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			if (data.session?.user) fetchProfile(data.session.user.id).finally(() => setLoading(false));
			else setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			user: session?.user ?? null,
			session,
			profile,
			loading,
			profileError,
			signOut: async () => {
				await supabase.auth.signOut();
			}
		},
		children
	});
}
var useAuth = () => (0, import_react.useContext)(Ctx);
//#endregion
export { useAuth as n, AuthProvider as t };
