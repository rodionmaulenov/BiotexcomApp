import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  model,
  OnChanges,
  OnDestroy,
  Output, signal,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter
} from '@angular/material/core';
import {FetchDate} from '../data/represent_data/profile.represent';
import {DateFormService} from './data/services/load-date-form.service';
import {DateEmptyControlService} from './data/services/empty-dates-form.service';
import {SubmitData} from './data/interfaces/submit-data.interface';
import {Subject, takeUntil} from 'rxjs';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {CUSTOM_DATE_FORMATS, CustomDateAdapter} from '../../../data/rus_datepicker/rus-datepicker';
import {DateChangeTrackingService} from './date-change-tracking.service';
import {FormArrayUtilityService} from './form-array-utility.service';
import {PaginatorComponent} from '../paginator/paginator.component';
import {russianPaginatorIntl} from '../paginator/paginator-rus.service';


export type TableFields = {
  entry: string;
  exit: string;
  country: string,
  disable: boolean,
  daysLeft: number,
  delete: boolean
}

@Component({
  selector: 'app-dates-change-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatPaginatorModule, MatInput, FormsModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatSlideToggleModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, PaginatorComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MatPaginatorIntl, useValue: russianPaginatorIntl()},
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
  ],
  template: `
    <div class="wrapper">
      <table #table mat-table [dataSource]="childPaginator().paginatedData()">

        <!-- Entry Column -->
        <ng-container matColumnDef="entry">
          <th mat-header-cell *matHeaderCellDef>Въезд</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <ng-container [formGroup]="asFormGroup(row)">
              <mat-form-field class="custom_text">
                <input matInput
                       [matDatepicker]="picker"
                       formControlName="entry"
                       placeholder="Выберите дату"
                >
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
            </ng-container>
          </td>
        </ng-container>

        <!-- Exit Column -->
        <ng-container matColumnDef="exit">
          <th mat-header-cell *matHeaderCellDef>Выезд</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <ng-container [formGroup]="asFormGroup(row)">
              <mat-form-field class="custom_text">
                <input matInput
                       [matDatepicker]="picker1"
                       formControlName="exit"
                       placeholder="Выберите дату"
                >
                <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
                <mat-datepicker #picker1></mat-datepicker>
              </mat-form-field>
            </ng-container>
          </td>
        </ng-container>

        <!-- Country Column -->
        <ng-container matColumnDef="country">
          <th mat-header-cell *matHeaderCellDef>Страна</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <ng-container [formGroup]="asFormGroup(row)">
              <mat-form-field>
                <mat-select formControlName="country" placeholder="Выберите страну" class="custom_text">
                  <mat-option value="UKR">Украина</mat-option>
                  <mat-option value="MLD">Молдова</mat-option>
                  <mat-option value="UZB">Узбекистан</mat-option>
                </mat-select>
              </mat-form-field>
            </ng-container>
          </td>
        </ng-container>

        <!-- Disable Column -->
        <ng-container matColumnDef="disable">
          <th mat-header-cell *matHeaderCellDef>Отслеживать</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <ng-container [formGroup]="asFormGroup(row)">
              <mat-slide-toggle formControlName="disable"></mat-slide-toggle>
            </ng-container>
          </td>
        </ng-container>

        <!-- Days Left Column -->
        <ng-container matColumnDef="days_left">
          <th mat-header-cell *matHeaderCellDef>Дней прошло</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <ng-container [formGroup]="asFormGroup(row)">
              <p class="custom_text">{{ row.get('days_left')?.value || '_' }}</p>
            </ng-container>
          </td>
        </ng-container>

        <!-- Delete Column -->
        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef>Удалить</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <ng-container [formGroup]="asFormGroup(row)">
              <button mat-icon-button (click)="deleteRow(row.get('id')?.value)">
                <mat-icon>delete</mat-icon>
              </button>
            </ng-container>
          </td>
        </ng-container>

        <!-- Table Rows -->
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row
            *matRowDef="let row; columns: displayedColumns;"
            [formGroup]="asFormGroup(row)"
            [class.deleted]="row.get('deleted')?.value"
            [class.no-track]="row.get('no_track')?.value">
        </tr>
      </table>
    </div>

    <div class="paginator-button">
      <div class="left-group">
        <button mat-flat-button
                (click)="addRow()"
                [disabled]="formArray.invalid">
          Добавить
        </button>

        <button mat-flat-button
                (click)="onExtendClick()"
                [disabled]="formArray.invalid
                || restrictUpdating()
                || isExtendButtonDisabled">
          Продлить
        </button>
      </div>
      <app-paginator #paginator></app-paginator>
    </div>
  `,
  styleUrl: './dates-change-table.component.scss',
})
export class DatesChangeTableComponent implements OnDestroy, OnChanges {
  private readonly FilledFormServ = inject(DateFormService)
  private readonly EmptyFormServ = inject(DateEmptyControlService)
  private readonly FormFieldsServ = inject(DateChangeTrackingService)
  protected readonly FormUtils = inject(FormArrayUtilityService)
  protected readonly displayedColumns: string[] = ['entry', 'exit', 'country', 'disable', 'days_left', 'delete']
  protected formArray = new FormArray<FormGroup>([])
  private destroy$ = new Subject<void>()
  protected isExtendButtonDisabled: boolean = false
  protected restrictUpdating = signal<boolean>(true)

  childFormStatus = model<boolean>()
  lengthNotZero = model<boolean>()
  formInputData = input<FetchDate[] | []>([])
  @Output() childFormDataPush = new EventEmitter<SubmitData[]>()
  childPaginator = viewChild.required(PaginatorComponent)
  table = viewChild<MatTable<TableFields>>('table')


  ngOnChanges({formInputData}: SimpleChanges) {
    if (formInputData && !formInputData.firstChange) {
      const {currentValue} = formInputData

      if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0)) {
        this.addRow()
      } else {
        this.formArray = this.FilledFormServ.createFormArrayFromDates(currentValue)
      }

      const paginator = this.childPaginator()
      const table = this.table()
      if (paginator && table) {
        paginator.formArray.set(this.formArray)
        paginator.table.set(table)
        paginator.gotoLastPage()
      }

      this.childFormStatus.set(this.formArray.invalid)

      this.formArray.controls.forEach((control) => {
        this.FormFieldsServ.trackDateChanges(control as FormGroup, this.destroy$, this.restrictUpdating)
      })

      this.formArray.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.childFormStatus.set(this.formArray.invalid)
        })
    }
  }


  protected addRow() {
    const uniqueID = this.FormUtils.generateID()
    // Create a new FormGroup for the row
    const newRow = this.EmptyFormServ.initEmptyDateForm(uniqueID)
    // Add the new row to the FormArray
    this.formArray.push(newRow)
    this.FormFieldsServ.trackDateChanges(newRow, this.destroy$, this.restrictUpdating)
    // Update pagination after adding a row
    this.childPaginator().gotoLastPage()

    this.isExtendButtonDisabled = false
    this.childFormStatus.set(this.formArray.invalid)
    this.lengthNotZero.set(this.formArray.controls.length == 0)

    return newRow
  }


  protected deleteRow(rowId: string): void {
    const rowIndex = this.formArray.controls.findIndex(
      (control) => control.get('id')?.value === rowId)

    if (rowIndex === -1) return

    const row = this.formArray.at(rowIndex) as FormGroup
    row.patchValue({deleted: true})
    row.disable()

    setTimeout(() => {
      if (row.get('status')?.value === 'new') {
        this.formArray.removeAt(rowIndex)
      }
      this.childPaginator().updatePaginatedData()
      this.childFormStatus.set(this.formArray.invalid)
      this.restrictUpdating.set(true)
      this.lengthNotZero.set(this.formArray.controls
        .filter(control => control.get('deleted')?.value !== true).length == 0
      )
    }, 400)
  }


  public emitFormData(): void {
    const formData = this.FormUtils.processFormData(this.formArray)
    this.childFormDataPush.emit(formData)
  }


  protected asFormGroup(row: AbstractControl): FormGroup {
    return row as FormGroup
  }

  protected onExtendClick(): void {
    this.FormUtils.updateOldAndNEwRowsNoTrack(this.formArray)

    this.isExtendButtonDisabled = true
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
