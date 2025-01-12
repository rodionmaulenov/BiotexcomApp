import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  OnDestroy,
  OnInit, signal
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {debounceTime, distinctUntilChanged, map, Subject, switchMap, takeUntil} from 'rxjs';
import {CreateProfileService} from '../../data/services/create-profile.service';
import {ProfileNameCountry, ProfileNameCountryResults} from '../../data/interfaces/profile.interface';
import {NgForOf} from '@angular/common';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';


@Component({
  selector: 'app-profile-search-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, NgForOf, MatFormField, MatInput],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProfileSearchListComponent),
      multi: true,
    },
  ],
  templateUrl: './profile-search-list.component.html',
  styleUrl: './profile-search-list.component.scss'
})
export class ProfileSearchListComponent implements OnInit, OnDestroy, ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly createProfileService = inject(CreateProfileService)
  protected control = new FormControl('')
  protected profileNames: ProfileNameCountry[] = []
  private readonly destroy$ = new Subject<void>()
  selectedCountry = signal<string>('')
  onChange: (value: string | null) => void = () => {
  }
  onTouched: () => void = () => {
  }

  private countries = {
    'UKR': 'ukraine',
    'MLD': 'moldova',
    'UZB': 'uzbekistan'
  }


  ngOnInit() {
    this.loadLastFiveProfiles()

    this.control.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((value: string | null) => {
          if (value && value.trim() !== '') {
            return this.createProfileService.getProfilesByName(value).pipe(
              map((profileResults: ProfileNameCountryResults) => profileResults.results),
              takeUntil(this.destroy$),
            )
          } else {
            return this.createProfileService.lastCreatedProfiles(5).pipe(
              map((profileResults: ProfileNameCountryResults) => profileResults.results),
              takeUntil(this.destroy$),
            )
          }
        }),
        takeUntil(this.destroy$)
      ).subscribe((profiles: ProfileNameCountry[]) => {
      this.profileNames = profiles
      const selectedFullName = this.control.value
      const selectedProfile = profiles.find(profile => profile.full_name === selectedFullName)
      if (selectedProfile) {
        this.selectedCountry.set(this.countries[selectedProfile.country as keyof typeof this.countries])
      }
      this.onChange(this.control.value)
      this.cdr.markForCheck()
    })
  }


  private loadLastFiveProfiles() {
    this.createProfileService.lastCreatedProfiles(5)
      .pipe(takeUntil(this.destroy$))
      .subscribe((profileResults: ProfileNameCountryResults) => {
        this.profileNames = profileResults.results
        this.cdr.markForCheck()
      })
  }

  writeValue(value: string | null): void {
    this.control.setValue(value, {emitEvent: false});
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  trackByProfileName(index: number, profileName: ProfileNameCountry): string {
    return profileName.full_name
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
