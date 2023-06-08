import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-consumptionTable',
	templateUrl: './consumptionTable.component.html',
	styleUrls: ['./consumptionTable.component.css']
})
export class ConsumptionTableComponent implements OnInit {
	private sub: any;
	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {

	}

}
