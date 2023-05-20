import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table, TableData } from 'src/app/interface/table';
import { TablesRestaurantService } from 'src/app/services/service';

@Component({
	selector: 'app-restaurant',
	templateUrl: './restaurant.component.html',
	styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit, OnDestroy {
	id: number = 0;
	private sub: any;
	private maxX: number = 0;
	private maxY: number = 0;
	private floors: number = 0;
	tables: Table[] = [];

	@ViewChild('canvas', { static: true })
	canvas!: ElementRef<HTMLCanvasElement>;

	private ctx!: CanvasRenderingContext2D;

	constructor(private route: ActivatedRoute, private tableService: TablesRestaurantService) { }

	ngOnInit(): void {
		this.sub = this.route.params.subscribe(params => {
			this.id = +params['id']; // (+) converts string 'id' to a number
		});
		this.tableService.getTables(this.id).then((data: TableData) => {
			this.tables = data.data;
			this.ctx = this.canvas.nativeElement.getContext('2d')!;
			this.tables.forEach(element => {
				this.maxX = Math.max(element.positionX, this.maxX);
				this.maxY = Math.max(element.positionY, this.maxY);
				this.floors = Math.max(element.floor, this.floors);
			});
			this.maxX += 100
			this.maxY += 100
			this.canvas.nativeElement.width = this.maxX;
			this.canvas.nativeElement.height = this.maxY;
			this.tables.forEach(element => {
				this.ctx.fillStyle = 'rgb(100, 100, 200)';
				this.ctx.fillRect(element.positionX, this.maxY - element.positionY - 50, 50, 50);
				this.ctx.fillStyle = 'rgb(0, 0, 0)';
				this.ctx.textAlign = 'center';
				this.ctx.textBaseline = "middle";
				this.ctx.font = '20px sans-serif';
				this.ctx.fillText(String(element.capacity), element.positionX + 25, this.maxY - element.positionY - 25);
			});
		})
		this.canvas.nativeElement.addEventListener('click', ev => this.collides(ev));
	}

	collides(e: any) {
		var rect = e.target.getBoundingClientRect();
		var x = e.clientX - rect.left; //x position within the element.
		var y = e.clientY - rect.top;  //y position within the element.
		var isCollision = false;
		for (var i = 0, len = this.tables.length; i < len; i++) {
			var left = this.tables[i].positionX, right = this.tables[i].positionX + 50;
			var top = this.maxY - this.tables[i].positionY - 50, bottom = this.maxY - this.tables[i].positionY;
			if (right >= x
				&& left <= x
				&& bottom >= y
				&& top <= y) {
				isCollision = true;
			}
		}
		console.log(isCollision)
		return isCollision;
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}