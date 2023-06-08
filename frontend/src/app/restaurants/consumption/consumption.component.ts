import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table, TableData } from 'src/app/interface/table';
import { TablesRestaurantService } from 'src/app/services/service';

@Component({
	selector: 'app-consumption',
	templateUrl: './consumption.component.html',
	styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent implements OnInit, OnDestroy, OnChanges {
	private sub: any;
	tables: Table[] = [];
	private id: number = 0;
	selectedTable: number = -1;
	currentTables: Table[] = [];
	floors: number[] = [];
	selectedFloor: number = 1;
	constructor(private route: ActivatedRoute, private tableService: TablesRestaurantService) { }

	ngOnInit(): void {
		this.sub = this.route.params.subscribe(params => {
			this.id = +params['id']; // (+) converts string 'id' to a number
		});
		this.tableService.getTables(this.id).then((data: TableData) => {
			this.tables = data.data;
			this.createMap();
			this.updateMap();
		});
	}

	createMap() {
		let floors = 0;
		let maxX = 0;
		let maxY = 0;
		this.tables.forEach(element => {
			maxX = Math.max(element.positionX, maxX);
			maxY = Math.max(element.positionY, maxY);
			floors = Math.max(element.floor, floors);
		});
		this.floors = Array.from(Array(floors).keys()).map(x => x + 1);
		const tableButtons = document.getElementById('table-buttons')!;
		if (tableButtons) {
			tableButtons.style.width = `${maxX + 115}px`;
			tableButtons.style.height = `${maxY + 37}px`;
		}
	}

	updateMap() {
		this.selectedTable = -1;
		this.currentTables = [];
		this.tables.forEach(table => {
			if (+this.selectedFloor === +table.floor) {
				this.currentTables.push(table);
			}
		});
	}

	ngOnButtonChange(changes: any): void {
		if (changes.id === this.selectedTable) {
			this.selectedTable = -1;
		}
		else {
			this.selectedTable = changes.id;
		}
	}

	ngOnChanges(changes: any): void {
		this.selectedFloor = changes
		this.updateMap();
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
