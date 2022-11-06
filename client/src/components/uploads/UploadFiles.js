import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import getConfig from 'next/config'
import Image from 'next/image'
import { DELETE_FILE, UPLOAD_FILES } from '../../operations/upload'
import { allowedImageType, classNames, imageProps } from '../../utils'

const { publicRuntimeConfig } = getConfig()

function UploadFiles({
  label, labelClassName, inputName, data = [], getData, optional, maxFileLimit
}) {
  const [files, setFiles] = useState(data)
  const [mutate, { loading }] = useMutation(UPLOAD_FILES)
  const [deleteFile, { loading: deleteLoading }] = useMutation(DELETE_FILE)
  const [error, setError] = useState()

  function onChange({ target: { validity, files } }) {
    for (let i = 0; i < files.length; i++) {
      if (files[i]?.size > 1048576) return setError('Max file size exceeded') /* 1MB */
      if (!allowedImageType.includes(files[i]?.type)) return;
    }
    if (validity.valid) {
      if (error) setError();
      let totalFile = data.length === 0 && files.length > 4 ? 1 : data.length + files.length
      if (totalFile > maxFileLimit) return;
      mutate({ variables: { files } }).then((res) => {
        const response = [...data, ...res.data.uploadFiles]
        setFiles(response);
        if (getData) getData(response)
      }).catch(e => {
        setError(e)
      })
    }
  }

  function handleRemove({ id, filename, path }) {
    deleteFile({ variables: { id, filename, path } }).then(({ errors }) => {
      if (!errors) {
        const response = files.slice().filter(file => file.id !== id)
        setFiles(response);
        if (getData) getData(response)
        document.querySelector(`input[type=file][id=${inputName}]`).value = ''
      }
    }).catch(e => {
      setError(e)
    })
  }

  useEffect(() => {
    if (data && Object.keys(data).length) setFiles(data)
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
          {files.length ? <ul role="list" className={classNames(
            "grid gap-x-4 gap-y-8 md:gap-x-6 xl:gap-x-7",
            maxFileLimit < 4 ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}>
            {files.map((file, i) => (
              <li key={file.id + i} className="relative w-36">
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
              </li>
            ))}
          </ul>
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
          {!!error && <p className="text-sm text-red-500 pt-0.5">4 max file uploads or size exceeded</p>}
          <div className="flex text-sm text-gray-600 justify-center pt-2">
            <label
              htmlFor={inputName}
              className={classNames(
                "relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500",
                loading ? "pointer-events-none" : ""
              )}
            >
              <span>Upload photos</span>
              {loading && <div className="absolute inset-0 animate-pulse-1s">
                <div className="h-full w-full bg-slate-200 rounded-full" />
              </div>}
              <input data-testid={inputName} id={inputName} name={inputName} onChange={onChange} type="file" multiple className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
        </div>
      </div>
    </Fragment>
  )
}

UploadFiles.defaultProps = {
  label: 'Label',
  labelClassName: "block text-sm font-medium text-gray-700",
  optional: false,
  data: [],
  getData: () => { },
  maxFileLimit: 4,
  inputName: "file-upload"
}

UploadFiles.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  getData: PropTypes.func.isRequired,
  labelClassName: PropTypes.string,
  optional: PropTypes.bool,
  maxFileLimit: PropTypes.number,
  inputName: PropTypes.string
}

export default UploadFiles