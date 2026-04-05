import { Box, Card, CardActionArea, CardContent, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Master() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>Master</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardActionArea onClick={() => navigate('/master/customers')} sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={1}>Customer</Typography>
                <Typography variant="body2" color="text.secondary">Read or Create customer data</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <CardActionArea onClick={() => navigate('/master/items')} sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" mb={1}>Items</Typography>
                <Typography variant="body2" color="text.secondary">Read or Create items data</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}