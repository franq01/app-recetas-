import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Button, Typography, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../context/firebaseConfig';
import { translateText } from '../translateAPI'; 

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [translatedTitle, setTranslatedTitle] = useState('');
  const [translatedInstructions, setTranslatedInstructions] = useState('');
  const navigate = useNavigate();

  const apiKey = '0a959868b08f4afa952c894371f1899e';

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`);
        setRecipe(response.data);
        setTranslatedTitle(response.data.title);
        setTranslatedInstructions(response.data.instructions);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const translateRecipeDetails = async () => {
      if (recipe) {
        if (language === 'es') {
          // Traducir título y las  instrucciones
          const titleTranslation = await translateText(recipe.title, 'es');
          const instructionsTranslation = await translateText(recipe.instructions, 'es');
          setTranslatedTitle(titleTranslation);
          setTranslatedInstructions(instructionsTranslation);
        } else {
          // Si el idioma es inglés se queda en ese idioma 
          setTranslatedTitle(recipe.title);
          setTranslatedInstructions(recipe.instructions);
        }
      }
    };

    translateRecipeDetails();
  }, [language, recipe]); // solo funciona cuando cambie idioma en home, si en home esta en espanol se queda asi=

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);// se guada idioma en local storgare, se configuto en home 
    document.title = newLanguage === 'es' ? 'Recetas Populares' : 'Popular Recipes';
  };

  return (
    <div style={{ backgroundColor: '#FFF3E0', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* NavBar */}
      <AppBar position="fixed" sx={{ backgroundColor: '#FF5722' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Recetas App
          </Typography>
          <Button color="inherit" onClick={handleLanguageChange}>
            {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
          </Button>
          {auth.currentUser ? (
            <Typography variant="body1" sx={{ ml: 2 }}>
              Bienvenido, {auth.currentUser.displayName}
            </Typography>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>Iniciar Sesión</Button>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar />

      {/* Contenido de receta */}
      <div style={{ padding: '20px', marginTop: '60px', maxWidth: '800px', margin: 'auto' }}>
        {loading ? (
          <CircularProgress />
        ) : recipe ? (
          <>
            <Typography variant="h4" sx={{ color: '#FF5722', marginBottom: '20px' }}>
              {translatedTitle}
            </Typography>
            <img src={recipe.image} alt={translatedTitle} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
            <Typography variant="h5" sx={{ marginTop: '20px', color: '#FF5722' }}>Instrucciones</Typography>
            <Typography sx={{ marginTop: '10px', lineHeight: 1.5 }}>{translatedInstructions}</Typography>
          </>
        ) : (
          <Typography variant="h6" color="error">
            No se encontró la receta.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
