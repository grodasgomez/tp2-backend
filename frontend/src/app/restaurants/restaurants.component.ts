import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from '../services/service';
import { Restaurant, RestaurantData } from '../interface/restaurant';

@Component({
	selector: 'app-restaurants',
	templateUrl: './restaurants.component.html',
	styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
	restaurants: Restaurant[] = [];

	constructor(private restaurantService: RestaurantsService) { }

	ngOnInit(): void {
		this.restaurantService.getRestaurants()
		.subscribe((data: RestaurantData) => {
			this.restaurants = data.data;
		});
  	}
}
