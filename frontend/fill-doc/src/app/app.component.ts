import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fill-doc';
}

export const UploadStore = signalStore(
  {providedIn: 'root'},
  withState({
    selectedFiles: [] as { file: File, progress: number },
    uploading: false,
    defaultImage: '/assets/image.png',
  }),
  withMethods(store => {

      return {
        updateCriteria: () => {
          patchState(store, {uploading: false})
        },
      }
    }
  ),
)
