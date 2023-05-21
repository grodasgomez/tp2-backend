import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table, TableData } from 'src/app/interface/table';
import { TablesRestaurantService } from 'src/app/services/service';

@Component({
	selector: 'app-restaurant',
	templateUrl: './restaurant.component.html',
	styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit, OnDestroy, OnChanges {
	id: number = 0;
	selectedFloor: number = 1;
	floors: number[] = [];
	tables: Table[] = [];
	currentTables!: Table[];
	private sub: any;

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
		const tableButtons = document.getElementById('table-buttons')!;
		tableButtons.style.width = `${maxX + 115}px`;
		tableButtons.style.height = `${maxY + 37}px`;
		this.floors = Array.from(Array(floors).keys()).map(x => x + 1);
	}

	updateMap() {
		this.currentTables = [];
		this.tables.forEach(table => {
			if (+this.selectedFloor === +table.floor) {
				this.currentTables.push(table);
			}
		});
		console.log(this.currentTables);
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	ngOnChanges(changes: any): void {
		this.selectedFloor = changes
		this.updateMap();
	}
}
