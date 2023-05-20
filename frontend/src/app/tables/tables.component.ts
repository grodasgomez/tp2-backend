import { Component, OnInit } from '@angular/core';
import { TablesService } from '../services/service';
import { Table, TableData } from '../interface/table';

@Component({
	selector: 'app-tables',
	templateUrl: './tables.component.html',
	styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
	tables: Table[] = [];

	constructor(private tableService: TablesService) { }

	ngOnInit(): void {
		this.tableService.getTables().subscribe((data: TableData) => {
			this.tables = data.data;
		})
  	}
}
