import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-1SO8M5j5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem("cart");
			if (raw) setItems(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem("cart", JSON.stringify(items));
		} catch {}
	}, [items]);
	const add = (p) => {
		setItems((prev) => {
			if (prev.find((i) => i.id === p.id)) return prev.map((i) => i.id === p.id ? {
				...i,
				quantity: i.quantity + 1
			} : i);
			return [...prev, {
				...p,
				quantity: 1
			}];
		});
		setOpen(true);
	};
	const remove = (id) => setItems((p) => p.filter((i) => i.id !== id));
	const setQty = (id, q) => setItems((p) => q <= 0 ? p.filter((i) => i.id !== id) : p.map((i) => i.id === id ? {
		...i,
		quantity: q
	} : i));
	const clear = () => setItems([]);
	const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
	const count = items.reduce((s, i) => s + i.quantity, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			items,
			add,
			remove,
			setQty,
			clear,
			total,
			count,
			open,
			setOpen
		},
		children
	});
}
function useCart() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useCart must be used inside CartProvider");
	return c;
}
//#endregion
export { useCart as n, CartProvider as t };
