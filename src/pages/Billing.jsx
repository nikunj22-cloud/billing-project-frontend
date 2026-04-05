import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, TextField, IconButton, Divider } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Billing() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([{ item_id: '', quantity: 1, unit_price: 0 }]);
  
  const [totals, setTotals] = useState({ totalAmount: 0, gstAmount: 0, netAmount: 0 });

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await axios.get('http://localhost:5000/api/customers');
        
        setCustomers(custRes.data.filter(c => c.status === 'Active'));

        const itemRes = await axios.get('http://localhost:5000/api/items');
     
        setAvailableItems(itemRes.data.filter(i => i.status === 'Active'));
      } catch (error) {
        console.error("Data fetch error", error);
      }
    };
    fetchData();
  }, []);

 
  useEffect(() => {
    if (!selectedCustomerId) return;

    const customer = customers.find(c => c.id === selectedCustomerId);
    const hasGST = customer && customer.gst_number ? true : false;

    let tempTotal = 0;
    invoiceItems.forEach(row => {
      tempTotal += (row.quantity * row.unit_price);
    });

    const calculatedGst = hasGST ? 0 : tempTotal * 0.18;

    setTotals({
      totalAmount: tempTotal,
      gstAmount: calculatedGst,
      netAmount: tempTotal + calculatedGst
    });
  }, [invoiceItems, selectedCustomerId, customers]);

 
  const handleAddItemRow = () => {
    setInvoiceItems([...invoiceItems, { item_id: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItemRow = (index) => {
    const list = [...invoiceItems];
    list.splice(index, 1);
    setInvoiceItems(list);
  };

  const handleItemChange = (index, field, value) => {
    const list = [...invoiceItems];
    if (field === 'item_id') {
      const selectedItem = availableItems.find(i => i.id === value);
      list[index].unit_price = selectedItem ? selectedItem.selling_price : 0;
    }
    list[index][field] = value;
    setInvoiceItems(list);
  };


  const handleGenerateInvoice = async () => {
    if (!selectedCustomerId) return alert("Please select a customer!");
    if (invoiceItems.some(i => !i.item_id || i.quantity < 1)) return alert("Please fill all item details properly.");

    try {
      const payload = {
        customer_id: selectedCustomerId,
        items: invoiceItems
      };
      const res = await axios.post('http://localhost:5000/api/invoices', payload);
      alert(`✅ ${res.data.message} Invoice ID: ${res.data.invoice_id}`);
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert("Error generating invoice");
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">CREATE INVOICE</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Side: Form Area */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <CardContent>
              {/* Customer Selection */}
              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Select Customer</InputLabel>
                <Select
                  value={selectedCustomerId}
                  label="Select Customer"
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  {customers.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.customer_name} {c.gst_number ? '(GST Registered)' : '(Un-Registered)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6" fontWeight="bold" mb={2}>Items</Typography>

              {/* Dynamic Item Rows */}
              {invoiceItems.map((row, index) => (
                <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Select Item</InputLabel>
                      <Select
                        value={row.item_id}
                        label="Select Item"
                        onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                      >
                        {availableItems.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.item_name} - ₹{item.selling_price}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField 
                      fullWidth 
                      label="Quantity" 
                      type="number" 
                      InputProps={{ inputProps: { min: 1 } }}
                      value={row.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography fontWeight="bold">₹{row.quantity * row.unit_price}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    {invoiceItems.length > 1 && (
                      <IconButton color="error" onClick={() => handleRemoveItemRow(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}

              <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAddItemRow} sx={{ mt: 2 }}>
                Add Another Item
              </Button>

            </CardContent>
          </Card>
        </Grid>

        
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 2, backgroundColor: '#1a237e', color: 'white' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={3} borderBottom="1px solid rgba(255,255,255,0.3)" pb={1}>
                Bill Summary
              </Typography>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Total Amount:</Typography>
                <Typography>₹{totals.totalAmount.toFixed(2)}</Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>GST ({totals.gstAmount > 0 ? '18%' : '0%'}):</Typography>
                <Typography>₹{totals.gstAmount.toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.3)', mb: 2 }} />
              
              <Box display="flex" justifyContent="space-between" mb={4}>
                <Typography variant="h5" fontWeight="bold">Net Payable:</Typography>
                <Typography variant="h5" fontWeight="bold">₹{totals.netAmount.toFixed(2)}</Typography>
              </Box>

              <Button 
                fullWidth 
                variant="contained" 
                color="success" 
                size="large" 
                startIcon={<ReceiptIcon />}
                onClick={handleGenerateInvoice}
                sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Generate Invoice
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}