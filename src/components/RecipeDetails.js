import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { auth, db } from '../context/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`);
      setRecipe(response.data);
    };
    fetchRecipe();
  }, [id]);

  const addToFavorites = async () => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = doc(db, 'users', user.uid, 'favorites', recipe.id.toString());
      await setDoc(favoriteRef, recipe);
      alert('Receta agregada a favoritos');
    } else {
      alert('Por favor inicia sesión para agregar a favoritos');
    }
  };

  return recipe ? (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
      <CardMedia
        component="img"
        height="400"
        image={recipe.image}
        alt={recipe.title}
      />
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {recipe.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {recipe.instructions}
        </Typography>
        <Button variant="contained" color="primary" onClick={addToFavorites}>
          Agregar a Favoritos
        </Button>
      </CardContent>
    </Card>
  ) : (
    <Typography>Cargando...</Typography>
  );
};

export default RecipeDetails;
