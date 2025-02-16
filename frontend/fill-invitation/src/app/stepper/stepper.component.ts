import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ExpansionPannelComponent } from './expansion-panel/expansion-panel.component';
import { UploadIMGStore } from '../upload-img/upl-img-store';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StepperStore } from './stepper-store';

@Component({
  selector: 'custom-stepper',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true },
    },
  ],
  imports: [
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    ExpansionPannelComponent,
    MatProgressBarModule,
  ],
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent {
  protected readonly _imgUplStore = inject(UploadIMGStore)
  protected readonly _stepStore = inject(StepperStore)

  onStepChange(event: StepperSelectionEvent): void {
    this._stepStore.changeStep(event.selectedIndex)
  }
}
