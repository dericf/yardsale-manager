import { Transaction } from "./Transaction";

export interface SellersInterface {
	uuid: string,
	name: string,
	email: string,
	is_active?: boolean,
	is_deleted?: boolean,
	phone?: string,
	notes?: string,
	initials: string,
	company: string,
	address_text?: string,
	transactions?: Array<Transaction>,
	yardsale_seller_links?: any,
}