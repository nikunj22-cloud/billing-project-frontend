import { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_name: '', selling_price: '', status: 'Active'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.item_name || !formData.selling_price) return alert("All fields are mandatory!");
    try {
      await axios.post('https://billing-project-backend-7917.onrender.com/api/items', formData);
      alert("Item Added Successfully!");
      navigate('/master/items');
    } catch (err) {
      alert("Error adding item.");
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={4}>Add New Item</Typography>
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'transparent' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Item Name</Typography>
            <TextField fullWidth name="item_name" value={formData.item_name} onChange={handleChange} sx={{ backgroundColor: '#f5f5f5' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Customer Selling Price</Typography>
            <TextField fullWidth type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} sx={{ backgroundColor: '#f5f5f5' }} />
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
          <Button variant="outlined" color="error" onClick={() => navigate('/master/items')} sx={{ px: 4, py: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#1a237e', px: 5, py: 1 }}>Create</Button>
        </Box>
      </Paper>
    </Box>
  );
}