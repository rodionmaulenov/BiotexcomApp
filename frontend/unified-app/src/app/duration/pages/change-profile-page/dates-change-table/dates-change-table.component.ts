import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {CUSTOM_DATE_FORMATS, CustomDateAdapter} from '../../../data/rus_datepicker/rus-datepicker';
import {DateChangeTrackingService} from './date-change-tracking.service';
import {FormArrayUtilityService} from './form-array-utility.service';
import {PaginatorComponent} from '../paginator/paginator.component';
import {russianPaginatorIntl} from '../paginator/paginator-rus.service';
import {fadeOut} from '../../../data/animations/delete-animations';
import {DatePickerFieldDirective} from '../../../common-ui/directives/date-picker-field.directive';
import {crossRowDateValidator, entryExitDateValidator} from '../../create-profile-page/dates-table/validators';
import {NgIf} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


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
  imports: [
    MatTableModule, MatPaginatorModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatSlideToggleModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, PaginatorComponent, DatePickerFieldDirective, NgIf,
    MatProgressSpinnerModule
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MatPaginatorIntl, useValue: russianPaginatorIntl()},
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
  ],
  templateUrl: './dates-change-table.component.html',
  styleUrl: './dates-change-table.component.scss',
  animations: [fadeOut]
})
export class DatesChangeTableComponent implements OnDestroy, OnChanges {
  private readonly FilledFormServ = inject(DateFormService)
  private readonly EmptyFormServ = inject(DateEmptyControlService)
  private readonly FormFieldsServ = inject(DateChangeTrackingService)
  protected readonly FormUtils = inject(FormArrayUtilityService)
  protected readonly cdr = inject(ChangeDetectorRef)
  private readonly destroy$ = new Subject<void>()
  protected readonly displayedColumns: string[] = ['entry', 'exit', 'country', 'disable', 'days_left', 'delete']
  protected formArray = new FormArray<FormGroup>([])
  protected isExtendButtonDisabled: boolean = false
  protected deletedRows = new Set<string>()
  protected restrictUpdating = signal<boolean>(true)

  childFormStatus = model<boolean>()
  lengthNotZero = model<boolean>()
  formInputData = input<FetchDate[] | []>([])
  @Output() childFormDataPush = new EventEmitter<SubmitData[]>()
  childPaginator = viewChild.required(PaginatorComponent)
  table = viewChild<MatTable<TableFields>>('table')

  ngOnChanges({formInputData}: SimpleChanges): void {
    if (formInputData && !formInputData.firstChange) {
      const {currentValue} = formInputData
      this.formArray = this.FilledFormServ.createFormArrayFromDates(currentValue)
      this.reapplyValidators()
      this.childFormStatus.set(this.formArray.invalid)

      // Ensure paginator and table are initialized after Angular renders them
      setTimeout(() => {
        const paginator = this.childPaginator()
        const table = this.table()
        if (paginator && table) {
          paginator.formArray.set(this.formArray)
          paginator.table.set(table)
          paginator.gotoLastPage()
        }
        this.formArray.controls.forEach((control) => {
          this.FormFieldsServ.trackDateChanges(control as FormGroup, this.destroy$, this.restrictUpdating)
        })
        this.cdr.markForCheck()
      })

      this.formArray.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.reapplyValidators()
          this.childFormStatus.set(this.formArray.invalid)
        })
    }

  }


  protected addRow() {
    const uniqueID = this.FormUtils.generateID()
    const previousRow = this.formArray.length > 0 ? this.formArray.at(this.formArray.length - 1) as FormGroup : null

    // Create a new FormGroup for the row
    const newRow = this.EmptyFormServ.initEmptyDateForm(uniqueID, previousRow)
    // Add the new row to the FormArray
    this.formArray.push(newRow)
    this.reapplyValidators()
    this.FormFieldsServ.trackDateChanges(newRow, this.destroy$, this.restrictUpdating)
    // Update pagination after adding a row
    const paginator = this.childPaginator()
    if (paginator) {
      paginator.gotoLastPage()
    }
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

    this.deletedRows.add(rowId)

    setTimeout(() => {
      if (row.get('status')?.value === 'new') {
        this.formArray.removeAt(rowIndex)
      }
      const paginator = this.childPaginator()
      if (paginator) {
        paginator.updatePaginatedData()
      }
      this.childFormStatus.set(this.formArray.invalid)
      this.restrictUpdating.set(true)
      this.reapplyValidators()
      this.lengthNotZero.set(this.formArray.controls
        .filter(control => control.get('deleted')?.value !== true).length == 0
      )
    }, 100)
  }

  private reapplyValidators(): void {
    this.formArray.controls.forEach((control, index) => {
      const previousRow = index > 0 ? this.formArray.at(index - 1) : null
      control.setValidators([
        entryExitDateValidator(),
        crossRowDateValidator(previousRow as FormGroup),
      ])
      control.updateValueAndValidity({emitEvent: false})
    })
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
