export type AdminOrderRow = {
  id: string;
  user_id: string;
  total: number;
  status: string;
  created_at: string;
  payment_ref: string;
  profiles: { email: string; username: string } | null;
  order_items: { product_name: string; quantity: number; unit_price: number }[];
};

export type PromoCode = {
  code: string;
  discount_percentage: number;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
};

export type StockData = {
  product_id: string;
  stock: number;
  is_unlimited: boolean;
};

export type PaymentMethod = {
  id: string;
  name: string;
  details: string | null;
  icon: string | null;
  ticker: string | null;
  is_active: boolean;
  created_at: string;
};
