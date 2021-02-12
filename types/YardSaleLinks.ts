import { UUID } from "./General";
import { SellersInterface } from "./Sellers";

export interface YardSaleLinks {
	uuid: UUID;
	yardsale_uuid: UUID;
	seller: SellersInterface;
}