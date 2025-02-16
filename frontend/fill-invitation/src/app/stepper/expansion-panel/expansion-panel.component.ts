import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ExtrPasspTblComponent } from './extr-passp-tbl/extr-passp-tbl.component';
import { StepperStore } from '../stepper-store';
import { DatesForInvitationComponent } from './dates-for-invitation/dates-for-invitation.component';

@Component({
  selector: 'expansion-pannel',
  imports: [
    MatExpansionModule,
    MatIconModule,
    ExtrPasspTblComponent,
    DatesForInvitationComponent,
  ],
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPannelComponent {
  protected readonly _stepStore = inject(StepperStore)
}
