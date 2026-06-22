import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-Bd3tHH6h.js
function createSupabaseClient() {
	return createClient("https://lmxyopykafbzuppssaqw.supabase.co", "sb_publishable_xTj9YmRRU7RyjITt0Y8Uww_3nS_NNXm", { auth: {
		storage: typeof window !== "undefined" ? localStorage : void 0,
		persistSession: true,
		autoRefreshToken: true
	} });
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
