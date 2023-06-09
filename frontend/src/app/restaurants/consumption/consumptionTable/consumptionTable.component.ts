import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, ClientsService, ConsumptionDetailService, ConsumptionService, ProductService } from 'src/app/services/service';
import { Consumption } from 'src/app/interface/consumption';
import { ConsumptionDetail } from 'src/app/interface/consumptionDetail';
import { Client } from 'src/app/interface/client';
import { Product } from 'src/app/interface/products';
import { Category } from 'src/app/interface/category';

@Component({
	selector: 'app-consumptionTable',
	templateUrl: './consumptionTable.component.html',
	styleUrls: ['./consumptionTable.component.css']
})
export class ConsumptionTableComponent implements OnInit {
	private sub: any;
	id: number = 0;
	occupied: boolean = false;
	consumptionDetail!: ConsumptionDetail[];
	currentClient: Client = { id: -1, documentNumber: "", name: "No", lastName: "Asignado" };
	consumption: Consumption = { id: -1, clientId: -1, details: [], total: 0, isClosed: false, tableId: this.id, createdAt: new Date(), closedAt: new Date() };;
	clients!: Client[];
	clientsFiltered!: Client[];
	products!: Product[];
	categories!: Category[];
	newClientCI: string = "";
	newClientName: string = "";
	newClientLastName: string = "";
	list: boolean = false;
	searchClient: string = "";
	currentMethod: string = "Seleccionar Cliente"

	constructor(private route: ActivatedRoute, private categoryService: CategoryService,
		private prodService: ProductService, private consService: ConsumptionService,
		private consDetailService: ConsumptionDetailService, private clientService: ClientsService) { }

	async ngOnInit(): Promise<void> {
		this.sub = this.route.params.subscribe(params => {
			this.id = params['id'];
		});
		this.products = await this.prodService.getProducts();
		this.categories = await this.categoryService.getCategories();
		this.clients = (await this.clientService.getClients()).data;
		this.clientsFiltered = [...this.clients];
		let temp = await this.consService.getConsumptions(this.id);
		if (temp.data) {
			this.consumption = temp.data;
			this.currentClient = this.clients.find(client => +this.consumption.clientId == +client.id)!;
			this.occupied = true;
			this.consumptionDetail = this.consumption.details;
		}
	}

	async addClient(): Promise<void> {
		let client = {
			documentNumber: this.newClientCI,
			name: this.newClientName,
			lastName: this.newClientLastName
		}
		this.currentClient = (await this.clientService.postClient(JSON.stringify(client))).data;
		this.createConsumption();
		this.clients.push(this.currentClient);
		this.filterClients();
	}

	async createConsumption(): Promise<void> {
		let temp = {
			"clientId": this.currentClient.id,
			"tableId": this.id
		}
		this.occupied = true;
		this.consumption = (await this.consService.postConsumption(JSON.stringify(temp))).data;

	}

	changeList(): void {
		this.list = !this.list;
		this.searchClient = "";
		this.clientsFiltered = [...this.clients];
		if (this.list) {
			this.currentMethod = "Agregar Cliente";
		}
		else {
			this.currentMethod = "Seleccionar Cliente";
		}
	}

	async selectClient(id: number): Promise<void> {
		let temp = {
			"clientId": id,
		}
		let data = JSON.stringify(temp);
		this.currentClient = this.clients.find(client => +id === +client.id)!;
		await this.createConsumption();
		this.consService.updateClientConsumption(this.consumption.id, data);
	}

	filterClients(): void {
		this.clientsFiltered = this.clients.filter(client => client.name.toLowerCase().includes(this.searchClient.toLowerCase()) ||
			client.lastName.toLowerCase().includes(this.searchClient.toLowerCase()) ||
			client.documentNumber.includes(this.searchClient.toLowerCase()));
	}

	async close(): Promise<void> {
		await this.consService.updateCloseConsumption(this.consumption.id);
		location.reload();
	}
}
