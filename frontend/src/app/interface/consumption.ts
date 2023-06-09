import { ConsumptionDetail } from "./consumptionDetail";

export interface Consumption {
	id: number;
	clientId: number;
	tableId: number;
	isClosed: boolean;
	total: number;
	createdAt: Date;
	closedAt: Date;
	details: ConsumptionDetail[];
}
