import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { TablesComponent } from './tables/tables.component';

const routes: Routes = [
	{ path: 'restaurants', component: RestaurantsComponent },
	{ path: 'tables', component: TablesComponent },
	{ path: '**', redirectTo: 'restaurants', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }