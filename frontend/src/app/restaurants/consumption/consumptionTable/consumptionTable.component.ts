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
	consumption!: Consumption;
	consumptionDetail!: ConsumptionDetail[];
	currentClient!: Client;
	clients!: Client[];
	clientsFiltered!: Client[];
	products!: Product[];
	categories!: Category[];
	newClientCI: string = '';
	newClientName: string = '';
	newClientLastName: string = '';
	list: boolean = false;
	searchClient: string = '';

	constructor(private route: ActivatedRoute, private categoryService: CategoryService,
		private prodService: ProductService, private consService: ConsumptionService,
		private consDetailService: ConsumptionDetailService, private clientService: ClientsService) { }

	async ngOnInit(): Promise<void> {
		this.sub = this.route.params.subscribe(params => {
			this.id = params['id'];
		});
		this.products = await this.categoryService.getCategories();
		this.categories = await this.prodService.getProducts();
		this.clients = (await this.clientService.getClients()).data;
		this.clientsFiltered = [...this.clients];
		this.consumption = (await this.consService.getConsumptions(this.id)).data;
		this.currentClient = this.clients.find(client => +this.consumption.clientId == +client.id)!;
		if (this.consumption) {
			this.occupied = true;
			this.consumptionDetail = this.consumption.details;
			// let d = {
			// 	"clientId": 1,
			// 	"tableId": 3
			// }
			// let f = {
			// 	"consumptionId": 6,
			// 	"productId": 1,
			// 	"quantity": 1
			// }
		}
		else {
			// TODO: create consumption
		}
	}

	async addClient(): Promise<void> {
		let client = {
			documentNumber: this.newClientCI,
			name: this.newClientName,
			lastName: this.newClientLastName
		}
		this.currentClient = (await this.clientService.postClient(JSON.stringify(client))).data;
		this.clients.push(this.currentClient);
		console.log(this.currentClient);
	}

	changeList(): void {
		this.list = !this.list;
		this.searchClient = '';
		this.clientsFiltered = [...this.clients];
	}

	selectClient(id: number): void {
		let temp = {
			"clientId": id,
		}
		let data = JSON.stringify(temp);
		this.currentClient = this.clients.find(client => +id === +client.id)!;
		this.consService.updateClientConsumption(this.consumption.id, data);
	}

	filterClients(): void {
		this.clientsFiltered = this.clients.filter(client => client.name.toLowerCase().includes(this.searchClient.toLowerCase()) ||
		client.lastName.toLowerCase().includes(this.searchClient.toLowerCase()) ||
		client.documentNumber.includes(this.searchClient.toLowerCase()));
	}

	close(): void {
		this.consService.updateCloseConsumption(this.consumption.id);
		location.reload();
	}
}
