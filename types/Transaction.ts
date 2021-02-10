import { YardSaleSellerLinks } from "../components/YardSales/YardsaleSellerLinks";
import { UUID } from "./General";
import { SellersInterface } from "./Sellers";
import { YardSalesInterface } from "./YardSales";

export interface Transaction {
  seller_uuid: UUID;
  yardsale_uuid: UUID;
  price: number | string;
  description: string;
  created_at: string;
  uuid: UUID;
  seller: SellersInterface;
  yardsale: YardSalesInterface;
}
