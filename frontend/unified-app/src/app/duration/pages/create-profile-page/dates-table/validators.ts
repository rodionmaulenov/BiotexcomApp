import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

// Validator to ensure exit >= entry
export function entryExitDateValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const entry = group.get('entry')?.value
    const exit = group.get('exit')?.value

    // Normalize both dates to Date objects
    const currentEntry = entry ? new Date(new Date(entry).setHours(0, 0, 0, 0)) : null
    const currentExit = exit ? new Date(new Date(exit).setHours(0, 0, 0, 0)) : null

    if (currentEntry && currentExit?.getTime() && exit < currentEntry.getTime()) {
      return {exitBeforeEntry: true}
    }
    return null
  }
}

export function crossRowDateValidator(previousRow: AbstractControl | null): ValidatorFn {
  return (currentRow: AbstractControl): ValidationErrors | null => {
    if (!previousRow) return null

    const entry = currentRow.get('entry')?.value
    const previousExit = previousRow.get('exit')?.value

    // Normalize both dates to Date objects
    const currentEntryDate = entry ? new Date(new Date(entry).setHours(0, 0, 0, 0)) : null
    const previousExitDate = previousExit ? new Date(new Date(previousExit).setHours(0, 0, 0, 0)) : null

    console.log('currentEntryDate', currentEntryDate)
    console.log('previousExitDate', previousExitDate)

    if (
      currentEntryDate &&
      previousExitDate &&
      currentEntryDate.getTime() < previousExitDate.getTime()
    ) {
      return {entryBeforePreviousExit: true}
    }

    return null
  }
}
