import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {AvatarUploadComponent} from "../create-profile-page/avatar-upload/avatar-upload.component";
import {CountryListComponent} from "../../common-ui/country-list/country-list.component";
import {DatesTableComponent} from "../create-profile-page/dates-table/dates-table.component";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileSearchListComponent} from "../../common-ui/profile-search-list/profile-search-list.component";
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


@Component({
  selector: 'app-change-profile-page',
  standalone: true,
  imports: [
    AvatarUploadComponent, CountryListComponent, FormsModule, ReactiveFormsModule, NgIf, DatesChangeTableComponent, MatFabButton
  ],
  templateUrl: './change-profile-page.component.html',
  styleUrl: './change-profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tableFadeIn', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(0)'}),
        animate('100ms ease-in-out', style({opacity: 1, transform: 'translateY(0)'}))
      ])
    ])
  ]
})
export class ChangeProfilePageComponent implements OnInit, OnDestroy {
  protected childFormStatus = false
  form!: FormGroup
  relatedDates!: FetchDate[] | []
  updatedDates: SubmitData[] | [] = []
  location = inject(Location)
  router = inject(Router)
  route = inject(ActivatedRoute)
  cdr = inject(ChangeDetectorRef)
  profileService = inject(ProfileService)
  createProfileService = inject(CreateProfileService)
  destroy$ = new Subject<void>()
  @ViewChild(DatesChangeTableComponent) datesChangeTableComponent!: DatesChangeTableComponent


  constructor(private profileFormService: ProfileFormService,
              private changeProfileService: ChangeProfileService,) {
  }

  ngOnInit(): void {
    const profileId = this.route.snapshot.paramMap.get('profileId')
    if (profileId) {
      this.changeProfileService.getProfileData(profileId).pipe(takeUntil(this.destroy$))
        .subscribe((data: FetchProfile) => {
          const profileData = new FetchProfile(data)
          this.form = this.profileFormService.createProfileForm(profileData)
          this.relatedDates = profileData.relatedDates || []
          this.cdr.detectChanges()
        });
    }
  }

  parentFillAvatarField(newAvatar: string) {
    this.form.get('file')!.setValue(newAvatar)
  }

  fileUrl(): string {
    return this.form?.get('file')?.value || ''
  }

  onChildFormDataChange(data: SubmitData[] | []): void {
    this.updatedDates = data
  }

  onSubmit(clearCache: boolean = true): void {
    const currentCountryFromURL = this.route.snapshot.queryParams['country']
    this.datesChangeTableComponent.emitFormData()
    console.log(this.updatedDates)
    this.form.markAllAsTouched()
    if (this.form.invalid) return
    const formValue: ChangeProfileINT = {...this.form.value, datesTable: this.updatedDates}
    const countryAliasesForURL: { [key: string]: string } = {
      'Украина': 'ukraine',
      'Молдова': 'moldova',
      'Узбекистан': 'uzbekistan',
      'Не в программе': 'notInProgram',
    };
    formValue.country = countryAliasesForURL[formValue.country]
    this.createProfileService.updateProfile(formValue.id, formValue).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        if (clearCache) {
          this.profileService.clearCache()
        }
        if (formValue.country !== currentCountryFromURL) {
          this.router.navigate(['/delay'], {
            queryParams: {country: formValue.country}
          });
        } else {
          this.router.navigate(['/delay'], {
            queryParams: {
              country: formValue.country,
            },
            queryParamsHandling: "merge"
          });
        }
      },
      error: (err: Error) => {
        console.error('Error updating profile:', err);
        // Optionally handle the error (e.g., show a notification)
      },
    });
  }

  returnBack() {
    this.onSubmit(false)
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
