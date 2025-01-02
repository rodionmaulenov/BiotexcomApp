import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';


@Injectable({providedIn: 'root'})
export class DateChangeTrackingService {
  /**
   * Tracks changes on 'entry' and 'exit' form controls and updates 'days_left'.
   * @param row - FormGroup representing a row.
   * @param destroy$ - Subject to handle unsubscription when the component is destroyed.
   */
  public trackDateChanges(row: FormGroup, destroy$: Subject<void>): void {
    const entryControl = row.get('entry')
    const exitControl = row.get('exit')

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
