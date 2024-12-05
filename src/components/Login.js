import React, { useState } from 'react';
import { auth, db } from '../context/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';
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
      await setDoc(userDocRef, { favorites: [] });
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
    <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* AppBar flotante */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#333',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            Recetas App
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 'bold',
              color: '#FFF',
              '&:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 12, padding: '20px' }}>
        <Box
          sx={{
            mt: 4,
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#FFF',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: '#333', fontWeight: 'bold' }}
          >
            Iniciar Sesión
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                mb: 2,
                backgroundColor: '#FFCDD2',
                color: '#B71C1C',
              }}
            >
              {error}
            </Alert>
          )}

          <form
            onSubmit={handleLogin}
            style={{ width: '100%', textAlign: 'center' }}
          >
            <TextField
              label="Correo Electrónico"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-input': {
                  color: '#333',
                },
                '& label.Mui-focused': {
                  color: '#FF5722',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#FF5722',
                },
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-input': {
                  color: '#333',
                },
                '& label.Mui-focused': {
                  color: '#FF5722',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#FF5722',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: '#333',
                color: '#FFF',
                fontWeight: 'bold',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGoogleLogin}
              sx={{
                mt: 2,
                backgroundColor: '#333',
                color: '#FFF',
                fontWeight: 'bold',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#555',
                },
              }}
            >
              Iniciar Sesión con Google
            </Button>
          </form>

          <Typography
            variant="body2"
            sx={{ mt: 2, color: '#333', fontWeight: 'bold' }}
          >
            ¿No tienes una cuenta?{' '}
            <Button
              onClick={() => navigate('/signup')}
              sx={{
                fontWeight: 'bold',
                color: '#FF5722',
                textTransform: 'none',
              }}
            >
              Crear Cuenta
            </Button>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
