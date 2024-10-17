// src/components/Login.js
import React, { useState } from 'react';
import { auth, db } from '../context/firebaseConfig'; // Importar Firestore
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar,Button, TextField, Typography, Container, Box, Alert } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFirestoreUser = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, { favorites: [] }); // Crea el documento del usuario si no existe
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleFirestoreUser(result.user); 
      navigate('/'); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await handleFirestoreUser(result.user); 
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
     <Container maxWidth="sm"sx={{ mt: 10 }}>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, backgroundColor: '#FF5722' }}>
            Iniciar Sesión
          </Button>
          <Button variant="contained" color="primary" onClick={handleGoogleLogin} fullWidth sx={{ mt: 2, backgroundColor: '#FF5722' }}>
            Iniciar Sesión con Google
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          ¿No tienes una cuenta?{' '}
          <Button onClick={() => navigate('/signup')} color="primary">
            Crear Cuenta
          </Button>
        </Typography>
      </Box>
    </Container>
   </Box>
  );
};

export default Login;
