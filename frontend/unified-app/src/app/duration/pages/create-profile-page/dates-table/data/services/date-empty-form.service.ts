import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateEntryForm} from '../interfaces/date-table.interface';
import {format} from 'date-fns';


@Injectable({providedIn: 'root'})
export class DateControlService {
  createGroup(): FormGroup<DateEntryForm> {
    return new FormGroup<DateEntryForm>({
      entry: new FormControl<Date | null>(null, Validators.required),
      exit: new FormControl<Date | null>(null, Validators.required),
      country: new FormControl<string | null>(null, Validators.required),
      disable: new FormControl<boolean>(false, {nonNullable: true}),
      deleted: new FormControl<boolean>(false, {nonNullable: true}),
      created: new FormControl<string>(format(new Date(), 'yyyy-MM-dd HH:mm:ss'), {nonNullable: true})
    })
  }
}
