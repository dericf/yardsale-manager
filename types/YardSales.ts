export interface YardSalesInterface {
	uuid: string,
	created_at: string,
	updated_at: string,
	address_text: string,
	days_of_week: string,
	end_date: string,
	end_time: string,
	start_date: string,
	start_time: string,
	user_uuid: string,
	name: string,
	company: string,
	phone: string,
	email: string,
	notes: string,
	is_active: boolean,
	pos_lng: string,
	pos_lat: string,
	is_public: boolean,
      
}

export interface YardSaleSellerLink {
	yardsale_seller_links: Array<SellerInterFace>
}

export interface SellerInterFace {
	name: string,
	email: string,
	is_active: boolean,
	is_deleted: boolean,
	uuid: string,
	phone: string,
	notes: string,
	initials: string,
	company: string,
	address_text: string,

}