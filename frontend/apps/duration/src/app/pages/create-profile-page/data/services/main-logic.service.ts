import {inject, Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {CreateProfileService} from '../../../../data/services/create-profile.service';
import {SubmitDateForm} from '../../dates-table/data/interfaces/date-table.interface';
import {CreateProfileINT} from '../interfaces/create-page.interface';
import {DatesTableComponent} from '../../dates-table/dates-table.component';
import {ProfileSearchListComponent} from '../../../../common-ui/profile-search-list/profile-search-list.component';
import {ProfileService} from '../../../../data/services/profile.service';


@Injectable({providedIn: 'root'})
export class MainLogicService {
  private readonly profileService = inject(ProfileService)
  private readonly router = inject(Router)
  private readonly createProfileService = inject(CreateProfileService)
  private readonly destroy$ = new Subject<void>()


  public handleSubmitForm(
    dateComponent: DatesTableComponent, form: FormGroup, notProceed: boolean, searchList?: ProfileSearchListComponent
  ): Observable<{ country: string }> {
    if (form.invalid) return of({country: ''})
    form.markAllAsTouched()
    dateComponent.emitFormArrayData()
    const dateDate = dateComponent.dateFormData() as SubmitDateForm[] || []
    const formValue: CreateProfileINT = {...form.value, datesTable: dateDate}
    const latestSubmitData = this.latestSubmitFormData(dateDate)
    formValue.country = searchList
      ? searchList.selectedCountry()
      : latestSubmitData.country

    return this.createProfileService.createProfile(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.profileService.clearCache()
          form.reset()
          dateComponent.formArray.reset()
          if (!notProceed) {
            this.router.navigate(['/delay'], {
              queryParams: {
                country: searchList
                  ? searchList.selectedCountry()
                  : latestSubmitData.country,
              },
            })
          }
        },
        error: (err: Error) => console.error('Failed to save profile:', err),
      })
  }

  private latestSubmitFormData(dateData: SubmitDateForm[]): SubmitDateForm {
    return dateData.reduce((latest, current) => {
      const latestMaxDate = Math.max(
        new Date(latest.exit).getTime(),
        new Date(latest.entry).getTime()
      )
      const currentMaxDate = Math.max(
        new Date(current.exit).getTime(),
        new Date(current.entry).getTime()
      )

      if (currentMaxDate > latestMaxDate) {
        return current
      } else if (currentMaxDate === latestMaxDate) {
        return new Date(current.created).getTime() > new Date(latest.created).getTime()
          ? current
          : latest
      } else {
        return latest
      }
    }, dateData[0])
  }


  cleanup(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
