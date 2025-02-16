import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatChipsModule} from '@angular/material/chips';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {UploadIMGStore} from './upl-img-store';

@Component({
  selector: 'upload-img',
  imports: [
    MatSidenavModule, MatChipsModule, CdkDrag, MatIconModule, MatButtonModule,
  ],
  standalone: true,
  templateUrl: './upload-img.component.html',
  styleUrl: './upload-img.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadImgComponent {
  protected readonly store = inject(UploadIMGStore)

  protected triggerFileInput(): void {
    const fileInput = document.getElementById('uploadBTN') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }
}
