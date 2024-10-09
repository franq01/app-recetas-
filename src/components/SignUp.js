
import React, { useState } from 'react';
import { auth } from '../context/firebaseConfig'; 
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      navigate('/'); // redirige a home despues de logearse 
    } catch (error) {
      alert(error.message); 
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Crear Cuenta
        </Typography>
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Crear Cuenta
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 2 }}>
          ¿Ya tienes una cuenta? <Button onClick={() => navigate('/login')} color="primary">Iniciar Sesión</Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default SignUp;
