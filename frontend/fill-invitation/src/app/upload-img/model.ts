export type FileUpload = {
  file: File
  progress: number
}

export type PassportData = {
  id: number
  surname: string
  name: string
  father_name: string
  passport_number: string
  date_of_birth: string
  date_of_issue: string
}

export type UploadResponse = {
  message: string
  passports: PassportData[]
  status: string
}

