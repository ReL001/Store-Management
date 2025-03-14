import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Layout from './components/Layout';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/store-manager/*"
            element={
              <Layout title="Store Manager Dashboard">
                {/* TODO: Add Store Manager Routes */}
                <div>Store Manager Dashboard</div>
              </Layout>
            }
          />
          <Route
            path="/hod/*"
            element={
              <Layout title="HOD Dashboard">
                {/* TODO: Add HOD Routes */}
                <div>HOD Dashboard</div>
              </Layout>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
