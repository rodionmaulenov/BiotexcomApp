import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackBarData } from './model';

@Component({
  selector: 'snack-bar',
  imports: [MatIconModule],
  standalone: true,
  template: `
    <div class="snackbar-content">
      <mat-icon>{{ data.icon }}</mat-icon>
      <span>{{ data.message }}</span>
    </div>
  `,
  styleUrl: './snack-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarComponent {
  protected data = inject<SnackBarData>(MAT_SNACK_BAR_DATA)
}
