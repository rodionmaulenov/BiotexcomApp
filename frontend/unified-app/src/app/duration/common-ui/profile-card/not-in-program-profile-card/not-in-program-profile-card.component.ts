import {Component, inject, Input} from '@angular/core';
import {notInProgramProfile} from '../../../data/interfaces/profile.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-not-in-program-profile-card',
  standalone: true,
  imports: [NgIf],
  templateUrl: './not-in-program-profile-card.component.html',
  styleUrl: './not-in-program-profile-card.component.scss'
})
export class NotInProgramProfileCardComponent {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  protected readonly defaultAvatar = "/assets/images/avatar.png"

  @Input() profile!: notInProgramProfile
  @Input() country!: null | string


  onSubmit(profile_id: number): void {
    this.router.navigate(['/duration/change-profile', profile_id.toString()], {
      queryParams: {
        country: this.route.snapshot.queryParams['country'],
        page: this.route.snapshot.queryParams['page'],
        pageSize: this.route.snapshot.queryParams['pageSize'],
      },
    })
  }

}
