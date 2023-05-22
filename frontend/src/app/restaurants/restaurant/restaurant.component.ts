import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table, TableData } from 'src/app/interface/table';
import { TablesRestaurantService, ReservationsRestaurantService, ClientsService } from 'src/app/services/service';
import { Reservation, ReservationData } from '../../interface/reservation';
import { Client } from 'src/app/interface/client';

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
	reservations!: Reservation[];
	clients!: Client[];
	private sub: any;
	hours!: string[]
	selectedHours!: string[]
	selectedHour: number = 0;
	selectedDate: any;
	today!: any;
	paramDate!: string;
	paramHours!: string;
	selectedTable: number = -1;
	clientId!: number;
	clientExist: boolean = false;

	constructor(private route: ActivatedRoute, private tableService: TablesRestaurantService, private reservationsService: ReservationsRestaurantService, private clientsService: ClientsService) { }

	ngOnInit(): void {
		this.sub = this.route.params.subscribe(params => {
			this.id = +params['id']; // (+) converts string 'id' to a number
		});
		this.tableService.getTables(this.id).then((data: TableData) => {
			this.tables = data.data;
			this.hours = ['12 a 13', '13 a 14', '14 a 15', '19 a 20', '20 a 21', '21 a 22', '22 a 23'];
			this.selectedHours = [];
			this.createMap();
			this.updateMap();
		});
		this.clientsService.getClients().then((data: any) => {
			this.clients = data.data;
			console.log(this.clients)
		});
		let currentTime = new Date().getTime();
		this.today = new Date(currentTime - 4 * 60 * 60 * 1000).toISOString().split('T')[0];
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
			if (this.selectedDate) {
				let free = true;
				this.reservations.forEach(reservation => {
					if (reservation.table.id === table.id) {
						reservation.range_times.forEach(range => {
							if (this.selectedHours.includes(range.start + ' a ' + range.end)) {
								free = false;
							}
						})
					}
				})
				if (free) {
					if (+this.selectedFloor === +table.floor) {
						this.currentTables.push(table);
					}
				}
			}
			else if (+this.selectedFloor === +table.floor) {
				this.currentTables.push(table);
			}
		});
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}

	ngOnChanges(changes: any): void {
		this.selectedFloor = changes
		this.updateMap();
	}

	ngOnChangesHour(changes: any): void {
		if (changes.checked)
			this.selectedHours.push(this.hours[changes.id])
		else
			this.selectedHours.splice(this.selectedHours.indexOf(this.hours[changes.id]), 1)
		this.updateMap();
	}

	ngOnChangesDate(changes: any): void {
		if (changes === "")
			return
		this.reservationsService.getReservations(this.id, changes).then((data: ReservationData) => {
			this.reservations = data.data;
			this.selectedDate = changes;
			this.updateMap();
		})
	}

	ngOnButtonChange(changes: any): void {
		console.log(changes)
		if (changes.id === this.selectedTable)
			this.selectedTable = -1;
		else
			this.selectedTable = changes.id;
	}

	ngOnChangesClient(changes: any): void {

	}
}
