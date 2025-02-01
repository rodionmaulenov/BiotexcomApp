import {Component, inject, signal} from '@angular/core';
import {ServerService} from '../../service/server.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatChipsModule} from '@angular/material/chips';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'upload-files',
  imports: [MatSidenavModule, MatChipsModule, CdkDrag, MatIconModule, MatButtonModule],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.scss',
  standalone: true
})
export class UploadFilesComponent {
  protected readonly serverServ = inject(ServerService)
  private formData = new FormData()
  protected selectedFiles = signal<{ file: File; progress: number }[]>([])
  protected pushOnServer = signal<boolean>(false)
  protected defaultImage = signal<string>('/assets/image.png')


  protected onFileSelected(event: any): void {
    const files: FileList = event.target.files
    this.selectedFiles.update(oldFiles => {
      const newFiles = Array.from(files)
        .filter(file => !oldFiles.some(existing => existing.file.name === file.name))
        .map(file => ({file, progress: 0}))
      return [...oldFiles, ...newFiles]
    })
  }

  protected onUpload(): void {
    this.pushOnServer.set(true)
    const files = this.selectedFiles()
    if (!files.length) return

    this.formData = new FormData()
    files.forEach(({file}) => this.formData.append('files', file))

    this.serverServ.uploadPassportsOnServer(this.selectedFiles, this.formData)
  }

  protected removeFile(fileToRemove: File): void {
    this.selectedFiles.update(files =>
      files.filter(({file}) => file !== fileToRemove)
    )
  }

  protected triggerFileInput(): void {
    const fileInput = document.getElementById('uploadBTN') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

}
