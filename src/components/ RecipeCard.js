import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import { FavoriteBorder } from '@mui/icons-material';
import { db, auth } from '../context/firebaseConfig';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { translateText } from '../translateAPI';

const RecipeCard = ({ recipe, language }) => {
  const navigate = useNavigate();
  const [translatedTitle, setTranslatedTitle] = useState(recipe.title);
  const [translatedSummary, setTranslatedSummary] = useState(recipe.summary);

  // Traducción automática del título y el resumen de la receta
  useEffect(() => {
    const translateRecipe = async () => {
      if (language === 'es') {
        const title = await translateText(recipe.title, 'es');
        const summary = recipe.summary
          ? await translateText(recipe.summary.substring(0, 100), 'es')
          : 'Sin descripción disponible';
        setTranslatedTitle(title);
        setTranslatedSummary(summary + '...');
      } else {
        setTranslatedTitle(recipe.title);
        setTranslatedSummary(
          recipe.summary?.substring(0, 100) + '...' || 'No description available.'
        );
      }
    };
    translateRecipe();
  }, [language, recipe]);

  // Navegación al detalle de la receta
  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  // Agregar receta a favoritos
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
          favorites: arrayUnion(recipe),
        });

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

  // Descargar receta y guardar en localStorage
  const handleDownload = (e) => {
    e.stopPropagation();
    try {
      const downloads = JSON.parse(localStorage.getItem('downloads')) || [];
      const alreadyDownloaded = downloads.find((item) => item.id === recipe.id);

      if (!alreadyDownloaded) {
        downloads.push(recipe);
        localStorage.setItem('downloads', JSON.stringify(downloads));
        alert('Receta descargada con éxito.');
      } else {
        alert('Esta receta ya está descargada.');
      }
    } catch (error) {
      console.error('Error al descargar la receta:', error);
      alert('Hubo un problema al descargar la receta.');
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        marginBottom: 2,
        borderRadius: '12px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={recipe.image}
        alt={translatedTitle}
        sx={{
          borderRadius: '12px 12px 0 0',
          cursor: 'pointer',
        }}
      />
      <CardContent
        sx={{
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
        }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: '#000000',
          }}
        >
          {translatedTitle}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            color: '#757575',
          }}
        >
          {translatedSummary}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'space-between',
          backgroundColor: '#ffffff',
          padding: '8px 16px',
        }}
      >
        <IconButton
          aria-label="add to favorites"
          onClick={handleAddToFavorites}
          sx={{
            color: '#ff6f61',
            '&:hover': {
              color: '#e53935',
            },
          }}
        >
          <FavoriteBorder />
        </IconButton>
        <Button
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#d6d6d6',
            },
          }}
          onClick={handleCardClick}
        >
          Ver Detalles
        </Button>
        <Button
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            color: '#000000',
            backgroundColor: '#ffd700',
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: '#ffc107',
            },
          }}
          onClick={handleDownload}
        >
          Descargar
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
