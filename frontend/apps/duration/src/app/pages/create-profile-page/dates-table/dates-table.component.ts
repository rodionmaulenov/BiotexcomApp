import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, effect,
  inject, model,
  OnDestroy,
  OnInit,
  signal,
  viewChild, WritableSignal
} from '@angular/core';
import {AbstractControl, FormArray, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {DateTableService} from './data/services/date-table.service';
import {DateEntryForm, SubmitDateForm} from './data/interfaces/date-table.interface';
import {DateControlService} from './data/services/date-empty-form.service';
import {Subject, takeUntil} from 'rxjs';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {TableFields} from '../../change-profile-page/dates-change-table/dates-change-table.component';


@Component({
  selector: 'app-dates-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatPaginatorModule, MatInput, FormsModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatSlideToggleModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule
  ],
  providers: [provideNativeDateAdapter(), DateControlService, DateTableService,],
  template: `
    <div class="wrapper">
      <table #table mat-table [dataSource]="formArray.controls">

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

        <!-- Delete Column -->
        <ng-container matColumnDef="delete">
          <th mat-header-cell *matHeaderCellDef>Удалить</th>
          <td mat-cell *matCellDef="let row; let i = index">
            <ng-container [formGroup]="asFormGroup(row)">
              <button mat-icon-button (click)="deleteRow(row)">
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
            [class.deleted]="row.get('deleted')?.value">
        </tr>
      </table>
    </div>

    <button mat-flat-button
            class="add-button"
            (click)="addRow()"
            [disabled]="dateFormStatus()">
      Добавить
    </button>

  `,
  styleUrl: './dates-table.component.scss',
})
export class DatesTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly EmptyFormServ = inject(DateControlService)
  private readonly MainLogicServ = inject(DateTableService)
  protected readonly displayedColumns: string[] = ['entry', 'exit', 'country', 'disable', 'delete']
  public formArray = new FormArray<FormGroup<DateEntryForm>>([])
  private readonly destroy$ = new Subject<void>()

  dateFormStatus = model<boolean>()
  fullNameIsPassed = model<boolean>(false)
  dateFormData: WritableSignal<SubmitDateForm[]> = signal([])
  table = viewChild.required<MatTable<TableFields>>('table')


  constructor() {
    effect(() => {
      if (this.fullNameIsPassed()) {
        this.formArray.disable()
      }
      if (!this.fullNameIsPassed()) {
        this.formArray.enable()
      }
    })
  }


  ngOnInit(): void {
    this.formArray.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.dateFormStatus.set(this.formArray.invalid)
      })
  }


  ngAfterViewInit(): void {
    this.addRow()
    this.dateFormStatus.set(this.formArray.invalid)
  }


  protected addRow() {
    this.formArray.push(this.EmptyFormServ.createGroup())
    this.dateFormStatus.set(this.formArray.invalid)
    this.table().renderRows()
  }


  protected deleteRow(row: FormGroup): void {
    if (this.formArray.length == 1) return
    const index = this.formArray.controls.indexOf(row)
    row.patchValue({deleted: true})
    setTimeout(() => {
      this.formArray.removeAt(index)
      this.dateFormStatus.set(this.formArray.invalid)
      this.table().renderRows()
    }, 400)
  }

  public emitFormArrayData() {
    const prepareData = this.MainLogicServ.prepareFormData(this.formArray, this.fullNameIsPassed())
    this.dateFormData.set(prepareData)
  }


  protected asFormGroup(row: AbstractControl): FormGroup {
    return row as FormGroup
  }


  ngOnDestroy(): void {
    this.MainLogicServ.destroy()
    this.destroy$.next()
    this.destroy$.complete()
  }
}





