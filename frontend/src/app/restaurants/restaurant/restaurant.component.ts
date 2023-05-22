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
	selectedDate: string = "";
	today!: any;
	paramDate!: string;
	paramHours!: string;
	selectedTable: number = -1;
	clientDocumentNumber: string = "";
	clientExist: boolean = false;
	clientName: string = "";
	clientLastName: string = "";
	capacity: number = -1;

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
		if (changes.id === this.selectedTable) {
			this.selectedTable = -1;
			this.capacity = -1
		}
		else {
			this.selectedTable = changes.id;
			this.capacity = changes.capacity;
		}
	}

	ngOnChangesClient(changes: any): void {
		this.clientExist = false;
		this.clientExist = this.clients.some(function (el) {
			return el.documentNumber === changes;
		});
		if (this.clientExist) {
			this.clientName = "";
			this.clientLastName = "";
		}
	}

	async ngOnSubmit(): Promise<void> {
		if (this.selectedTable === -1) {
			console.log("No se selecciono mesa")
			return
		}
		if (this.selectedHours.length === 0) {
			console.log("No se selecciono hora")
			return
		}
		if (this.selectedDate === "") {
			console.log("No se selecciono fecha")
			return
		}
		if (this.clientDocumentNumber === "") {
			console.log("No se ingreso cedula")
			return
		}
		let clientExisted = true;
		let clientId = -1;
		if (!this.clientExist) {
			let client = {
				documentNumber: this.clientDocumentNumber,
				name: this.clientName,
				lastName: this.clientLastName
			}
			clientExisted = false;
			clientId = await this.clientsService.postClient(JSON.stringify(client)).then((data: any) => {
				return data.data.id;
			})
		}
		let aux: { start: number; end: number; }[] = []
		this.selectedHours.forEach(element => {
			let range = {
				start: +element.split(' ')[0],
				end: +element.split(' ')[2]
			}
			aux.push(range)
		});
		if (clientExisted)
			clientId = this.clients.find(el => el.documentNumber === this.clientDocumentNumber)!.id
		let reservation = {
			capacity: this.capacity,
			clientId: clientId,
			date: this.selectedDate,
			tableId: this.selectedTable,
			range_times: aux
		}
		this.reservationsService.postReservation(JSON.stringify(reservation))
		alert("Reserva realizada con exito")
		location.reload();
	}
}
