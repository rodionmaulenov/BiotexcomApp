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


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ MatProgressBar, NgIf, SideBarComponent, MatButton, MatIcon, MatToolbar,],
  template: `
    <!-- 🛠️ Progress Bar: Visible during navigation & initial load -->
    <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

    <!-- 🛠️ Toolbar -->
    <mat-toolbar>
      <button mat-button (click)="toggleOpenCloseMenu()">
        <div class="icon-text">
          <mat-icon>{{ sidebarState.drawer()?.opened ? 'close' : 'menu' }}</mat-icon>
          <span class="text">Меню</span>
        </div>
      </button>
    </mat-toolbar>

    <!-- 🛠️ Sidebar -->
    <app-side-bar></app-side-bar>
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
