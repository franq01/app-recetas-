import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Typography, Grid, CircularProgress, IconButton, TextField } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import RecipeCard from './ RecipeCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../context/firebaseConfig';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para búsqueda
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  const apiKey = '0a959868b08f4afa952c894371f1899e'; // Clave API

  const handleLogin = () => navigate('/login');
  const handleTimer = () => navigate('/timer');
  const handleFavorites = () => navigate('/favorites');

  // Búsqueda de recetas según el término
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&number=10&apiKey=${apiKey}`
        );
        setRecipes(response.data.results || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchTerm]);

  return (
    <div>
      {/* Navbar flotante y responsivo */}
      <AppBar position="fixed" sx={{ backgroundColor: '#FF5722' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recetas App
          </Typography>

          {/* Campo de búsqueda */}
          <TextField
            variant="outlined"
            placeholder="Buscar recetas"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ backgroundColor: '#FFF', borderRadius: '4px', width: '250px', marginRight: '10px' }}
          />

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

          {/* Iniciar sesión o mostrar nombre del usuario */}
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

      {/* Espaciado para que el contenido no quede bajo el AppBar */}
      <Toolbar />

      {/* Contenido: Lista de recetas */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Recetas Populares
        </Typography>

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
                No se encontraron recetas. Intenta con otro término de búsqueda.
              </Typography>
            )}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Home;
