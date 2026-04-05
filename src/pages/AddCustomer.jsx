import { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '', customer_address: '', pan_card_number: '', gst_number: '', status: 'Active'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.customer_name || !formData.pan_card_number) {
      return alert("Name and PAN Card are mandatory!");
    }
    try {
      await axios.post('http://localhost:5000/api/customers', formData);
      alert("Customer Added Successfully!");
      navigate('/master/customers');
    } catch (err) {
      alert("Error adding customer. Check if PAN/GST already exists.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={4}>Add New Customer</Typography>
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Customer Name</Typography>
            <TextField fullWidth name="customer_name" value={formData.customer_name} onChange={handleChange} sx={{ backgroundColor: '#f5f5f5' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Customer Address</Typography>
            <TextField fullWidth name="customer_address" value={formData.customer_address} onChange={handleChange} sx={{ backgroundColor: '#f5f5f5' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Customer Pan Card Number</Typography>
            <TextField fullWidth name="pan_card_number" value={formData.pan_card_number} onChange={handleChange} sx={{ backgroundColor: '#f5f5f5' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Customer GST Number</Typography>
            <TextField fullWidth name="gst_number" value={formData.gst_number} onChange={handleChange} placeholder="Leave empty for 18% GST" sx={{ backgroundColor: '#f5f5f5' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Customer Status</Typography>
            <TextField select fullWidth name="status" value={formData.status} onChange={handleChange} sx={{ backgroundColor: '#f5f5f5' }}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="In-Active">In-Active</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box sx={{ mt: 5, display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="error" onClick={() => navigate('/master/customers')} sx={{ px: 4, py: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#1a237e', px: 5, py: 1, '&:hover': { backgroundColor: '#283593' } }}>
            Create
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}