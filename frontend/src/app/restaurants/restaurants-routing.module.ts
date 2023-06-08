import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantsComponent } from './restaurants.component';
import { RestaurantComponent } from './restaurant/restaurant.component';

const routes: Routes = [
	{ path: '', component: RestaurantsComponent },
	{ path: ':id', component: RestaurantComponent },
	{ path: ':id/consumption', loadChildren: () => import('./consumption/consumption.module').then(m => m.ConsumptionModule) }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RestaurantsRoutingModule { }