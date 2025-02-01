import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {UploadFilesComponent} from './ui/upload-files/upload-files.component';

@Component({
  selector: 'app-fill-doc',
  imports: [MatSidenavModule, UploadFilesComponent],
  templateUrl: './fill-doc.component.html',
  styleUrl: './fill-doc.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FillDocComponent {

}
