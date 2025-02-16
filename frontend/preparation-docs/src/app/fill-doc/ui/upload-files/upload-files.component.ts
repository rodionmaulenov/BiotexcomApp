// // import {Component, inject, signal} from '@angular/core';
// // import {ServerService} from '../../service/server.service';
// // import {MatSidenavModule} from '@angular/material/sidenav';
// // import {MatChipsModule} from '@angular/material/chips';
// // import {CdkDrag} from '@angular/cdk/drag-drop';
// // import {MatIconModule} from '@angular/material/icon';
// // import {MatButtonModule} from '@angular/material/button';
// //
// // @Component({
// //   selector: 'upload-files',
// //   imports: [MatSidenavModule, MatChipsModule, CdkDrag, MatIconModule, MatButtonModule],
// //   templateUrl: './upload-files.component.html',
// //   styleUrl: './upload-files.component.scss',
// //   standalone: true
// // })
// // export class UploadFilesComponent {
// //   protected readonly serverServ = inject(ServerService)
// //   private formData = new FormData()
// //   protected selectedFiles = signal<{ file: File; progress: number }[]>([])
// //   protected pushOnServer = signal<boolean>(false)
// //   protected defaultImage = signal<string>('/assets/image.png')
// //
// //
// //   protected onFileSelected(event: any): void {
// //     const files: FileList = event.target.files
// //     this.selectedFiles.update(oldFiles => {
// //       const newFiles = Array.from(files)
// //         .filter(file => !oldFiles.some(existing => existing.file.name === file.name))
// //         .map(file => ({file, progress: 0}))
// //       return [...oldFiles, ...newFiles]
// //     })
// //   }
// //
// //   protected onUpload(): void {
// //     this.pushOnServer.set(true)
// //     const files = this.selectedFiles()
// //     if (!files.length) return
// //
// //     this.formData = new FormData()
// //     files.forEach(({file}) => this.formData.append('files', file))
// //
// //     this.serverServ.uploadPassportsOnServer(this.selectedFiles, this.formData)
// //   }
// //
// //   protected removeFile(fileToRemove: File): void {
// //     this.selectedFiles.update(files =>
// //       files.filter(({file}) => file !== fileToRemove)
// //     )
// //   }
// //
// //   protected triggerFileInput(): void {
// //     const fileInput = document.getElementById('uploadBTN') as HTMLInputElement
// //     if (fileInput) {
// //       fileInput.click()
// //     }
// //   }
// //
// // }
//
// import { MatButtonModule } from '@angular/material/button';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';
// import { CdkDrag } from '@angular/cdk/drag-drop';
// import {Component, inject} from '@angular/core';
// import {FileUploadStore} from './file-upload.store';
//
//
// @Component({
//   selector: 'upload-files',
//   standalone: true,
//   imports: [MatButtonModule, MatChipsModule, MatIconModule, CdkDrag],
//   template: `
//     <input type="file" id="uploadBTN" (change)="onFileSelected($event)" multiple hidden>
//     <button mat-button (click)="triggerFileInput()" [disabled]="store.uploading()">Выбрать файл</button>
//     <button mat-raised-button (click)="store.uploadFiles()" [disabled]="store.isUploadDisabled()">Загрузить файл</button>
//
//     <mat-chip-set>
//       @for (file of store.selectedFiles(); track file.file.name) {
//         <mat-chip cdkDrag (removed)="store.removeFile(file.file)">
//           <img matChipAvatar [src]="store.defaultImage()" alt="Passport image" />
//           {{ file.file.name }} - Прогресс: {{ file.progress }}%
//           @if (file.progress !== 100) {
//             <button matChipRemove>
//               <mat-icon>cancel</mat-icon>
//             </button>
//           }
//         </mat-chip>
//       }
//     </mat-chip-set>
//   `,
// })
// export class UploadFilesComponent {
//   protected readonly store = inject(FileUploadStore)
//
//   protected onFileSelected(event: any): void {
//     const files: FileList = event.target.files
//     this.store.selectFiles(files)
//   }
//
//   protected triggerFileInput(): void {
//     const fileInput = document.getElementById('uploadBTN') as HTMLInputElement
//     if (fileInput) {
//       fileInput.click()
//     }
//   }
// }
