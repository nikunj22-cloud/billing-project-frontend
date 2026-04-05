import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Dashboard as DashboardIcon, Storage as MasterIcon, Receipt as BillingIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear(); // Token aur role delete kar do
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#f8f9fa' },
      }}
    >
      <Box sx={{ p: 2, backgroundColor: '#2c3e50', color: 'white' }}>
        <Typography variant="h6" fontWeight="bold">Billing App</Typography>
        <Typography variant="caption" sx={{ color: '#aab7c4' }}>Welcome, {username} ({role})</Typography>
      </Box>
      
      <List sx={{ flexGrow: 1 }}>
        {/* Dashboard - Sabke liye */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/')} selected={location.pathname === '/'}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Master - SIRF ADMIN KE LIYE */}
        {role === 'Admin' && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/master')} selected={location.pathname.includes('/master')}>
              <ListItemIcon><MasterIcon /></ListItemIcon>
              <ListItemText primary="Master" />
            </ListItemButton>
          </ListItem>
        )}

        {/* Billing - Sabke liye */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/billing')} selected={location.pathname === '/billing'}>
            <ListItemIcon><BillingIcon /></ListItemIcon>
            <ListItemText primary="Billing" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      {/* Logout Button Niche */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ color: '#d32f2f' }}>
            <ListItemIcon sx={{ color: '#d32f2f' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}