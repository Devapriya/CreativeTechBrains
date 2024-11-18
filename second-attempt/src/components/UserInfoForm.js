import React, { useEffect, useState } from 'react';
import { Button, TextField, Container, Typography, Grid, CircularProgress, MenuItem, Select, FormControl, InputLabel, FormHelperText } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function UserInfoForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    entity : '',
  });

  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Print something");
    onSubmit(formData);
  };

  const handleButtonClick = async () => {
    setLoading(true);
    setResponse(''); // Reset previous response
    console.log(formData);
    if (formData.entity) {
      navigate("/upload-documents", { state: { entity : formData.entity }}); // Pass the selected entity as state to the second page
    }
  };

  return (
    <Container maxWidth="sm">
      <h2>Personal Information</h2>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel id="entity-type-label">Entity Type</InputLabel>
            <Select
              labelId="entity-type-label"
              value={formData.entity}
              onChange={handleChange}
              name="entity"
              label="entity"
            >
              <MenuItem value="limited">Limited</MenuItem>
              <MenuItem value="trust">Trust</MenuItem>
              <MenuItem value="partnership">Partnership</MenuItem>
            </Select>
            <FormHelperText>Choose your Enitity type</FormHelperText>
          </FormControl>
        </Grid>
          <Grid item xs={12}>
            <Button onClick={handleButtonClick} type="submit" variant="contained" color="primary" fullWidth>
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default UserInfoForm;