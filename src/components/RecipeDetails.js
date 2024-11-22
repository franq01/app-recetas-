import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import axios from 'axios';
import { auth, db } from '../context/firebaseConfig';
import { doc, setDoc, arrayUnion } from 'firebase/firestore';
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
        try {
          if (language === 'es') {
            const titleTranslation = await translateText(recipe.title, 'es');
            const instructionsTranslation = await translateText(recipe.instructions, 'es');
            setTranslatedTitle(titleTranslation);
            setTranslatedInstructions(instructionsTranslation);
          } else {
            setTranslatedTitle(recipe.title);
            setTranslatedInstructions(recipe.instructions);
          }
        } catch (error) {
          console.error('Error translating recipe:', error);
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

  const addToFavorites = async () => {
    if (!auth.currentUser) {
      alert('Please log in to add to favorites');
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid); // Usuario autenticado
      await setDoc(userRef, {
        favorites: arrayUnion(recipe), // Agregar la receta a los favoritos del usuario
      }, { merge: true });

      alert('Recipe added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Error adding recipe to favorites');
    }
  };

  const appBarHeight = 64;

  return (
    <div
      style={{
        backgroundColor: '#F0F0F0',
        minHeight: '100vh',
        paddingBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* NavBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#333',
          height: `${appBarHeight}px`,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', color: '#FFF', fontWeight: 'bold' }}
          >
            Recetas App
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '10px' }}>
            <Button color="inherit" onClick={handleFavorites} sx={{ fontWeight: 'bold', color: '#FFF' }}>
              Favoritos
            </Button>
            <Button color="inherit" onClick={handleTimer} sx={{ fontWeight: 'bold', color: '#FFF' }}>
              Cronómetro
            </Button>
            <Button color="inherit" onClick={handleLanguageChange} sx={{ fontWeight: 'bold', color: '#FFF' }}>
              {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
            </Button>
            {auth.currentUser ? (
              <Typography variant="body1" sx={{ ml: 2, fontWeight: 'bold', color: '#FFF' }}>
                Bienvenido, {auth.currentUser.displayName}
              </Typography>
            ) : (
              <Button color="inherit" onClick={handleLogin} sx={{ fontWeight: 'bold', color: '#FFF' }}>
                Iniciar Sesión
              </Button>
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
        <List sx={{ width: 250, backgroundColor: '#F0F0F0' }}>
          <ListItem button onClick={handleTimer}>
            Cronómetro
          </ListItem>
          <ListItem button onClick={handleFavorites}>
            Favoritos
          </ListItem>
          <ListItem button onClick={handleLanguageChange}>
            {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
          </ListItem>
          {!auth.currentUser ? (
            <ListItem button onClick={handleLogin}>
              Iniciar Sesión
            </ListItem>
          ) : (
            <ListItem>
              Bienvenido, {auth.currentUser.displayName}
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* Contenido de receta */}
      <div
        style={{
          padding: '20px',
          paddingTop: `${appBarHeight + 32}px`,
          maxWidth: '800px',
          width: '100%',
          margin: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : recipe ? (
          <>
            <Typography
              variant="h4"
              sx={{
                color: '#333',
                marginBottom: '20px',
                marginTop: '40px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              {translatedTitle}
            </Typography>
            <img
              src={recipe.image}
              alt={translatedTitle}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
            <Typography
              variant="h5"
              sx={{ marginTop: '20px', color: '#333', fontWeight: 'bold' }}
            >
              Instrucciones
            </Typography>
            <Typography
              sx={{ marginTop: '10px', lineHeight: 1.5, textAlign: 'justify', color: '#000' }}
            >
              {translatedInstructions || 'No se proporcionaron instrucciones.'}
            </Typography>
            <Box sx={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={addToFavorites}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#333',
                  color: '#FFF',
                  '&:hover': {
                    backgroundColor: '#555',
                  },
                  padding: '10px 20px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                Agregar a Favoritos
              </Button>
            </Box>
          </>
        ) : (
          <Typography
            variant="h6"
            color="error"
            sx={{ textAlign: 'center', marginTop: '20px' }}
          >
            No se pudo cargar la receta.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
