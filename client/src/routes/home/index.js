import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import UploadFile from '../../components/uploads/UploadFile'
import UploadFiles from '../../components/uploads/UploadFiles'
import { INCREMENT_GLOBAL_COUNTER } from '../../operations/subscription'
import Users from './Users'

function Home() {
  const [files, setFiles] = useState([])
  const [file, setFile] = useState({})
  const [incrementGlobalCounter, { data: subscribeData }] = useMutation(INCREMENT_GLOBAL_COUNTER)
  console.log('subscribeData: ', subscribeData);

  useEffect(() => {
    incrementGlobalCounter()
  }, [])

  return (
    <>
      <div className='grid grid-cols-2 gap-6 p-6'>
        <div className="col-span-1">
          <UploadFile
            data={file}
            getData={(data) => setFile(data)}
          />
        </div>
        <div className="col-span-1">
          <UploadFiles
            inputName={'multiple-files'}
            data={files}
            getData={(data) => setFiles(data)}
          />
        </div>
      </div>
      <Users />
    </>
  )
}

export default Home