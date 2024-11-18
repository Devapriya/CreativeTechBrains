import React from 'react';
import { Button, Container, Typography } from '@mui/material';

function FinalPage({ estimatedTime }) {
  return (
    <Container maxWidth="sm">
      <Typography variant="h6">Account Opening Estimated Time</Typography>
      <Typography variant="body1">{estimatedTime}</Typography>
      <Button variant="contained" color="primary" href="/">
        Start Again
      </Button>
    </Container>
  );
}

export default FinalPage;
