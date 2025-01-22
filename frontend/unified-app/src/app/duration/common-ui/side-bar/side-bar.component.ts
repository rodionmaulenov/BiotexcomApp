import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, model, OnInit, Renderer2, viewChild
} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {Router} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {NgClass, NgIf} from '@angular/common';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatExpansionModule,
    MatListModule, MatToolbarModule, MatIconModule, MatGridListModule, NgClass, NgIf
  ],
  template: `
    <div *ngIf="isInitialized" class="sidebar-wrapper" [ngClass]="{'open': isOpen()}">
      <div class="sidebar">
        <div class="sidebar__inner">
          <mat-accordion>
            <mat-expansion-panel #expansionPanel="matExpansionPanel" hideToggle>
              <mat-expansion-panel-header>
                <mat-panel-title>Сроки</mat-panel-title>
              </mat-expansion-panel-header>
              <button mat-button class="menu-button" (click)="navigateTo('ukraine')">Украина</button>
              <button mat-button class="menu-button" (click)="navigateTo('moldova')">Молдова</button>
              <button mat-button class="menu-button" (click)="navigateTo('uzbekistan')">Узбекистан</button>
              <button mat-button class="menu-button" (click)="navigateTo('notInProgram')">Выбыли из программы</button>
              <button mat-button class="menu-button" (click)="createProfile()">
                <div class="icon-text">
                  <mat-icon>person_add</mat-icon>
                  <span class="text">Добавить запись</span>
                </div>
              </button>
            </mat-expansion-panel>
          </mat-accordion>
        </div>
      </div>
      <div class="overlay" (click)="toggleSideBar()"></div>
    </div>

  `,
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent implements OnInit {
  public isOpen = model<boolean>(false)
  public expansionPanel = viewChild.required<MatExpansionPanel>('expansionPanel')
  protected isInitialized = false
  private readonly router = inject(Router)
  private readonly cdr = inject(ChangeDetectorRef)
  private readonly renderer = inject(Renderer2)

  ngOnInit() {
    setTimeout(() => {
      this.isInitialized = true
      this.cdr.markForCheck()
    }, 100)
  }

  toggleSideBar() {
    this.isOpen.set(!this.isOpen())

    if (this.isOpen()) {
      this.renderer.addClass(document.body, 'no-scroll')
    } else {
      this.renderer.removeClass(document.body, 'no-scroll')
    }
  }

  protected navigateTo(country: string): void {
    this.isOpen.set(false)
    this.expansionPanel().close()
    this.router.navigate(['/duration/delay'], {queryParams: {country}})
  }


  protected createProfile(): void {
    this.isOpen.set(false)
    this.expansionPanel().close()
    this.renderer.removeClass(document.body, 'no-scroll')
    this.router.navigate(['/duration/create-profile'])
  }
}

