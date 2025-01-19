import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {AvatarUploadComponent} from "../create-profile-page/avatar-upload/avatar-upload.component";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FetchDate, FetchProfile} from './data/represent_data/profile.represent';
import {ProfileFormService} from './data/services/load-form.service';
import {ChangeProfileService} from './data/services/backend_request/change.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {DatesChangeTableComponent} from './dates-change-table/dates-change-table.component';
import {SubmitData} from './dates-change-table/data/interfaces/submit-data.interface';
import {ProfileService} from '../../data/services/profile.service';
import {CreateProfileService} from '../../data/services/create-profile.service';
import {ChangeProfileINT} from './data/interfaces/submit.interface';
import {Subject, takeUntil} from 'rxjs';
import {Location} from '@angular/common';
import {MatFabButton} from '@angular/material/button';
import {animate, style, transition, trigger} from '@angular/animations';
import {MatFormField} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {FocusInteractionDirective} from '../../common-ui/directives/app-focus-interaction.directive';


const countries = {
  'UKR': 'ukraine',
  'MLD': 'moldova',
  'UZB': 'uzbekistan',
  'NIP': 'notInProgram',
}

const countries_for_dates = {
  'UKR': 'ukraine',
  'MLD': 'moldova',
  'UZB': 'uzbekistan',

}


@Component({
  selector: 'app-change-profile-page',
  standalone: true,
  imports: [
    AvatarUploadComponent, FormsModule, ReactiveFormsModule, NgIf, MatIconModule,
    DatesChangeTableComponent, MatFabButton, MatFormField, MatOption, MatSelect, MatInputModule, FocusInteractionDirective
  ],
  templateUrl: './change-profile-page.component.html',
  styleUrl: './change-profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeProfilePageComponent implements OnInit, OnDestroy {
  private readonly location = inject(Location)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly FormService = inject(ProfileFormService)
  private readonly RequestProfiles = inject(ChangeProfileService)
  private readonly profileService = inject(ProfileService)
  private readonly createProfileService = inject(CreateProfileService)
  protected childFormStatus = false
  protected lengthNotZero = false
  form!: FormGroup
  relatedDates!: FetchDate[] | []
  updatedDates: SubmitData[] = []
  destroy$ = new Subject<void>()

  @ViewChild(DatesChangeTableComponent) datesChangeTableComponent!: DatesChangeTableComponent


  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('profileId')
    if (profileId) {
      this.RequestProfiles.getProfileData(profileId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: FetchProfile) => {
          const profileData = new FetchProfile(data)
          this.form = this.FormService.createProfileForm(profileData)
          this.relatedDates = profileData.relatedDates || []
          this.cdr.detectChanges()
        })
    }
  }

  parentFillAvatarField(newAvatar: string) {
    this.form.get('file')!.setValue(newAvatar)
  }

  fileUrl(): string {
    return this.form?.get('file')?.value || ''
  }

  onChildFormDataChange(data: SubmitData[]): void {
    this.updatedDates = data
  }

  onSubmit(): void {
    if (this.form.invalid) return
    this.datesChangeTableComponent.emitFormData()
    this.form.markAllAsTouched()
    const formValue: ChangeProfileINT = {...this.form.value, datesTable: this.updatedDates}
    formValue.country = this.mapCountryAlias(formValue.country, countries)
    const latestDate = this.getLatestDate(this.updatedDates as SubmitData[])

    this.createProfileService.updateProfile(formValue.id, formValue).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.profileService.clearCache()
        latestDate.country = this.mapCountryAlias(latestDate.country, countries_for_dates)

        const shouldRedirect = latestDate.country !== this.route.snapshot.queryParams['country']
          || formValue.country === 'notInProgram'

        this.handleNavigation(shouldRedirect, formValue.country, latestDate.country)
      },
      error: (err: Error) => {
        console.error('Error updating profile:', err)
        // Optionally handle the error (e.g., show a notification)
      },
    })
  }

  private getLatestDate(dates: SubmitData[]): SubmitData {
    const filteredDates = dates.filter(date => !date.deleted)
    return filteredDates.reduce((latest: SubmitData, current: SubmitData) => {
      const latestExit = new Date(latest.exit).getTime()
      const currentExit = new Date(current.exit).getTime()
      const latestEntry = new Date(latest.entry).getTime()
      const currentEntry = new Date(current.entry).getTime()
      const latestCreated = new Date(latest.created).getTime()
      const currentCreated = new Date(current.created).getTime()

      if (currentExit > latestExit) return current
      if (currentExit === latestExit && currentEntry > latestEntry) return current
      if (currentExit === latestExit && currentEntry === latestEntry) {
        return currentCreated > latestCreated ? current : latest
      }

      return latest
    })
  }

  private mapCountryAlias(country: string, aliases: { [key: string]: string }): string {
    return aliases[country] || country
  }

  private handleNavigation(shouldRedirect: boolean, formCountry: string, latestCountry: string): void {
    if (shouldRedirect) {
      this.router.navigate(['/delay'], {
        queryParams: {
          country: formCountry === 'notInProgram' ? formCountry : latestCountry
        }
      })
    } else {
      this.location.back()
    }
  }


  returnBack() {
    this.location.back()
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
