import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestaurantData } from '../interface/restaurant';
import { TableData } from '../interface/table';

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
