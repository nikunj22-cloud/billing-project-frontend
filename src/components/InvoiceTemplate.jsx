import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';

export const InvoiceTemplate = React.forwardRef(({ invoice }, ref) => {
  if (!invoice) return null;

  return (
    <Box ref={ref} sx={{ p: 5, backgroundColor: 'white', color: 'black', width: '100%', minHeight: '100%' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="#1a237e">BILLING APP</Typography>
          <Typography variant="body1">123, Tech Street, Jaipur, India</Typography>
          <Typography variant="body1">Email: contact@billingapp.com</Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h4" color="text.secondary">INVOICE</Typography>
          <Typography variant="h6" fontWeight="bold">#{invoice.invoice_id}</Typography>
          <Typography variant="body1">Date: {new Date(invoice.created_at).toLocaleDateString()}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4, borderColor: '#1a237e', borderWidth: 2 }} />

      {/* Bill To Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">BILL TO:</Typography>
        <Typography variant="h5" fontWeight="bold">{invoice.customer_name}</Typography>
      </Box>

      {/* Items Table (Summary for now) */}
      <Table sx={{ mb: 5, border: '1px solid #e0e0e0' }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Products / Services Rendered</TableCell>
            <TableCell align="right">₹{parseFloat(invoice.total_amount).toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Totals Section */}
      <Box sx={{ ml: 'auto', width: '300px' }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>Subtotal:</Typography>
          <Typography>₹{parseFloat(invoice.total_amount).toFixed(2)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography>GST Amount:</Typography>
          <Typography>₹{parseFloat(invoice.gst_amount).toFixed(2)}</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" sx={{ backgroundColor: '#e8eaf6', p: 1, borderRadius: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="#1a237e">Total (INR):</Typography>
          <Typography variant="h6" fontWeight="bold" color="#1a237e">₹{parseFloat(invoice.net_amount).toFixed(2)}</Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 10, textAlign: 'center' }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">Thank you for your business!</Typography>
      </Box>
    </Box>
  );
});