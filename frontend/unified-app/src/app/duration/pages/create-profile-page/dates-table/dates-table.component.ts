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
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter
} from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {DateTableService} from './data/services/date-table.service';
import {DateEntryForm, SubmitDateForm} from './data/interfaces/date-table.interface';
import {DateControlService} from './data/services/date-empty-form.service';
import {Subject, takeUntil} from 'rxjs';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {TableFields} from '../../change-profile-page/dates-change-table/dates-change-table.component';
import {DatePickerFieldDirective} from '../../../common-ui/directives/date-picker-field.directive';
import {NgClass, NgIf} from '@angular/common';
import {CUSTOM_DATE_FORMATS, CustomDateAdapter} from '../../../data/rus_datepicker/rus-datepicker';
import {fadeOut} from './animations';


@Component({
  selector: 'app-dates-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MatPaginatorModule, FormsModule, MatDatepickerModule,
    MatNativeDateModule, MatSelectModule, MatSlideToggleModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, DatePickerFieldDirective, NgClass, NgIf
  ],
  templateUrl: './dates-table.component.html',
  styleUrl: './dates-table.component.scss',
  animations: [fadeOut],
  providers: [
    provideNativeDateAdapter(), DateControlService, DateTableService,
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
  ]
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
    this.formArray.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    }, 200)
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





