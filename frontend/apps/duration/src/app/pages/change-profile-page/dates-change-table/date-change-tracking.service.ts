import {Injectable, WritableSignal} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';


@Injectable({providedIn: 'root'})
export class DateChangeTrackingService {

  public trackDateChanges(
    row: FormGroup, destroy$: Subject<void>, restrictUpdating: WritableSignal<boolean>
  ): void {
    const entryControl = row.get('entry')
    const exitControl = row.get('exit')
    const status = row.get('status')?.value
    const country = row.get('country')

    if (status && status === 'new' && country) {
      country.valueChanges
        .pipe(takeUntil(destroy$))
        .subscribe((value) => {
          if (value === 'UKR') {
            restrictUpdating.set(false)
          }
        })
    }

    if (entryControl) {
      entryControl.valueChanges
        .pipe(takeUntil(destroy$))
        .subscribe(() => {
          this.updateDaysLeft(row)
        })
    }

    if (exitControl) {
      exitControl.valueChanges
        .pipe(takeUntil(destroy$))
        .subscribe(() => {
          this.updateDaysLeft(row)
        })
    }
  }

  /**
   * Calculates the difference between entry and exit dates and updates 'days_left'.
   * @param row - FormGroup representing a row.
   */
  private updateDaysLeft(row: FormGroup): void {
    const entry = row.get('entry')?.value
    const exit = row.get('exit')?.value

    if (entry && exit) {
      const entryDate = new Date(entry)
      const exitDate = new Date(exit)

      if (!isNaN(entryDate.getTime()) && !isNaN(exitDate.getTime())) {
        const differenceInDays = (exitDate.getTime() - entryDate.getTime()) / (1000 * 3600 * 24)
        const accurateDifference = Math.round(differenceInDays) + 1

        row.get('days_left')?.setValue(accurateDifference)
      } else {
        row.get('days_left')?.setValue('_')
      }
    } else {
      row.get('days_left')?.setValue('_')
    }
  }
}
