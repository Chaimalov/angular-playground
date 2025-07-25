import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule, GridOptions, ModuleRegistry, TextFilterModule } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule]);

@Component({
  selector: 'app-grid',
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    class="h-80 ag-theme-quartz"
    theme="legacy"
    [gridOptions]="gridOptions"></ag-grid-angular>`,
})
export class GridComponent {
  gridOptions: GridOptions = {
    columnDefs: [{ field: 'make' }, { field: 'model' }, { field: 'price' }],

    rowData: [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxster', price: 72000 },
      { make: 'BMW', model: 'X5', price: 90000 },
      { make: 'Mercedes', model: 'C-Class', price: 50000 },
      { make: 'Audi', model: 'A4', price: 45000 },
      { make: 'Volkswagen', model: 'Golf', price: 30000 },
      { make: 'Nissan', model: '370Z', price: 40000 },
      { make: 'Chevrolet', model: 'Camaro', price: 60000 },
      { make: 'Hyundai', model: 'Elantra', price: 20000 },
    ],
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      contextMenuItems: ['copy', 'copyWithHeaders', 'paste', 'export', 'separator', 'resetColumns'],
    },
    animateRows: true,
  };
}
