import { useState, useRef } from "react";

export function useFileUpload() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
        return files[0];
      }
      
      setSelectedFile(null);
      return null;
    };
    
    const uploadFile = async (url: string, data: FormData, onProgress?: (progress: number) => void) => {
      return new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
            onProgress?.(progress);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(new Response(xhr.responseText, {
              status: xhr.status,
              statusText: xhr.statusText
            }));
          } else {
            reject(new Error('Upload failed'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });
        
        xhr.open('POST', url);
        xhr.send(data);
      });
    };
    
    const clearFile = () => {
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    return {
      selectedFile,
      uploadProgress,
      fileInputRef,
      handleFileChange,
      uploadFile,
      clearFile,
    };
  }