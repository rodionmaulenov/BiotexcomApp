import {
  ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, viewChild
} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {AvatarUploadComponent} from './avatar-upload/avatar-upload.component';
import {DatesTableComponent} from './dates-table/dates-table.component';
import {MatFabButton} from '@angular/material/button';
import {ProfileSearchListComponent} from '../../common-ui/profile-search-list/profile-search-list.component';
import {MainLogicService} from './data/services/main-logic.service';
import {NgIf} from '@angular/common';
import {FocusInteractionDirective} from '../../common-ui/directives/app-focus-interaction.directive';


@Component({
  selector: 'app-create-profile-page',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule, AvatarUploadComponent, DatesTableComponent,
    MatFabButton, ProfileSearchListComponent, NgIf, FocusInteractionDirective
  ],
  templateUrl: './create-profile-page.component.html',
  styleUrl: './create-profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProfilePageComponent implements OnDestroy, OnInit {
  private readonly MainLogicServ = inject(MainLogicService)
  private readonly destroy$ = new Subject<void>()

  protected dateFormStatus = true
  protected fullNameIsPassed = false
  protected form = new FormGroup({
    full_name: new FormControl<string | null>(null, Validators.required),
    country: new FormControl<string | null>(null),
    profileName: new FormControl<string | null>(null),
    avatar: new FormControl<string | null>(null),
  })

  dateComponent = viewChild.required(DatesTableComponent)
  avatarComponent = viewChild.required(AvatarUploadComponent)
  searchListComponent = viewChild.required(ProfileSearchListComponent)


  ngOnInit(): void {
    this.form.get('profileName')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.fullNameIsPassed = !!value
      })
  }


  protected parentFillAvatarField(newAvatar: string) {
    this.form.get('avatar')!.setValue(newAvatar)
  }


  protected onSubmit(): void {
    if (this.fullNameIsPassed) {
      this.MainLogicServ.handleSubmitForm(this.dateComponent(), this.form, false, this.searchListComponent())
    }
    this.MainLogicServ.handleSubmitForm(this.dateComponent(), this.form, false)
  }


  protected onSubmitAndProceed(): void {
    if (this.fullNameIsPassed) {
      this.MainLogicServ.handleSubmitForm(this.dateComponent(), this.form, true, this.searchListComponent())
      this.avatarComponent().resetAvatar()
    }
    this.MainLogicServ.handleSubmitForm(this.dateComponent(), this.form, true)
    this.avatarComponent().resetAvatar()
  }


  ngOnDestroy(): void {
    this.MainLogicServ.cleanup()
    this.destroy$.next()
    this.destroy$.complete()
  }

}
