import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UploadImgComponent } from '../upload-img/upload-img.component';
import { StepperComponent } from '../stepper/stepper.component';

@Component({
  selector: 'side-bar',
  imports: [
    MatSidenavModule,
    UploadImgComponent,
    StepperComponent,
],
  templateUrl: './side-bar.component.html',
  standalone: true,
  styleUrl: './side-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent {

}
