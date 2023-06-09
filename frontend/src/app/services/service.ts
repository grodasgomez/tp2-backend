import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { RestaurantData } from '../interface/restaurant';
import { TableData } from '../interface/table';
import { Reservation, ReservationData } from '../interface/reservation';
import { Client, ClientData } from '../interface/client';

@Injectable({
	providedIn: 'root'
})
export class RestaurantsService {
	private apiURL = 'http://localhost:3000/restaurants';
	constructor(private http: HttpClient) { }

	getRestaurants(): Observable<RestaurantData> {
		return this.http.get<RestaurantData>(this.apiURL);
	}
}

@Injectable({
	providedIn: 'root'
})
export class TablesService {
	private apiURL = 'http://localhost:3000/tables';
	constructor(private http: HttpClient) { }

	getTables(): Observable<TableData> {
		return this.http.get<TableData>(this.apiURL);
	}
}

@Injectable({
	providedIn: 'root'
})
export class TablesRestaurantService {
	private apiURL = 'http://localhost:3000/tables/';
	constructor(private http: HttpClient) { }

	async getTables(id: number): Promise<TableData> {
		return await lastValueFrom(this.http.get<TableData>(this.apiURL + String(id)));
	}
}

@Injectable({
	providedIn: 'root'
})
export class ReservationsRestaurantService {
	private apiURL = 'http://localhost:3000/reservations';
	constructor(private http: HttpClient) { }

	async getReservations(restaurantId: number, date: string): Promise<ReservationData> {
		return await lastValueFrom(this.http.get<ReservationData>(this.apiURL + "?restaurant=" + restaurantId + '&date=' + date));
	}

	postReservation(data: String): any {
		const options = { headers: { 'Content-Type': 'application/json' } };
		return this.http.post<Reservation>(this.apiURL, data, options).subscribe(
			(t: Reservation) => console.info(JSON.stringify(t))
		);
	}
}

@Injectable({
	providedIn: 'root'
})
export class ClientsService {
	private apiURL = 'http://localhost:3000/clients';
	constructor(private http: HttpClient) { }

	async getClients(): Promise<ClientData> {
		return await lastValueFrom(this.http.get<ClientData>(this.apiURL));
	}

	async postClient(data: String): Promise<any> {
		const options = { headers: { 'Content-Type': 'application/json' } };
		return lastValueFrom(this.http.post<any>(this.apiURL, data, options))
	}
}

@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	private apiURL = 'http://localhost:3000/categories';
	constructor(private http: HttpClient) { }

	async getCategories(): Promise<any> {
		return await lastValueFrom(this.http.get<any>(this.apiURL));
	}
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	private apiURL = 'http://localhost:3000/products';
	constructor(private http: HttpClient) { }

	async getProducts(): Promise<any> {
		return await lastValueFrom(this.http.get<any>(this.apiURL));
	}
}

@Injectable({
	providedIn: 'root'
})
export class ConsumptionService {
	private apiURL = 'http://localhost:3000/consumption';
	constructor(private http: HttpClient) { }

	async getConsumptions(id: number): Promise<any> {
		return await lastValueFrom(this.http.get<any>(this.apiURL+ '/' + id));
	}

	async postConsumption(data: String): Promise<any> {
		const options = { headers: { 'Content-Type': 'application/json' } };
		return lastValueFrom(this.http.post<any>(this.apiURL, data, options))
	}

	async updateClientConsumption(id: number, data: String): Promise<any> {
		const options = { headers: { 'Content-Type': 'application/json' } };
		return lastValueFrom(this.http.put<any>(this.apiURL + '/client/' + id, data, options))
	}

	async updateCloseConsumption(id:number): Promise<any> {
		const options = { headers: { 'Content-Type': 'application/json' } };
		return lastValueFrom(this.http.put<any>(this.apiURL + '/close/' + id, null, options))
	}
}

@Injectable({
	providedIn: 'root'
})
export class ConsumptionDetailService {
	private apiURL = 'http://localhost:3000/consumptionDetails';
	constructor(private http: HttpClient) { }

	async getConsumptionDetails(id: number): Promise<any> {
		return await lastValueFrom(this.http.get<any>(this.apiURL+ '/' + id));
	}

	async postConsumptionDetail(data: String): Promise<any> {
		const options = { headers: { 'Content-Type': 'application/json' } };
		return lastValueFrom(this.http.post<any>(this.apiURL, data, options))
	}
}
