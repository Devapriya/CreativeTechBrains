import React from 'react';
import FinalPage from '../components/FinalPage';

function FinalPagePage() {
  const estimatedTime = 'Thank you for submitting the request. Our team will reach out to you in approximately 3-5 business days for opening your account.';

  return <FinalPage estimatedTime={estimatedTime} />;
}

export default FinalPagePage;
