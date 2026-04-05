import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Staff' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.password) return setError("Please fill all fields");

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Account Created Successfully! Please Login.");
      navigate('/login'); // Register hone ke baad waapas Login pe bhej do
    } catch (err) {
      setError(err.response?.data?.error || "Registration Failed. Username might exist.");
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f8' }}>
      <Card elevation={4} sx={{ width: 400, p: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
            Sign up to start billing
          </Typography>

          {error && <Typography color="error" textAlign="center" mb={2}>{error}</Typography>}

          <TextField fullWidth label="Username" name="username" onChange={handleChange} sx={{ mb: 3 }} />
          <TextField fullWidth label="Password" type="password" name="password" onChange={handleChange} sx={{ mb: 3 }} />
          
          <TextField select fullWidth label="Select Role" name="role" value={formData.role} onChange={handleChange} sx={{ mb: 4 }}>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
          </TextField>

          <Button fullWidth variant="contained" size="large" onClick={handleRegister} sx={{ backgroundColor: '#2e7d32', mb: 2 }}>
            Sign Up
          </Button>

          <Button fullWidth color="primary" onClick={() => navigate('/login')}>
            Already have an account? Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}