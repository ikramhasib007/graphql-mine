import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import getConfig from 'next/config'
import Image from 'next/image'
import { DELETE_FILE, UPLOAD_FILE } from '../../operations/upload'
import { allowedImageType, classNames, imageProps } from '../../utils'
import Spinner from '../loaders/spinner'

const { publicRuntimeConfig } = getConfig()

function UploadFile({
  label, labelClassName, inputName, getData, optional, data = {}
}) {
  const [file, setFile] = useState(data)
  const [mutate, { loading }] = useMutation(UPLOAD_FILE)
  const [deleteFile, { loading: deleteLoading }] = useMutation(DELETE_FILE)
  const [error, setError] = useState()

  function onChange({ target: { validity, files: [file] } }) {
    if (file?.size > 1048576) return setError('Max file size exceeded') /* 1MB */
    if (!allowedImageType.includes(file?.type)) return;
    if (validity.valid) {
      if (error) setError();
      mutate({ variables: { file } }).then(({ data, errors }) => {
        if (!errors) {
          setFile(data.uploadFile);
          if (getData) getData(data.uploadFile)
        }
      }).catch(e => {
        setError(e)
      })
    }
  }

  function handleRemove({ id, filename, path }) {
    deleteFile({ variables: { id, filename, path } }).then(({ errors }) => {
      if (!errors) {
        setFile({});
        if (getData) getData({})
        document.querySelector(`input[type=file][id=${inputName}]`).value = ''
      }
    }).catch(e => {
      setError(e)
    })
  }

  useEffect(() => {
    if (data && Object.keys(data).length) setFile(data)
  }, [data])

  return (
    <Fragment>
      {!optional ? <label htmlFor="cover_photo" className={labelClassName}>{label}</label>
        :
        <div className="flex">
          <label htmlFor="cover_photo" className={labelClassName}>{label}</label>
          <span className="pl-1 text-sm text-gray-500" id={label.toLowerCase()}>
            (optional)
          </span>
        </div>}

      <div className={classNames(
        error ? "border-red-300" : "border-gray-300",
        "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"
      )}>
        <div className="space-y-1 text-center">
          {(file?.filename) ? <div className="relative">
            <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-neutral-500 overflow-hidden">
              <Image
                {...imageProps({
                  src: `${publicRuntimeConfig.STATIC_PATH}/${file.path}`,
                  className: "rounded-md object-cover pointer-events-none group-hover:opacity-75"
                })}
                alt=""
              />
              <button type="button" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">View details for {file.filename}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(file)}
              className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 flex-shrink-0 h-4.5 w-4.5 rounded-full inline-flex items-center justify-center text-neutral-400 bg-neutral-50 hover:bg-neutral-300 hover:text-neutral-500 focus:outline-none focus:bg-neutral-500 focus:text-white"
            >
              {deleteLoading && <div className='absolute inset-0 flex justify-center items-center cursor-wait'><Spinner small /></div>}
              <span className="sr-only">Remove Image</span>
              <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
              </svg>
            </button>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{file.filename}</p>
          </div>
            :
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>}
          {!!error && <p className="text-sm text-red-500 pt-0.5">Max file size exceeded</p>}
          <div className="flex text-sm text-gray-600 justify-center pt-2">
            <label
              htmlFor={inputName}
              className={classNames(
                "relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500",
                loading ? "pointer-events-none" : ""
              )}
            >
              <span>Upload a photo</span>
              {loading && <div className="absolute inset-0 animate-pulse-1s">
                <div className="h-full w-full bg-slate-200 rounded-full" />
              </div>}
              <input data-testid={inputName} id={inputName} name={inputName} onChange={onChange} type="file" className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
        </div>
      </div>
    </Fragment>
  )
}

UploadFile.defaultProps = {
  label: 'Label',
  labelClassName: "block text-sm font-medium text-gray-700",
  getData: () => { },
  optional: false,
  inputName: "file-upload"
}

UploadFile.propTypes = {
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  getData: PropTypes.func,
  optional: PropTypes.bool,
  data: PropTypes.object,
  inputName: PropTypes.string
}

export default UploadFile