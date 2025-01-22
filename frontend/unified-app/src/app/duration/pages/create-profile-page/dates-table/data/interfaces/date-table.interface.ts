import {FormControl} from '@angular/forms';

export interface DateEntryForm {
  entry: FormControl<Date | null>
  exit: FormControl<Date | null>
  country: FormControl<string | null>
  disable: FormControl<boolean>
  deleted: FormControl<boolean>
  created: FormControl<string>
}

export interface SubmitDateForm {
  entry: Date
  exit: Date
  country: string
  disable: boolean
  created: string
}
