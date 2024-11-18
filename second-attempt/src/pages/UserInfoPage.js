import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserInfoForm from '../components/UserInfoForm';


function UserInfoPage() {
  const navigate = useNavigate(); 
  const handleSubmit = (formData) => {
    console.log(formData);  // Here, you might save form data or move to the next step
    // You can navigate to the document upload page here
    navigate('/upload-documents', { state: { userInfo: formData } });
  };

  return <UserInfoForm onSubmit={handleSubmit} />;
}

export default UserInfoPage;
