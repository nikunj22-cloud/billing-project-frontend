import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';

// Components & Pages
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import Master from './pages/Master';
import Billing from './pages/Billing';
import CustomerList from './pages/CustomerList';
import ItemList from './pages/ItemList';
import AddCustomer from './pages/AddCustomer';
import AddItem from './pages/AddItem';
import Login from './pages/Login';
import Register from './pages/Register';


axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />; 

  if (requireAdmin && role !== 'Admin') {
    return (
      <Box p={4}>
        <h2>Access Denied 🛑</h2>
        <p>Only Admins can access the Master Module.</p>
      </Box>
    );
  }
  return children;
};


function MainLayout({ children, darkMode, toggleDarkMode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Background color change based on mode */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: darkMode ? '#121212' : '#f4f6f8', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
}

function App() {

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  }), [darkMode]);

  return (
   
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          <Route path="/" element={<ProtectedRoute><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><Billing /></MainLayout></ProtectedRoute>} />

         
          <Route path="/master" element={<ProtectedRoute requireAdmin={true}><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><Master /></MainLayout></ProtectedRoute>} />
          <Route path="/master/customers" element={<ProtectedRoute requireAdmin={true}><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><CustomerList /></MainLayout></ProtectedRoute>} />
          <Route path="/master/items" element={<ProtectedRoute requireAdmin={true}><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><ItemList /></MainLayout></ProtectedRoute>} />
          <Route path="/master/customers/add" element={<ProtectedRoute requireAdmin={true}><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><AddCustomer /></MainLayout></ProtectedRoute>} />
          <Route path="/master/items/add" element={<ProtectedRoute requireAdmin={true}><MainLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}><AddItem /></MainLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;