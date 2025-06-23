import { useMutation } from '@tanstack/react-query'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

export const useUpload = () => {
  return useMutation({
    mutationFn: async (file) => {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    },
    onError: (error) => {
      console.error('Upload failed:', error)
    }
  })
} 