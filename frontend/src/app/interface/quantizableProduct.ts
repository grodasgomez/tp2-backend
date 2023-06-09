import { Product } from "./products";

export interface QuantizableProduct extends Product {
	quantity: number;
}
