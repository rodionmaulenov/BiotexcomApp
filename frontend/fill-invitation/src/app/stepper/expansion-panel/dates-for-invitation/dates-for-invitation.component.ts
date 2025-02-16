import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateStore } from './store';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
}

@Component({
  selector: 'dates-for-invitation',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [provideMomentDateAdapter(MY_FORMATS)],
  templateUrl: './dates-for-invitation.component.html',
  styleUrl: './dates-for-invitation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatesForInvitationComponent implements OnInit {
  private readonly _dateStore = inject(DateStore)
  private readonly $destroy = new Subject<void>()
  protected number = new FormControl()
  protected numberDate = new FormControl(moment())
  protected startDate = new FormControl()
  protected endDate = new FormControl()

  constructor() {
    moment.locale('ru')
  }

  ngOnInit() {
    this.numberDate.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(date => {
      if (date) this._dateStore.setDate('numberDate', date.toDate())
    })

    this.startDate.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(date => {
      if (date) this._dateStore.setDate('startDate', date)
    })

    this.endDate.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(date => {
      if (date) this._dateStore.setDate('endDate', date)
    })
  }

  ngDestroy(): void {
    this.$destroy.next()
    this.$destroy.complete()
  }
}
