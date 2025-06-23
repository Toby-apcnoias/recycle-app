import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUpload } from '../hooks/useUpload'

const Upload = ({ onUploadComplete }) => {
  const uploadMutation = useUpload()

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      uploadMutation.mutate(file, {
        onSuccess: (downloadURL) => {
          onUploadComplete(downloadURL, file)
        },
        onError: (error) => {
          console.error('Upload failed:', error)
        }
      })
    }
  }, [uploadMutation, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary'}
          ${uploadMutation.isPending ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploadMutation.isPending ? (
          <div className="space-y-4">
            <div className="text-lg">Uploading...</div>
            <progress className="progress progress-primary w-full"></progress>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-6xl">📸</div>
            <div className="text-lg font-medium">
              {isDragActive ? 'Drop the image here' : 'Drop an image here, or click to select'}
            </div>
            <div className="text-sm text-base-content/60">
              Supports: JPEG, PNG, GIF, WebP
            </div>
          </div>
        )}
      </div>

      {uploadMutation.isError && (
        <div className="alert alert-error mt-4">
          <span>Upload failed. Please try again.</span>
        </div>
      )}
    </div>
  )
}

export default Upload 