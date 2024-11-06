import React, { useEffect, useState } from 'react';
import { AppBar, Box, Toolbar, Button, CircularProgress, IconButton, Drawer, List, ListItem, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const apiKey = '06f07715f2d840f6bc2545607431a95a';

  const handleTimer = () => navigate('/timer');
  const handleFavorites = () => navigate('/favorites');
  const handleLogin = () => navigate('/login');
  const handleHome = () => navigate('/home');

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
          // Tradce titulo y recerta 
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
  }, [language, recipe]);

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.title = newLanguage === 'es' ? 'Recetas Populares' : 'Popular Recipes';
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  
  const appBarHeight = 64;

  return (
    <div style={{ backgroundColor: '#FFF3E0', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* NavBar */}
      <AppBar position="fixed" sx={{ backgroundColor: '#FF5722', height: `${appBarHeight}px` }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
            Recetas App
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '10px' }}>
            <Button color="inherit" onClick={handleFavorites}>Favoritos</Button>
            <Button color="inherit" onClick={handleTimer}>Cronómetro</Button>
            <Button color="inherit" onClick={handleLanguageChange}>
              {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
            </Button>
            {auth.currentUser ? (
              <Typography variant="body1" sx={{ ml: 2 }}>
                Bienvenido, {auth.currentUser.displayName}
              </Typography>
            ) : (
              <Button color="inherit" onClick={handleLogin}>Iniciar Sesión</Button>
            )}
          </Box>
          <IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250 }}>
          <ListItem button onClick={handleTimer}>Cronómetro</ListItem>
          <ListItem button onClick={handleFavorites}>Favoritos</ListItem>
          <ListItem button onClick={handleLanguageChange}>
            {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
          </ListItem>
          {!auth.currentUser ? (
            <ListItem button onClick={handleLogin}>Iniciar Sesión</ListItem>
          ) : (
            <ListItem>Bienvenido, {auth.currentUser.displayName}</ListItem>
          )}
        </List>
      </Drawer>

      {/* Contenido de receta */}
      <div style={{ padding: '20px', paddingTop: `${appBarHeight + 32}px`, maxWidth: '800px', margin: 'auto' }}>
        {loading ? (
          <CircularProgress />
        ) : recipe ? (
          <>
            
            <Typography variant="h4" sx={{ color: '#FF5722', marginBottom: '20px', marginTop: '40px' }}>
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