export interface ReservationData {
	data: Reservation[];
}

export interface Reservation {
	id: number;
	date: string;
	table: any;
	restaurant: number;
	client: number;
	range_times: {start: number, end: number}[];
}
