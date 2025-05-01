import React, { useState } from 'react';
import axios from 'axios';
import '../styles/uploading.css';

const FileUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Replace with your actual backend endpoint
      const response = await axios.post('https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/upload/s3/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploading(false);
      if (onUploadSuccess) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed: ' + (err.response?.data?.message || err.message));
      setUploading(false);
    }
  };

  return (
    <div className="hr-file-uploader">
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="hr-file-input"
      />
      
      <button 
        onClick={handleUpload} 
        disabled={uploading || !selectedFile}
        className="hr-upload-button"
      >
        {uploading ? 'Uploading...' : 'Upload to S3'}
      </button>
      
      {error && <div className="hr-upload-error">{error}</div>}
    </div>
  );
};

export default FileUploader;