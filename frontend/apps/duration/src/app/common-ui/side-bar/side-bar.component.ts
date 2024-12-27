import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {Router, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {SidebarStateService} from './state.service';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatExpansionModule,
    MatListModule, MatToolbarModule, MatIconModule, MatGridListModule, RouterOutlet
  ],
  template: `
    <mat-drawer-container class="custom-container">
      <mat-drawer #drawer class="custom-sidenav" mode="over">
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
                <span>Добавить запись</span>
                <mat-icon>person_add</mat-icon>
              </div>
            </button>
          </mat-expansion-panel>
        </mat-accordion>
      </mat-drawer>

      <mat-drawer-content>
        <router-outlet></router-outlet>
      </mat-drawer-content>

    </mat-drawer-container>
  `,
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent implements AfterViewInit {
  private readonly router: Router = inject(Router)
  private readonly sidebarState = inject(SidebarStateService)

  @ViewChild('drawer') drawer!: MatDrawer
  @ViewChild('expansionPanel') expansionPanel!: MatExpansionPanel


  ngAfterViewInit(): void {
    // Pass references to the signal store
    this.sidebarState.setDrawer(this.drawer)
    this.sidebarState.setExpansionPanel(this.expansionPanel)
  }


  protected navigateTo(country: string): void {
    this.drawer.close()
    this.expansionPanel.close()
    this.router.navigate(['/delay'], {queryParams: {country}})
  }


  protected createProfile(): void {
    this.drawer.close()
    this.expansionPanel.close()
    this.router.navigate(['/create-profile'])
  }
}

