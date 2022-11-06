import { gql } from '@apollo/client'
import { FILE_FIELDS } from './fragments'


export const UPLOAD_FILE = gql`
  ${FILE_FIELDS}
  
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      ...FileFields
    }
  }
`

export const UPLOAD_FILES = gql`
  ${FILE_FIELDS}
  mutation UploadFiles($files: [Upload!]!) {
    uploadFiles(files: $files) {
      ...FileFields
    }
  }
`

export const DELETE_FILE = gql`
  ${FILE_FIELDS}
  mutation DeleteFile(
    $id: String!
    $filename: String!
    $path: String!
    ) {
    deleteFile(file: {
      id: $id,
      filename: $filename
      path: $path
    }) {
      ...FileFields
    }
  }
`