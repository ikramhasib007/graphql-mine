import { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import Cropper from 'react-easy-crop'
import { getOrientation } from 'get-orientation/browser'
import { getCroppedImg, getRotatedImage } from './canvasUtils'
import { CameraIcon } from '@heroicons/react/solid'
import Modal from 'components/modal'
import BounceLoader from 'components/loaders/BounceLoader'
import NextImage from 'components/next-image'
import { useMutation } from '@apollo/client'
import { DELETE_FILE, UPLOAD_FILE } from 'src/operations/upload'
import getConfig from 'next/config'
import { classNames } from 'src/utils'

const { publicRuntimeConfig } = getConfig()

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
}

const ReactEasyCrop = ({ label, width, height, disabled, imageData, setImageData, ...props }) => {
  const [mutate, { loading }] = useMutation(UPLOAD_FILE)
  const [deleteFile] = useMutation(DELETE_FILE)
  const [file, setFile] = useState(imageData)
  const [originalFile, setOriginalFile] = useState(null)

  const inputRef = useRef(null)
  const [imageSrc, setImageSrc] = useState(null)
  const [skipCrop, setSkipCrop] = useState(props.skipCrop)
  const [crop, setCrop] = useState({ x: 0, y: 0, width, height })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImageData = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      // console.log('done', { croppedImageData })
      if(file?.path) remove(file);

      setImageSrc(null);
      setSkipCrop(props.skipCrop);
      inputRef.current.value = null;
      if(skipCrop) upload(originalFile);
      else upload(croppedImageData.file);
      
    } catch (e) {
      console.error('Image cropped error: ', e)
    }
  }, [imageSrc, croppedAreaPixels, rotation, skipCrop, file, props.skipCrop, remove, originalFile, upload])

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      let imageDataUrl = await readFile(file)

      // apply rotation if needed
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
        imageDataUrl = imageDataUrl.url
      }
      setOriginalFile(file)
      setImageSrc(imageDataUrl)
    }
  }

  const handleSkipCrop = () => {
    if(!skipCrop) {
      setZoom(1)
    }
    setSkipCrop(!skipCrop)
  }

  const handleClose = () => {
    inputRef.current.value = null;
    setImageSrc(null);
  }

  const upload = useCallback((blob) => {
    const file = new File([blob], originalFile?.name ?? 'fileName.jpg', { type:"image/jpeg", lastModified: new Date().getTime() });
    mutate({ variables: { file } }).then(({data}) => {
      setFile(data.uploadFile);
      if(setImageData) setImageData(data.uploadFile)
    }).catch(e => {
      console.log('File upload fail: ', e);
    })
  }, [originalFile, mutate, setImageData])

  const remove = useCallback(({id, filename}) => {
    deleteFile({variables: { id, filename }}).then(() => {
      setFile({});
      if(setImageData) setImageData({})
    }).catch(e => {
      console.log('File delete fail: ', e);
    })
  }, [deleteFile, setImageData])

  return (
    <>      
      <div className="mt-1 group z-0 relative rounded-md h-[200px]">
        {loading ? <div className='absolute inset-0 z-10 flex justify-center items-center'>
          <BounceLoader />
        </div>: null}
        <label
          htmlFor={`file-upload-${label.toLowerCase()}`}
          className={classNames(
            "absolute inset-0 flex justify-center items-center bg-gray-100 rounded-md font-medium text-neutral-600 hover:text-neutral-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-neutral-500 overflow-hidden",
            !disabled ? "cursor-pointer" : "pointer-events-none"
          )}
        >
          {file?.path ?
            <NextImage
              className="object-cover pointer-events-none group-hover:opacity-75"
              src={`${publicRuntimeConfig.STATIC_PATH}/${file.path}`}
              alt={label}
              width={width}
              height={height}
            />
          : <div className='flex flex-col justify-center items-center'>
              <CameraIcon className={classNames('h-24 w-24 text-gray-200', !disabled ? 'group-hover:opacity-60' : '')} aria-hidden="true" />
              <p className="text-xs text-gray-500 pb-0.25">{`Click to upload ${label}`}</p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
          </div>}
          <input ref={inputRef} disabled={disabled} id={`file-upload-${label.toLowerCase()}`} type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
        </label>
        
      </div>

      <Modal
        open={imageSrc !== null}
        title={`Upload ${label}`}
        headerBottomBorder={false}
        footer
        cancel={handleClose}
        close={handleClose}
        success={showCroppedImage}
        successButtonText="Upload"
      >
        <div className='space-y-4'>
          <div className="relative w-full h-[200px] bg-gray-300 sm:h-[400px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={skipCrop ? undefined : zoom}
              showGrid={!skipCrop}
              minZoom={0.5}
              aspect={4 / 3}
              cropSize={skipCrop ? undefined : { width, height }}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className='grid grid-cols-2 gap-4 sm:gap-6'>
            <div className="col-span-2 sm:col-span-1 space-x-4 flex">
              <label htmlFor={`zoom-${label.toLowerCase()}`} className="block text-sm font-medium text-gray-700">Zoom</label>
              <input
                type="range"
                id={`zoom-${label.toLowerCase()}`}
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                className='w-full h-6 p-0 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none'
                onChange={(e) => setZoom(e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-1 space-x-4 flex">
              <label htmlFor={`rotation-${label.toLowerCase()}`} className="block text-sm font-medium text-gray-700">Rotation</label>
              <input
                type="range"
                id={`rotation-${label.toLowerCase()}`}
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                className='w-full h-6 p-0 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none'
                onChange={(e) => setRotation(e.target.value)}
              />
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`skip-crop-${label.toLowerCase()}`}
                aria-describedby={`skip-crop-${label.toLowerCase()}-description`}
                name="skip-crop"
                type="checkbox"
                value={skipCrop}
                defaultChecked={props.skipCrop}
                onChange={handleSkipCrop}
                className="focus:ring-neutral-500 h-4 w-4 text-neutral-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={`skip-crop-${label.toLowerCase()}`} className="font-medium text-gray-700">
                Skip crop
              </label>
              <span id={`skip-crop-${label.toLowerCase()}-description`} className="text-gray-500">
                <span className="sr-only">Skip crop</span>
              </span>
            </div>
          </div>
        </div>

      </Modal>
    </>
  )
}

ReactEasyCrop.defaultProps = {
  width: 250,
  height: 300,
  imageData: null,
  skipCrop: false,
  disabled: false,
}

ReactEasyCrop.propTypes = {
  label: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  imageData: PropTypes.object,
  setImageData: PropTypes.func,
  skipCrop: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default ReactEasyCrop

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}
