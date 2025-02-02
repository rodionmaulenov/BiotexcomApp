import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';


export const imageUploadStore = signalStore(
  {providedIn: 'root'},
  withState({
      selectedFiles: [],
      uploading: false,
      defaultImage: '/assets/image.png',
    }
  ),
  withMethods((store) => ({
      selectFiles(files: FileList): void {
        patchState(store, {uploading: true})
        patchState(store, (state) => ({filter: {...state.uploading, order}}));
      },
    })
  ),
)
