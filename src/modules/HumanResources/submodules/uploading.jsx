const [file, setFile] = useState(null);
const [directory, setDirectory] = useState('');
const [uploadedUrl, setUploadedUrl] = useState(null);


const handleSubmit = async (e) => { // called when the button is pressed
  e.preventDefault();

  if (!file || !directory) {
    alert('Please select a file and directory name.');
    return;
  }
  // more frontend input file validation logic here

  try {
    // Ask Django for presigned URL
      const presignRes = await fetch('https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/upload-to-s3/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        directory: directory,
        contentType: file.type,
      }),
    });

    const { uploadUrl, fileUrl } = await presignRes.json();

    // use uploadUrl from django API response to make another request to S3
    const s3UploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!s3UploadRes.ok) throw new Error('Upload to S3 failed');
   
    //setUploadedUrl to the publicly accessible fileUrl;
    setUploadedUrl(fileUrl);
  } catch (err) {
    console.error('Upload failed:', err);
    alert('Upload failed. Check console for details.');
  }
};
{/* form to take in user input*/}
<form onSubmit={handleSubmit}>  {/* call function for uploading files to S3 */}
  {/* input text for directory */}
  <input    
    type="text"
    placeholder="Directory (required)"
    value={directory}
    onChange={(e) => setDirectory(e.target.value)}
    required
    style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
  />


  {/* file uploading */}
  <input
    type="file"
    onChange={(e) => setFile(e.target.files[0])}
    required
    style={{ padding: "0.5rem", borderRadius: "5px", border: "1px solid #ccc" }}
  />


  {/* button to submit and call handleSubmit */}
  <button type="submit">
    Upload
  </button>


  {/* uploadedUrl was set in handleSubmit, API call returned S3 object URL, display it to user */}
  {uploadedUrl && (
    <p>
      File uploaded: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">View</a>
    </p>
  )}
</form>
