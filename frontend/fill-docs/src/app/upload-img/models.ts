export interface UploadFile {
  file: File;
  progress: number;
}

export interface UploadState {
  selectedFiles: UploadFile[];
  isLoading: boolean;
}

export const initialUploadState: UploadState = {
  selectedFiles: [],
  isLoading: false,
};
