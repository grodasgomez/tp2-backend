import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { RestaurantsComponent } from './restaurants.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		RestaurantsComponent,
		RestaurantComponent
	],
	imports: [
		CommonModule,
		RestaurantsRoutingModule,
		FormsModule
	]
})
export class RestaurantsModule { }
