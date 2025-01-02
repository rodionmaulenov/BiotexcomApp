import {Injectable} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {SubmitData} from './data/interfaces/submit-data.interface';


@Injectable({providedIn: 'root'})
export class FormArrayUtilityService {
  protected readonly countryAliases: { [key: string]: string } = {
    'Украина': 'UKR',
    'Молдова': 'MLD',
    'Узбекистан': 'UZB'
  }


  public processFormData(formArray: FormArray<FormGroup>): SubmitData[] {
    return formArray.controls.map((control) => {
      const formValue = control.value

      const countryAlias = this.countryAliases[formValue.country ?? ''] ?? formValue.country

      return {
        ...formValue,
        country: countryAlias,
        entry: this.toUtcDateString(formValue.entry),
        exit: this.toUtcDateString(formValue.exit),
      } as SubmitData
    })
  }


  public updateOldAndNEwRowsNoTrack(formArray: FormArray<FormGroup>): void {
    /**
     * Updates all rows with status 'old' and 'new' (except the last 'new' row with 'Украина') to set `no_track: true`.
     */
    if (formArray.length === 0) return

    const newUkraineRows = this.filterControlsByCondition(formArray, 'new', 'Украина')
    const lastNewUkraineRow = newUkraineRows.length > 0
      ? this.findControlWithLargestId(new FormArray(newUkraineRows))
      : null

    formArray.controls.forEach((control) => {
      const isOldRowUkraine =
        control.get('status')?.value === 'old' && control.get('country')?.value === 'Украина'

      const isNewRowUkraine =
        control.get('status')?.value === 'new' &&
        control.get('country')?.value === 'Украина' &&
        control !== lastNewUkraineRow

      if (isOldRowUkraine || isNewRowUkraine) {
        control.patchValue({no_track: true})
      }
    })
  }


  public isLastRowValid(formArray: FormArray<FormGroup>): boolean {
    /**
     * Validates if the last row meets the conditions (status: 'new' and country: 'Украина').
     */
    if (formArray.length === 0) {
      return false
    }
    if (formArray.length === 1) {
      return false
    }

    const lastRow = formArray.controls.reduce((largest, current) => {
      const currentId = parseInt(current.get('id')?.value || '0', 10)
      const largestId = parseInt(largest.get('id')?.value || '0', 10)
      return currentId > largestId ? current : largest
    }, formArray.at(0))

    // Check the two previous rows
    const lastIndex = formArray.controls.indexOf(lastRow)
    const previousRows = formArray.controls
      .slice(Math.max(lastIndex - 2, 0), lastIndex)
      .map(row => row.get('country')?.value)

    const consecutiveUkraineRows = previousRows.every(
      country => country === 'Украина'
    )

    // If two previous rows are 'Украина' and the new row is also 'Украина', return false
    if (consecutiveUkraineRows && previousRows.length === 2) {
      return false
    }

    return (
      lastRow?.get('status')?.value === 'new' &&
      lastRow?.get('country')?.value === 'Украина'
    )
  }


  public getControlWithLargestId(formArray: FormArray<FormGroup>): number {
    /**
     * Retrieves the largest ID in the form array.
     */
    if (formArray.length === 0) {
      return 1
    }

    return formArray.controls.reduce((largestId, current) => {
      const currentId = parseInt(current.get('id')?.value || '0', 10)
      return currentId > largestId ? currentId : largestId
    }, 0)
  }


  /**
   * 🛠️ Helper Method: Parse Date to UTC String
   */
  private toUtcDateString(date: string | null): string | null {
    if (!date) return null
    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) return null

    return new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()))
      .toISOString()
      .split('T')[0]
  }

  /**
   * 🛠️ Helper Method: Find Row with Largest ID
   */
  private findControlWithLargestId(formArray: FormArray<FormGroup>): FormGroup | null {

    return formArray.controls.reduce((largest, current) => {
      const currentId = parseInt(current.get('id')?.value || '0', 10)
      const largestId = parseInt(largest.get('id')?.value || '0', 10)
      return currentId > largestId ? current : largest
    }, formArray.at(0))
  }

  /**
   * 🛠️ Helper Method: Filter Controls by Status and Country
   */
  private filterControlsByCondition(
    formArray: FormArray<FormGroup>,
    status: string,
    country: string
  ): FormGroup[] {
    return formArray.controls.filter(
      (control) => control.get('status')?.value === status && control.get('country')?.value === country
    )
  }
}
