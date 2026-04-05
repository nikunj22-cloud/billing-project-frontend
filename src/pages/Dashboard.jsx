import { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, InputAdornment, Grid, Card, CardContent, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import { Search as SearchIcon, Print as PrintIcon, Close as CloseIcon, TrendingUp, Receipt, People } from '@mui/icons-material';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useReactToPrint } from 'react-to-print';
import { InvoiceTemplate } from '../components/InvoiceTemplate';

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
 
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:5000/api/invoices')
      .then((res) => setInvoices(res.data))
      .catch((err) => console.error("Error fetching invoices:", err));
  }, []);

 
  const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.net_amount), 0);
  
  const chartData = invoices.slice(0, 5).reverse().map(inv => ({
    name: inv.invoice_id,
    Revenue: parseFloat(inv.net_amount)
  }));


  const filteredInvoices = invoices.filter((invoice) => 
    invoice.invoice_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const handleOpenPrintModal = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDialog(true);
  };

 const handlePrint = useReactToPrint({
    contentRef: printRef,  
    documentTitle: `Invoice_${selectedInvoice?.invoice_id}`,
  });

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>DASHBOARD OVERVIEW</Typography>

  
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ backgroundColor: '#1a237e', color: 'white', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Total Revenue</Typography>
                <Typography variant="h4" fontWeight="bold">₹{totalRevenue.toFixed(2)}</Typography>
              </Box>
              <TrendingUp sx={{ fontSize: 40, opacity: 0.5 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ backgroundColor: '#2e7d32', color: 'white', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Invoices Generated</Typography>
                <Typography variant="h4" fontWeight="bold">{totalInvoices}</Typography>
              </Box>
              <Receipt sx={{ fontSize: 40, opacity: 0.5 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ backgroundColor: '#e65100', color: 'white', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>Avg Bill Value</Typography>
                <Typography variant="h4" fontWeight="bold">
                  ₹{totalInvoices > 0 ? (totalRevenue / totalInvoices).toFixed(2) : '0.00'}
                </Typography>
              </Box>
              <People sx={{ fontSize: 40, opacity: 0.5 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

     
      <Card elevation={2} sx={{ mb: 4, p: 2, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Recent Revenue Trend</Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
              <Bar dataKey="Revenue" fill="#2196f3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Recent Invoices</Typography>
        <TextField
          variant="outlined" placeholder="Search Invoice ID..." size="small"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ backgroundColor: 'white', borderRadius: 1, width: '300px' }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        />
      </Box>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#2c3e50' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Invoice ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Net Amount</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell><Chip label={invoice.invoice_id} size="small" sx={{ fontWeight: 'bold', backgroundColor: '#e3f2fd', color: '#1565c0' }} /></TableCell>
                <TableCell sx={{ fontWeight: '500' }}>{invoice.customer_name}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2e7d32' }}>₹{parseFloat(invoice.net_amount).toFixed(2)}</TableCell>
                <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Button 
                    size="small" variant="outlined" startIcon={<PrintIcon />} 
                    onClick={() => handleOpenPrintModal(invoice)}
                  >
                    View & Print
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" fontWeight="bold">Invoice Preview</Typography>
          <IconButton onClick={() => setOpenDialog(false)}><CloseIcon /></IconButton>
        </Box>
        
        <DialogContent sx={{ backgroundColor: '#f5f5f5', p: 4, display: 'flex', justifyContent: 'center' }}>
       
          <Box sx={{ width: '100%', maxWidth: '800px', boxShadow: 3 }}>
             <InvoiceTemplate ref={printRef} invoice={selectedInvoice} />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, backgroundColor: 'white' }}>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handlePrint} variant="contained" color="primary" startIcon={<PrintIcon />} size="large">
            Print / Save as PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}