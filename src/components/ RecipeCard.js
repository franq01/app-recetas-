import React from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, CardActions, Button } from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material'; 
import { db, auth } from '../context/firebaseConfig';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom'; 

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate(); 

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`); 
  };

  const handleAddToFavorites = async (e) => {
    e.stopPropagation();
    const user = auth.currentUser;
  
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (!userDoc.exists()) {
          await setDoc(userDocRef, { favorites: [] });
        }
  
        await updateDoc(userDocRef, {
          favorites: arrayUnion(recipe)
        });
  
        // Guardar en el almacenamiento local
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(favorites));
  
        alert('Receta agregada a favoritos');
      } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        alert('Hubo un problema al agregar la receta a favoritos.');
      }
    } else {
      alert('Por favor inicia sesión para agregar a favoritos.');
    }
  };
  
  

  return (
    <Card sx={{ maxWidth: 345, marginBottom: 2 }} onClick={handleCardClick}>
      <CardMedia
        component="img"
        height="200"
        image={recipe.image}
        alt={recipe.title}
        sx={{ cursor: 'pointer' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {recipe.summary?.substring(0, 100)}... 
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton aria-label="add to favorites" onClick={handleAddToFavorites}>
          <FavoriteBorder />
        </IconButton>
        <Button size="small" color="primary" onClick={handleCardClick}>
          Ver Detalles
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
