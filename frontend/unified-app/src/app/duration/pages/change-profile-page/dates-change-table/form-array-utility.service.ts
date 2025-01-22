import {Injectable} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {SubmitData} from './data/interfaces/submit-data.interface';


@Injectable({providedIn: 'root'})
export class FormArrayUtilityService {
  protected readonly countryAliases: { [key: string]: string } = {
    'UKR': 'ukraine',
    'MLD': 'moldova',
    'UZB': 'uzbekistan'
  }
  protected number = Date.now() % 1000000


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

    const newUkraineRows = this.filterControlsByCondition(formArray, 'new', 'UKR')
    const lastNewUkraineRow = newUkraineRows.length > 0
      ? this.findControlWithLargestId(new FormArray(newUkraineRows))
      : null

    formArray.controls.forEach((control) => {
      const isOldRowUkraine =
        control.get('status')?.value === 'old' && control.get('country')?.value === 'UKR'

      const isNewRowUkraine =
        control.get('status')?.value === 'new' &&
        control.get('country')?.value === 'UKR' &&
        control !== lastNewUkraineRow

      if (isOldRowUkraine || isNewRowUkraine) {
        control.patchValue({no_track: true})
      }
    })
  }


  public generateID(): number {
    return this.number++
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
