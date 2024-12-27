import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInput, MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
  selector: 'app-dates-table2',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatInput, FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <div class="width">
      <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource">

          <!-- Position Column -->
          <ng-container matColumnDef="position">
            <th mat-header-cell *matHeaderCellDef>Position</th>
            <td mat-cell *matCellDef="let element">
              <mat-form-field appearance="outline" class="date-picker-cell">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker1" [(ngModel)]="element.position">
                <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
                <mat-datepicker #picker1></mat-datepicker>
              </mat-form-field>
            </td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">
              <mat-form-field appearance="outline" class="date-picker-cell">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker2" [(ngModel)]="element.name">
                <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
                <mat-datepicker #picker2></mat-datepicker>
              </mat-form-field>
            </td>
          </ng-container>

          <!-- Weight Column -->
          <ng-container matColumnDef="weight">
            <th mat-header-cell *matHeaderCellDef>Weight</th>
            <td mat-cell *matCellDef="let element">
              <mat-form-field appearance="outline" class="date-picker-cell">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker3" [(ngModel)]="element.weight">
                <mat-datepicker-toggle matIconSuffix [for]="picker3"></mat-datepicker-toggle>
                <mat-datepicker #picker3></mat-datepicker>
              </mat-form-field>
            </td>
          </ng-container>

          <!-- Symbol Column -->
          <ng-container matColumnDef="symbol">
            <th mat-header-cell *matHeaderCellDef>Symbol</th>
            <td mat-cell *matCellDef="let element">
              <mat-form-field appearance="outline" class="date-picker-cell">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker4" [(ngModel)]="element.symbol">
                <mat-datepicker-toggle matIconSuffix [for]="picker4"></mat-datepicker-toggle>
                <mat-datepicker #picker4></mat-datepicker>
              </mat-form-field>
            </td>
          </ng-container>

          <!-- Table Rows -->
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 20]"
                       showFirstLastButtons
                       aria-label="Select page of periodic elements">
        </mat-paginator>
      </div>
    </div>
  `,
  styleUrl: './dates-table2.component.scss'
})
export class DatesTable2Component implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol']
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA)

  @ViewChild(MatPaginator) paginator!: MatPaginator

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
  }
}

export interface PeriodicElement {
  name: Date;
  position: Date;
  weight: Date;
  symbol: Date;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: new Date(), name: new Date(), weight: new Date(), symbol: new Date()},
  {position: new Date(), name: new Date(), weight: new Date(), symbol: new Date()},
  {position: new Date(), name: new Date(), weight: new Date(), symbol: new Date()},
];
