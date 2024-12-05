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
  Snackbar,
  Alert,
} from '@mui/material';
import { Favorite, Menu as MenuIcon } from '@mui/icons-material';
import RecipeCard from './ RecipeCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../context/firebaseConfig';
import timer from './Timer';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1); // Página para la carga infinita
  const [showWarning, setShowWarning] = useState(false); // Para mostrar la advertencia de no estar logueado
  const navigate = useNavigate();

  const apiKey = '06f07715f2d840f6bc2545607431a95a';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&number=10&apiKey=${apiKey}&page=${page}`
        );
        setRecipes((prevRecipes) => [...prevRecipes, ...response.data.results]);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchTerm, page]);

  const handleLogin = () => navigate('/login');
  const handleProfile = () => navigate('/profile');
  const handleDownloads = () => navigate('/downloads');
  const handleTimer = () => navigate('/timer');
  const handleFavorites = () => navigate('/favorites');
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    document.title = newLanguage === 'es' ? 'Recetas Populares' : 'Popular Recipes';
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const loadMoreRecipes = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleAddFavorite = () => {
    if (!user) {
      setShowWarning(true);
    } else {
      // Lógica para agregar receta a favoritos
    }
  };

  // Obtener el nombre del usuario o el correo antes de la arroba si no tiene nombre
  const getDisplayName = () => {
    if (user) {
      return user.displayName || user.email.split('@')[0]; // Si no tiene displayName, muestra la parte antes del '@' del correo
    }
    return '';
  };

  return (
    <div>
      { /* Barra de navegación */ }
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
            {user ? `Recetas App - ${getDisplayName()}` : 'Recetas App'}
          </Typography>

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
              onClick={handleLanguageChange}
              sx={{ color: '#000000', textTransform: 'none', fontWeight: 'bold' }}
            >
              {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/timer')}
              sx={{ color: '#000000', textTransform: 'none', fontWeight: 'bold' }}
            >
              Cronómetro
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/profile')}
              sx={{ color: '#000000', textTransform: 'none', fontWeight: 'bold' }}
            >
              Mi Perfil
            </Button>
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
          <ListItem button onClick={handleDownloads}>Mis Descargas</ListItem>
          <ListItem button onClick={handleLanguageChange}>
            {language === 'en' ? 'Traducir a Español' : 'Switch to English'}
          </ListItem>
          {user ? (
            <ListItem button onClick={handleProfile}>Mi Perfil</ListItem>
          ) : (
            <ListItem button onClick={handleLogin}>Iniciar Sesión</ListItem>
          )}
        </List>
      </Drawer>

      <Toolbar />

      <Container sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#000000', fontWeight: 'bold' }}
        >
          {language === 'en' ? 'Popular Recipes' : 'Recetas Populares'}
        </Typography>

        {/* Buscador */}
        <TextField
          variant="outlined"
          fullWidth
          label="Buscar recetas"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
        />

        {loading && <CircularProgress />}
        
        <Grid container spacing={3}>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <RecipeCard recipe={recipe} language={language} onAddFavorite={handleAddFavorite} />
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="error">
              No se encontraron recetas. Intenta con otro término de búsqueda.
            </Typography>
          )}
        </Grid>

        {/* Mostrar más recetas al hacer scroll */}
        {!loading && (
          <Button onClick={loadMoreRecipes} variant="contained" sx={{ mt: 3 }}>
            Cargar más
          </Button>
        )}
      </Container>

      {/* Snackbar para advertencia si no está logueado */}
      <Snackbar
        open={showWarning}
        autoHideDuration={3000}
        onClose={() => setShowWarning(false)}
      >
        <Alert onClose={() => setShowWarning(false)} severity="warning" sx={{ width: '100%' }}>
          ¡Debes iniciar sesión para agregar a favoritos!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Home;