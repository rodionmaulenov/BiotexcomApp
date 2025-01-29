import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {format} from 'date-fns';


@Injectable({providedIn: 'root'})
export class DateEmptyControlService {
  public initEmptyDateForm(id: number): FormGroup {
    return new FormGroup({
      id: new FormControl<number>(id, { nonNullable: true }),
      entry: new FormControl<string | null>(null, Validators.required),
      exit: new FormControl<string | null>(null, Validators.required),
      country: new FormControl<string | null>(null, Validators.required),
      disable: new FormControl<boolean>(false, { nonNullable: true }),
      deleted: new FormControl<boolean>(false, { nonNullable: true }),
      days_left: new FormControl<number | string>('_'),
      no_track: new FormControl<boolean>(false),
      status: new FormControl<string>('new', { nonNullable: true }),
      updated: new FormControl<boolean>(false, { nonNullable: true }),
      created: new FormControl<string>(format(new Date(), 'yyyy-MM-dd HH:mm:ss'), { nonNullable: true })
    })
  }
}
