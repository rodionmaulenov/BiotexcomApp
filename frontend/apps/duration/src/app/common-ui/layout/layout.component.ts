import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy} from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {MatProgressBar} from '@angular/material/progress-bar';
import {NgIf} from '@angular/common';
import {Subject, takeUntil, timer} from 'rxjs';
import {SideBarComponent} from '../side-bar/side-bar.component';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {SidebarStateService} from '../side-bar/state.service';
import {DatesTable2Component} from '../../pages/create-profile-page/dates-table/dates-table2/dates-table2.component';

// MatProgressBar, NgIf, SideBarComponent, MatButton, MatIcon, MatToolbar,
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ DatesTable2Component],
  template: `
<!--    &lt;!&ndash; 🛠️ Progress Bar: Visible during navigation & initial load &ndash;&gt;-->
<!--    <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>-->

<!--    &lt;!&ndash; 🛠️ Toolbar &ndash;&gt;-->
<!--    <mat-toolbar>-->
<!--      <button mat-button (click)="toggleOpenCloseMenu()">-->
<!--        <div class="icon-text">-->
<!--          <mat-icon>{{ sidebarState.drawer()?.opened ? 'close' : 'menu' }}</mat-icon>-->
<!--          <span>Меню</span>-->
<!--        </div>-->
<!--      </button>-->
<!--    </mat-toolbar>-->

<!--    &lt;!&ndash; 🛠️ Sidebar &ndash;&gt;-->
<!--    <app-side-bar></app-side-bar>-->
<app-dates-table2></app-dates-table2>
  `,
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnDestroy {
  protected readonly sidebarState = inject(SidebarStateService)
  protected readonly cdr = inject(ChangeDetectorRef)
  protected isLoading = false
  private loadingTimeout: any
  private destroy$ = new Subject<void>()


  constructor(private router: Router) {
    this.router.events.pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.showProgressBar()
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.hideProgressBarWithDelay()
        }
      });
  }

  protected toggleOpenCloseMenu(): void {
    const drawer = this.sidebarState.drawer()
    const expansionPanel = this.sidebarState.expansionPanel()
    if (drawer) {
      drawer.toggle()
    }
    if (!drawer?.opened) {
      expansionPanel?.close()
    }
  }

  private showProgressBar() {
    clearTimeout(this.loadingTimeout)
    this.isLoading = true
  }

  private hideProgressBarWithDelay() {
    timer(800).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isLoading = false
        this.cdr.markForCheck()
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
