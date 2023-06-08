import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumptionTableComponent } from './consumptionTable/consumptionTable.component';
import { ConsumptionComponent } from './consumption.component';

const routes: Routes = [
	{ path: '', component: ConsumptionComponent },
	{ path: ':id', component: ConsumptionTableComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConsumptionRoutingModule { }