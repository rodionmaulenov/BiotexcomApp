import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {DateEntryForm, SubmitDateForm} from '../interfaces/date-table.interface';


@Injectable({providedIn: 'root'})
export class DateTableService {
  private readonly destroy$ = new Subject<void>()


  prepareFormData(formArray: FormArray<FormGroup<DateEntryForm>>, isProfileNameEmpty: boolean): SubmitDateForm[] {
    if (isProfileNameEmpty) {
      return []
    }

    return formArray.controls.map((control: AbstractControl) => {
      const {deleted, entry, exit, ...usefulData} = control.value

      const toUtcDateString = (date: Date) =>

        new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
          .toISOString()
          .split('T')[0]

      return {
        ...usefulData,
        entry: toUtcDateString(entry),
        exit: toUtcDateString(exit),
      } as SubmitDateForm
    })
  }


  destroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
