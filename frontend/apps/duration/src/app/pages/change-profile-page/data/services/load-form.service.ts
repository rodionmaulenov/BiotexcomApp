import {Injectable, OnDestroy} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {FetchProfile} from '../represent_data/profile.represent';
import {Subject, takeUntil} from 'rxjs';


@Injectable({providedIn: 'root',})
export class ProfileFormService implements OnDestroy {
  private destroy$ = new Subject<void>()

  public createProfileForm(profile: FetchProfile): FormGroup {
    const formGroup = new FormGroup({
      id: new FormControl(profile.id, Validators.required),
      full_name: new FormControl(profile.full_name, Validators.required),
      country: new FormControl(profile.country, Validators.required),
      file: new FormControl(profile.file),
      updated: new FormControl(false),
    })

    this.attachUpdateDetection(formGroup)
    return formGroup
  }

  private attachUpdateDetection(formGroup: FormGroup): void {
    const fieldsToWatch = ['full_name', 'country', 'file']

    fieldsToWatch.forEach((field) => {
      const control = formGroup.get(field)
      if (control) {
        control.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            if (!formGroup.get('updated')?.value) {
              formGroup.get('updated')?.setValue(true, {emitEvent: false})
            }
          })
      }
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
