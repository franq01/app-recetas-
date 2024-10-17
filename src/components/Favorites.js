
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress } from '@mui/material';
import { db, auth } from '../context/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RecipeCard from './ RecipeCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Container>
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
  );
};

export default Favorites;
