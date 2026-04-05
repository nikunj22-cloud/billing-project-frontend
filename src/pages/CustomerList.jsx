import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://billing-project-backend-7917.onrender.com/api/customers')
      .then((res) => {
        setCustomers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          CUSTOMERS
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          sx={{ backgroundColor: '#1a237e', '&:hover': { backgroundColor: '#283593' } }}
          onClick={() => navigate('/master/customers/add')} 
        >
          ADD
        </Button>
      </Box>

     
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {customers.map((customer) => (
            <Grid item xs={12} sm={6} md={4} key={customer.id}>
              <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 2, position: 'relative', minHeight: '120px' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ width: '80%' }}>
                    {customer.customer_name}
                  </Typography>
                  
                  
                  <Chip 
                    label={customer.status} 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      bottom: 16, 
                      right: 16,
                      fontWeight: 'bold',
                      backgroundColor: customer.status === 'Active' ? '#e8f5e9' : '#ffebee',
                      color: customer.status === 'Active' ? '#2e7d32' : '#c62828',
                      borderRadius: 1
                    }} 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}