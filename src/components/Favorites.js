import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../context/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RecipeCard from './ RecipeCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleTimer = () => navigate('/timer');
  const handleHome = () => navigate('/home');

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const userFavorites = docSnap.data().favorites || [];
            setFavorites(userFavorites);
          } else {
            console.log('No se encontró el documento del usuario');
          }
        } catch (error) {
          console.error('Error al cargar favoritos:', error);
        }
      } else {
        console.log('Usuario no autenticado');
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      {/* Navbar flotante */}
      <AppBar position="fixed" sx={{ backgroundColor: '#FF5722' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recetas App
          </Typography>
          <Button color="inherit" onClick={handleHome}>Inicio</Button>
          <Button color="inherit" onClick={handleTimer}>Cronómetro</Button>
          <IconButton color="inherit" onClick={() => navigate('/favorites')}>
            <Favorite />
          </IconButton>
          {!auth.currentUser ? (
            <Button color="inherit" onClick={handleLogin}>
              Iniciar Sesión
            </Button>
          ) : (
            <Typography variant="body1" sx={{ ml: 2 }}>
              Bienvenido, {auth.currentUser.displayName}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

      {/* Espaciado para evitar superposición */}
      <Toolbar />

      {/* Contenido: Favoritos */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tus Recetas Favoritas
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {favorites.length > 0 ? (
              favorites.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="text.secondary">
                No tienes recetas en favoritos.
              </Typography>
            )}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Favorites;
