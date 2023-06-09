import { Product } from "./products";

export interface ConsumptionDetail {
	id: number;
	consumptionId: number;
	productId: number;
	quantity: number;
	product: Product;
}
