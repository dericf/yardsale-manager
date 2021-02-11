import { SellersInterface } from "./Sellers";
import { Transaction } from "./Transaction";

export interface YardSalesInterface {
  uuid?: string;
  created_at?: string;
  updated_at?: string;
  address_text?: string;
  days_of_week?: string;
  end_date?: string;
  end_time?: string;
  start_date?: string;
  start_time?: string;
  user_uuid?: string;
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  notes?: string;
  is_active?: boolean;
  pos_lng?: string;
  pos_lat?: string;
  is_public?: boolean;
	transactions?: Transaction,
	yardsale_seller_links?: any
}

// export type YardSaleSellersLinks = Array<SellersInterface>;
