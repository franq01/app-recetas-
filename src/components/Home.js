import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Favorite } from '@mui/icons-material'; // Icono de favoritos
import RecipeCard from './ RecipeCard';
import axios from 'axios';
import { auth } from '../context/firebaseConfig'; 

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en'); 

  const apiKey = '0a959868b08f4afa952c894371f1899e'; 

  const handleLogin = () => navigate('/login'); 
  const handleTimer = () => navigate('/timer'); 
  const handleFavorites = () => navigate('/favorites'); 

  const handleLanguageChange = async () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`
        );

        // Si el idioma es español, traducimos las recetas
        if (language === 'es') {
          const translatedRecipes = await Promise.all(
            response.data.recipes.map(async (recipe) => ({
              ...recipe,
              title: await translateText(recipe.title),
              summary: await translateText(recipe.summary || ''),
            }))
          );
          setRecipes(translatedRecipes);
        } else {
          setRecipes(response.data.recipes);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [language]);

  // Función para traducir texto usando la API de LibreTranslate
  const translateText = async (text) => {
    try {
      const response = await axios.post('https://libretranslate.com/translate', {
        q: text,
        source: 'en',
        target: language === 'en' ? 'es' : 'en', 
        format: 'text',
      });
      return response.data.translatedText;
    } catch (error) {
      console.error('Error al traducir:', error);
      return text; 
    }
  };
  

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recetas App
          </Typography>

          {/* Botón de Cronómetro */}
          <Button color="inherit" onClick={handleTimer}>
            Cronómetro
          </Button>

          {/* Botón de Favoritos */}
          <IconButton color="inherit" onClick={handleFavorites}>
            <Favorite />
          </IconButton>

          {/* Alternar idioma */}
          <Button color="inherit" onClick={handleLanguageChange}>
            {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
          </Button>

          {/* Iniciar sesión o mostrar nombre */}
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

      {/* Contenido: Lista de recetas */}
      <Container>
        <Typography variant="h4" gutterBottom>
          Recetas Populares
        </Typography>

        {/* Indicador de carga */}
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <RecipeCard recipe={recipe} />
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="error">
                No se encontraron recetas. Verifica la conexión a la API.
              </Typography>
            )}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Home;
