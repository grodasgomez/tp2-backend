export interface TableData {
	data: Table[];
}

export interface Table {
	id: number;
	name: string;
	restaurantId: number;
	positionX: number;
	positionY: number;
	floor: number;
	capacity: number;
}
