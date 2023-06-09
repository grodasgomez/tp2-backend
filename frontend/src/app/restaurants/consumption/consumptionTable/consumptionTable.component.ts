import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService, ClientsService, ConsumptionDetailService, ConsumptionService, ProductService } from 'src/app/services/service';
import { Consumption } from 'src/app/interface/consumption';
import { ConsumptionDetail } from 'src/app/interface/consumptionDetail';
import { Client } from 'src/app/interface/client';
import { Product } from 'src/app/interface/products';
import { Category } from 'src/app/interface/category';
import "pdfmake/build/pdfmake"
import { QuantizableProduct } from 'src/app/interface/quantizableProduct';
const pdfMake = window["pdfMake"];
pdfMake.fonts = {
  Roboto: {
      normal: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
      bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
      italics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
      bolditalics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

@Component({
	selector: 'app-consumptionTable',
	templateUrl: './consumptionTable.component.html',
	styleUrls: ['./consumptionTable.component.css']
})
export class ConsumptionTableComponent implements OnInit {
	private sub: any;
	id: number = 0;
	occupied: boolean = false;
	consumptionDetail: ConsumptionDetail[] = [];
	currentClient: Client = { id: -1, documentNumber: "", name: "No", lastName: "Asignado" };
	consumption: Consumption = { id: -1, clientId: -1, details: [], total: 0, isClosed: false, tableId: this.id, createdAt: new Date(), closedAt: new Date() };;
	clients!: Client[];
	clientsFiltered!: Client[];
	newClientCI: string = "";
	newClientName: string = "";
	newClientLastName: string = "";
	list: boolean = false;
	searchClient: string = "";
	currentMethod: string = "Seleccionar Cliente"
	availableProducts!: QuantizableProduct[]; 

	constructor(private route: ActivatedRoute, private categoryService: CategoryService,
		private prodService: ProductService, private consService: ConsumptionService,
		private consDetailService: ConsumptionDetailService, private clientService: ClientsService) { }

	async ngOnInit(): Promise<void> {
		this.sub = this.route.params.subscribe(params => {
			this.id = params['id'];
		});
		this.availableProducts = (await this.prodService.getProducts()).data.map((x: Product) => {
			console.log(x);
			return {
			'id': x.id,
			'name': x.name,
			'categoryId': x.categoryId,
			'price': x.price,
			'quantity': 0
		}});

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
		if (this.newClientCI == "" || this.newClientName == "" || this.newClientLastName == "")
		{
			alert("Debe ingresar todos los datos del cliente");
			return;
		}
		let client = {
			documentNumber: this.newClientCI,
			name: this.newClientName,
			lastName: this.newClientLastName
		}
		const res = await this.clientService.postClient(JSON.stringify(client));
		this.currentClient = res.data;
		if (!this.occupied)
			this.createConsumption();
		this.clients.push(this.currentClient);
		//update client in consumption after insert a new client
		let temp = {
			"clientId": this.currentClient.id,
		}
		let data = JSON.stringify(temp);
		this.consService.updateClientConsumption(this.consumption.id, data);
		this.filterClients();
	}

	async createConsumption(): Promise<void> {
		let temp = {
			"clientId": this.currentClient.id,
			"tableId": this.id
		}
		this.occupied = true;
		this.consumption = (await this.consService.postConsumption(JSON.stringify(temp))).data;
    this.consumption.details = [];

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
		if (!this.occupied)
			await this.createConsumption();
		this.consService.updateClientConsumption(this.consumption.id, data);
	}

	filterClients(): void {
		this.clientsFiltered = this.clients.filter(client => client.name.toLowerCase().includes(this.searchClient.toLowerCase()) ||
			client.lastName.toLowerCase().includes(this.searchClient.toLowerCase()) ||
			client.documentNumber.includes(this.searchClient.toLowerCase()));
	}

	async close() {
		await this.consService.updateCloseConsumption(this.consumption.id);
    const bodyDetails = this.consumptionDetail.map((detail) => {
      return [
        detail.product.name,
        detail.product.price,
        detail.quantity,
        detail.product.price * detail.quantity
      ];
    });

    const documentDefinition = {
      content: [
        {
          text: "COMPROBANTE DE CONSUMICION\n",
          alignment: "center",
        },
        `Cliente: ${this.currentClient.name} ${this.currentClient.lastName}`,
        `Nro Mesa: ${this.consumption.tableId}`,
        `Fecha: ${new Date(this.consumption.createdAt).toLocaleDateString()}`,
        {
          text: "DETALLE\n\n",
          alignment: "center",
        },
        {
          layout: "lightHorizontalLines", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["*", "auto", 100, "*"],
            body: [
              [
                { text: "Producto", bold: true },
                { text: "Precio Unitario", bold: true },
                { text: "Cantidad", bold: true },
                { text: "Precio total", bold: true },
              ],
              ...bodyDetails,
            ],
          },
        },
        {
          text: `\n\nTotal a pagar: ${this.consumption.total}`,
          bold: true,
        },
      ],
    } as any;

    pdfMake.createPdf(documentDefinition).open();

    setTimeout(() => {
      location.reload();
    }, 1000);
	}

	addDetail(product: QuantizableProduct) {
		if (!(document.forms as { [key: string]: any })["product"+product.id.toString()+"form"].reportValidity())
			return;
		if(this.currentClient.id === -1) {
			alert("No puede agregar productos antes de seleccionar cliente");
			return;
		}

		const p: any = {
			'consumptionId': this.consumption.id,
			'productId': product.id,
			'quantity': product.quantity,
		};
		this.consDetailService.postConsumptionDetail(JSON.stringify(p)).then((res: any) => {
			if (res.error) {
				alert("No se pudo agregar!");
				return;
			}
			res.data.product = product;
			this.consumption.total += product.price * product.quantity;
			delete(res.data.product.quantity);
			this.consumptionDetail.push(res.data);
			product.quantity = 0;
		})
	}
}
