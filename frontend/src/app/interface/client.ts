export interface ClientData {
	data: Client[];
}

export interface Client {
	id: number;
	documentNumber: string;
	name: string;
	lastName: string;
}
