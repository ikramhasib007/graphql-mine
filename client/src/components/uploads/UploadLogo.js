import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/client'
import { DELETE_FILE, UPLOAD_FILE } from 'src/operations/upload'
import getConfig from 'next/config'
import { allowedImageType } from 'src/utils'
import { CameraIcon } from '@heroicons/react/solid'
import BounceLoader from 'components/loaders/BounceLoader'
import NextImage from 'components/next-image'

const { publicRuntimeConfig } = getConfig()

function UploadLogo({
  label, labelClassName, setData, optional, data = {}, dimension
}) {
  const [file, setFile] = useState(data)
  const [mutate, { loading }] = useMutation(UPLOAD_FILE)
  const [deleteFile] = useMutation(DELETE_FILE)
  const [error, setError] = useState()

  function onChange({ target: { validity, files:[file] } }) {
    if(file?.size > 1048576) return setError('Max file size exceeded') /* 1MB */
    if(!allowedImageType.includes(file?.type)) return;
    if (validity.valid) {
      if(error) setError();
      if(dimension) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          const image = new Image();
          image.src = e.target.result;
          image.onload = function () {
            if((dimension.width != this.width) || (dimension.height != this.height)) {
              setError(`Dimension must be ${dimension.width}x${dimension.height}px`)
              return false;
            } else uploadMutate(file)
          };
        };
      } else uploadMutate(file)
    }
  }

  function uploadMutate(file) {
    mutate({ variables: { file } }).then(({data}) => {
      setFile(data.uploadFile);
      if(setData) setData(data.uploadFile)
    }).catch(e => {
      setError('Max file size exceeded')
      console.log('File upload fail: ', e);
    })
  }

  function handleRemove({id, filename}) {
    deleteFile({variables: { id, filename }}).then(() => {
      setFile({});
      if(setData) setData({})
    }).catch(e => {
      console.log('e: ', e);
      setError('Can\'t remove the file')
    })
  }

  useEffect(() => {
    if (data && Object.keys(data).length) setFile(data)
  }, [data])

  return (
    <Fragment>
      { !optional ? <label htmlFor="cover_photo" className={labelClassName}>{label}</label>
      :
      <div className="flex">
        <label htmlFor="cover_photo" className={labelClassName}>{label}</label>
        <span className="pl-1 text-sm text-gray-500" id={label.toLowerCase()}>
        (optional)
        </span>
      </div>}
      
      <div className={"mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"}>
        <div className="space-y-1 text-center">
          {(file?.filename) ? <div className="relative">
            <div className="group block h-[212px] w-[212px] rounded-full aspect-w-10 aspect-h-7 bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-neutral-500 overflow-hidden">
              {/* <img src={`${publicRuntimeConfig.STATIC_PATH}/${file.path}`} alt="" className="object-cover pointer-events-none group-hover:opacity-75" /> */}
              <NextImage
                className="object-cover pointer-events-none group-hover:opacity-75"
                src={`${publicRuntimeConfig.STATIC_PATH}/${file.path}`}
                alt=""
                width={212}
                height={212}
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
              <span className="sr-only">Remove Image</span>
              <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
              </svg>
            </button>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{file.filename}</p>
          </div>
          :
          <div className='relative flex justify-center items-center bg-gray-100 rounded-full h-[212px] w-[212px]'>
            {loading ? <div className='absolute inset-0 flex justify-center items-center'>
              <BounceLoader />
            </div>: null}
            <CameraIcon className='h-24 w-24 text-gray-200' aria-hidden="true" />
          </div>}
          {!!error && <p className="text-sm text-red-500 pt-0.5">{error}</p>}
          <div className="flex text-sm text-gray-600 justify-center pt-2">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a {label?.toLowerCase() ?? 'logo'}</span>
              <input data-testid="file-upload" id="file-upload" name="file-upload" onChange={onChange} type="file" className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 1MB</p>
        </div>
      </div>
    </Fragment>
  )
}

UploadLogo.defaultProps = {
  label: 'Label',
  labelClassName: "block text-sm font-medium text-gray-700",
  setData: () => {},
  optional: false,
}

UploadLogo.propTypes = {
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  setData: PropTypes.func,
  optional: PropTypes.bool,
  data: PropTypes.object,
  dimension: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  })
}

export default UploadLogo