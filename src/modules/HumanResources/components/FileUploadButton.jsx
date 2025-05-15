import React, { useState } from 'react';
import axios from 'axios';
import '../styles/uploading.css';

const FileUploadButton = ({ onUploadSuccess, buttonText = "Apply Report", reportType }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hidden file input ref
  const fileInputRef = React.createRef();
  
  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setError(null);

    // Create directory structure based on report type
    const directory = `Human_Resource_Management/Reports/${reportType}/${new Date().toISOString().split('T')[0]}`;
    
    try {
      // Get pre-signed URL
      const getUrlResponse = await axios.post('https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/upload-to-s3/', {
        filename: file.name,
        directory: directory,
        contentType: file.type
      });
      
      const { uploadUrl, fileUrl } = getUrlResponse.data;
      
      // Upload file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });
      
      setUploading(false);
      
      if (onUploadSuccess) {
        onUploadSuccess({
          fileName: file.name,
          filePath: fileUrl,
          reportType: reportType,
          uploadDate: new Date().toISOString()
        });
      }
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed: ' + (err.response?.data?.message || err.message));
      setUploading(false);
    }
  };

  return (
    <div className="hr-report-upload-button">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
      />
      
      <button 
        onClick={handleClick} 
        disabled={uploading}
        className="hr-apply-button"
      >
        {uploading ? 'Uploading...' : buttonText}
      </button>
      
      {error && <div className="hr-upload-error">{error}</div>}
    </div>
  );
};

export default FileUploadButton;