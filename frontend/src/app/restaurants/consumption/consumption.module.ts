import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ConsumptionTableComponent } from './consumptionTable/consumptionTable.component';
import { ConsumptionRoutingModule } from './consumption-routing.module';

@NgModule({
	declarations: [
		ConsumptionTableComponent
	],
	imports: [
		CommonModule,
		ConsumptionRoutingModule,
		FormsModule
	]
})
export class ConsumptionModule { }
