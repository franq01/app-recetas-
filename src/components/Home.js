import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  TextField,
  Drawer,
  List,
  ListItem,
} from '@mui/material';
import { Favorite, Menu as MenuIcon } from '@mui/icons-material';
import RecipeCard from './ RecipeCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../context/firebaseConfig';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const apiKey = '06f07715f2d840f6bc2545607431a95a';

  const handleLogin = () => navigate('/login');
  const handleTimer = () => navigate('/timer');
  const handleFavorites = () => navigate('/favorites');
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&number=10&apiKey=${apiKey}`
        );
        setRecipes(response.data.results || []);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchTerm]);

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.title = newLanguage === 'es' ? 'Recetas Populares' : 'Popular Recipes';
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <div>
      {/* NavBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', color: '#000000', fontWeight: 'bold' }}
          >
            Recetas App
          </Typography>

          {/* Buscador */}
          <TextField
            variant="outlined"
            placeholder="Buscar recetas"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              flexGrow: 1,
              maxWidth: '400px',
              marginRight: '10px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#000000',
                },
              },
            }}
          />

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '10px' }}>
            <Button
              color="inherit"
              onClick={handleFavorites}
              sx={{ color: '#000000', textTransform: 'none', fontWeight: 'bold' }}
            >
              Favoritos
            </Button>
            <Button
              color="inherit"
              onClick={handleTimer}
              sx={{ color: '#000000', textTransform: 'none', fontWeight: 'bold' }}
            >
              Cronómetro
            </Button>
            <Button
              color="inherit"
              onClick={handleLanguageChange}
              sx={{ color: '#000000', textTransform: 'none', fontWeight: 'bold' }}
            >
              {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
            </Button>
            {auth.currentUser ? (
              <Typography variant="body1" sx={{ ml: 2, color: '#000000' }}>
                Bienvenido, {auth.currentUser.displayName}
              </Typography>
            ) : (
              <Button
                color="inherit"
                onClick={handleLogin}
                sx={{ color: '#000000', textTransform: 'none', fontWeight: 'bold' }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>

          <IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: 'block', md: 'none' }, color: '#000000' }}
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

      <Toolbar />

      {/* Contenedor principal */}
      <Container sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#000000', fontWeight: 'bold' }}
        >
          {language === 'en' ? 'Popular Recipes' : 'Recetas Populares'}
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                  <RecipeCard recipe={recipe} language={language} />
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
