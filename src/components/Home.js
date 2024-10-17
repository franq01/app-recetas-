import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Typography, Grid, CircularProgress, IconButton, TextField, Drawer, List, ListItem } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import RecipeCard from './ RecipeCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../context/firebaseConfig';
import MenuIcon from '@mui/icons-material/Menu'; 

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [drawerOpen, setDrawerOpen] = useState(false); 

  const apiKey = '0a959868b08f4afa952c894371f1899e';

  const handleLogin = () => navigate('/login');
  const handleTimer = () => navigate('/timer');
  const handleFavorites = () => navigate('/favorites');

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

  
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div>
      
      <AppBar position="fixed" sx={{ backgroundColor: '#FF5722' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recetas App
          </Typography>

         
          <TextField
            variant="outlined"
            placeholder="Buscar recetas"
            value={searchTerm}
            onChange={handleSearchChange}
            size="small"
            sx={{ 
              backgroundColor: '#FFF', 
              borderRadius: '4px', 
              flexGrow: 1,
              maxWidth: '400px', 
              marginRight: '10px' 
            }}
          />

          
{auth.currentUser ? (
            <Typography variant="body1" sx={{ ml: 2 }}>
              Bienvenido, {auth.currentUser.displayName}
            </Typography>
          ) : (
            <Button color="inherit" onClick={handleLogin}>
              Iniciar Sesión
            </Button>
          )}

          
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
