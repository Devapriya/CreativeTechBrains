import React, { useEffect, useState } from 'react';
import { TextField, Input, Box, Button, Container, CircularProgress, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

function DocumentUpload({ onDocumentsUpload }) {
  const location = useLocation();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const { entity } = location.state || {};
  const [responseMessage, setResponseMessage] = useState('');
  const [prevScores, setScores] = useState(0);
  const scoreMap = new Map();
  const navigate = useNavigate();
  const feildNotFound = [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
    accept: '.pdf, .jpg, .jpeg, .png, .xlsx',
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    setResponse(null);

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    navigate("/final");

  };
  console.log("This is "+entity);
  useEffect(() => {
    if (!entity) {
      // If no entity is passed, redirect back to the first page
      window.location.href = "/";
    }
  }, [entity]);

  function compareFields(arr1, arr2) {
    // Ensure both arrays have the same length
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    let score = 0;

    // Compare elements from set1 with set2, adding to score for each match
    set1.forEach(element => {
        if (set2.has(element)) {
            score += 1;  // Increment score if element exists in both sets
        }
    });
    set2.forEach(element => {
      if (!set1.has(element)){
        feildNotFound.push(element);
      }
    });

    console.log("Fields which are not there"+feildNotFound);
    console.log(Array.from(feildNotFound));

    const percentage = (score/set2.size) * 100; 
    return percentage;
}
  const entityDocs = {
    limited: [
      { id: 'directorreg', name: 'Director registry' },
      { id: 'sharereg', name: 'Share registry' },
      { id: 'certinc', name: 'Incorporation Certificate' },
      
    ],
    trust: [
      { id: 'trustdeed', name: 'Trust Deed' },
      { id: 'structchart', name: 'Structure Chart' },
    ],
    partnership: [
      { id: 'partdeed', name: 'Partnership Deed' },
      { id: 'idvdocs', name: 'IDV' },
    ]
  };
 // Check if entity is valid and get the required documents
  const requiredDocs = entityDocs[entity] || [];
  const handleFileChange = async (e, docId) => {
    e.preventDefault();
    const file = e.target.files[0];


    try {
      const response = await fetch('http://localhost:5000/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setResponseMessage(result); // Set response from Flask
      
      const requiredFields = ['Address', 'CountryRegion', 'DateOfBirth', 'SSN', 'gOOd Morning'];
      
      const score = compareFields(result, requiredFields);

      setScores((prevScores) => ({
        ...prevScores,
        [docId]: score, // Save the score for the corresponding document ID
      }));

      scoreMap.set(docId, score);

      console.log(Array.from(scoreMap.entries()));
      

    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Error occurred during submission");
    }

    if (file) {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [docId]: file, // Save the uploaded file to the corresponding document ID
      }));
    }
  };

  return (

    <Container maxWidth="sm">
      <Typography variant="h6">Upload Documents for the account type - {entity}</Typography>
      {files.length > 0 && (
        <div>
          <Typography variant="body1">Uploaded files:</Typography>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}

     {requiredDocs.length > 0 ? (
             <form onSubmit={handleUpload}>
          <Typography variant="h8" gutterBottom>
            Required Documents
          </Typography>
          {requiredDocs.map((doc) => {
            const uploadedFile = files[doc.id];
            const score = prevScores[doc.id];
            const isUploaded = Boolean(uploadedFile);
            const feedbackColor = score >= 95 ? 'green' : score >= 70 ? 'orange' : 'red'; // Based on the score
            const feedbackText = score
              ? `Score: ${score} (${score >= 90 ? 'Your uploaded document has been auto validated and has score more than 90 points. Good work!' : score >= 70 ? 'Your uploaded document has been auto validated. Please try to submit the files again making sure all the required parameters are there.': 'Your documents are missing some critical feilds, please try again!'+Array.from(feildNotFound)})`
              : '';

            return (
              <Box key={doc.id} sx={{ mb: 2, mt: 4 }}>
                <TextField
                  label={doc.name}
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <Input
                        type="file"
                        onChange={(e) => handleFileChange(e, doc.id)}
                        inputProps={{ accept: '.pdf,.docx,.jpg,.png,.jpeg' }}
                      />
                    ),
                  }}
                  // disabled={isUploaded}
                  helperText={isUploaded && `${uploadedFile.name} (Uploaded)`}
                  sx={{
                    borderColor: feedbackColor, // Apply the feedback color to the border
                    '& .MuiOutlinedInput-root': {
                      borderColor: feedbackColor, // For the border color
                    },
                  }}
                />
                {isUploaded && (
                  <Typography variant="body2" color={feedbackColor} sx={{ mt: 1 }}>
                    {feedbackText}
                  </Typography>
                )}
              </Box>
            );
          })}
<Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={Object.keys(files).length !== requiredDocs.length} // Disable submit until all files are uploaded
            >
              Submit
            </Button>
          </Box>
        </form>
      ) : (
        <Typography variant="body1">No documents required for this entity.</Typography>
      )}

      {/* <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
      >
        {uploading ? <CircularProgress size={24} /> : 'Upload'}
      </Button> */}

      {error && <Typography color="error">{error}</Typography>}

      {response && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Document Analysis Result:</Typography>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </Container>
  );
}

export default DocumentUpload;
