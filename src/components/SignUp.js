import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../context/firebaseConfig'; 
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, TextField, Typography, Container, Box, Alert } from '@mui/material';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box>
      {/* AppBar flotante */}
      <AppBar position="fixed" sx={{ backgroundColor: '#FF5722' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recetas App
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Home
          </Button>
        </Toolbar>
      </AppBar>

      
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Crear cuenta
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSignUp} style={{ width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor: '#FF5722' }}>
              Crear Cuenta
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2 }}>
            ¿Ya tienes una cuenta?{' '}
            <Button onClick={() => navigate('/login')} color="primary">
              Iniciar Sesión
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SignUp;
