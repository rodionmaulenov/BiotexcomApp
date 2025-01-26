import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ElementRef,
  inject,
  OnDestroy,
  OnInit, Renderer2,
  signal, viewChild,
} from '@angular/core';
import {ProfileCardComponent} from '../../common-ui/profile-card/profile-card.component';
import {ProfileService} from '../../data/services/profile.service';
import {notInProgramProfile, PaginationDetails, Profile, ProfileUzb} from '../../data/interfaces/profile.interface';
import {DaysLeftMap} from '../../data/interfaces/profile.interface';
import {NgClass, NgForOf} from '@angular/common';
import {PageEvent} from '@angular/material/paginator';
import {PaginatorComponent} from '../../common-ui/paginator/paginator.component';
import {ProfileFiltersComponent} from './profile-filters/profile-filters.component';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UzbProfileCardComponent} from '../../common-ui/profile-card/uzb-profile-card/uzb-profile-card.component';
import {
  NotInProgramProfileCardComponent
} from '../../common-ui/profile-card/not-in-program-profile-card/not-in-program-profile-card.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-delay-countries-page',
  standalone: true,
  imports: [
    ProfileCardComponent, NgForOf, PaginatorComponent, ProfileFiltersComponent, NgClass, UzbProfileCardComponent,
    NotInProgramProfileCardComponent, MatProgressSpinnerModule
  ],
  templateUrl: './delay-countries-page.component.html',
  styleUrl: './delay-countries-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DelayCountriesPageComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly profileService: ProfileService = inject(ProfileService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly renderer = inject(Renderer2)
  private readonly destroy$ = new Subject<void>()
  uzbProfiles: ProfileUzb[] = []
  notInProgramProfiles: notInProgramProfile[] = []
  nonUzbProfiles: Profile[] = []
  daysLeftMap: DaysLeftMap = {}
  ukrDaysLeft: DaysLeftMap = {}
  mldDaysLeft: DaysLeftMap = {}
  paginatorIsNotVisible = false
  searchForm = new FormGroup({
    fullName: new FormControl('')
  })
  country = ''
  pageIndex = 0
  pageSize = 5
  pagination: PaginationDetails = {count: 0, next: null, previous: null}

  responseProfiles = signal(true)
  profileCardWrapper = viewChild<ElementRef>('profileCardWrapper')

  // add class for scrolling
  ngAfterViewChecked(): void {
    const profileCardWrapper = this.profileCardWrapper()
    if (profileCardWrapper) {
      this.renderer.addClass(profileCardWrapper.nativeElement, 'scrollable')
    }
  }


  trackByProfileUzbId(index: number, profile: ProfileUzb): number {
    return profile.id
  }

  trackByProfileId(index: number, profile: Profile): number {
    return profile.id
  }

  trackByNotInProgramProfileId(index: number, profile: notInProgramProfile): number {
    return profile.id
  }

  isProfileUzb(profile: Profile | ProfileUzb | notInProgramProfile): profile is ProfileUzb {
    return 'day_stayed' in profile
  }

  isNotInProgramProfile(profile: Profile | ProfileUzb | notInProgramProfile): profile is notInProgramProfile {
    return !('days_passed' in profile || 'day_stayed' in profile)
  }

  ngOnInit() {
    this.initSubscriptions()
    this.loadProfilesFromQueryParams()
  }


  initSubscriptions() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((queryParams) => {
        const countryFromQuery = queryParams['country']
        if (countryFromQuery) {
          this.country = countryFromQuery
        } else {
          console.warn('No country found in query params')
        }
      })

    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({fullName}) => {
        if (fullName) {
          this.searchProfiles(fullName)
        } else {
          this.loadProfiles(this.pageIndex + 1, this.pageSize)
        }
        this.cdr.markForCheck()
      })
  }

  loadProfilesFromQueryParams() {
    this.route.queryParams.pipe(
      takeUntil(this.destroy$),
    ).subscribe(params => {
      this.pageIndex = +params['page'] - 1 || 0
      this.pageSize = +params['pageSize'] || 5
      this.loadProfiles(this.pageIndex + 1, this.pageSize)
      this.cdr.markForCheck()
    })
  }


  loadProfiles(page: number, pageSize: number) {
    this.profileService.getProfileListMLDorUKR(this.country, page, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.pagination = response.pagination
        this.processProfiles(response.profiles)
        this.cdr.markForCheck()
      })
  }

  searchProfiles(query: string) {
    this.profileService.searchProfiles(this.country, query)
      .pipe(takeUntil(this.destroy$))
      .subscribe(profiles => {
        this.processProfiles(profiles)
        this.cdr.markForCheck()
      })
  }

  processProfiles(profiles: (Profile | ProfileUzb | notInProgramProfile)[]) {
    this.uzbProfiles = profiles.filter(this.isProfileUzb) as ProfileUzb[]
    this.notInProgramProfiles = profiles.filter(this.isNotInProgramProfile) as notInProgramProfile[]
    this.nonUzbProfiles = profiles.filter(profile =>
      !this.isProfileUzb(profile) && !this.isNotInProgramProfile(profile)
    ) as Profile[]
    this.responseProfiles.set(false)
  }


  getDaysLeft(profileId: number, type?: string): number {
    if (type === 'UKR') {
      return this.ukrDaysLeft[profileId]?.days_left ?? 0
    } else if (type === 'MLD') {
      return this.mldDaysLeft[profileId]?.days_left ?? 0
    } else {
      return this.daysLeftMap[profileId]?.days_left ?? 0
    }
  }

  onDateChange(date: string, profileId: number, type?: string): void {
    this.profileService.getControlDate(profileId, date, type)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        const updatedDaysLeft = response.days_left

        if (type === 'UKR') {
          this.ukrDaysLeft[profileId] = {days_left: updatedDaysLeft}
        } else if (type === 'MLD') {
          this.mldDaysLeft[profileId] = {days_left: updatedDaysLeft}
        } else {
          this.daysLeftMap[profileId] = {days_left: updatedDaysLeft}
        }

        this.cdr.detectChanges()
      });
  }

  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1
    const pageSize = event.pageSize

    // Update query parameters in the URL
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: page,
        pageSize: pageSize,
        country: this.country,
      },
      queryParamsHandling: 'merge',
    })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()

    // remove class for scrolling
    const profileCardWrapper = this.profileCardWrapper()
    if (profileCardWrapper) {
      this.renderer.removeClass(profileCardWrapper.nativeElement, 'scrollable')
    }
  }
}
