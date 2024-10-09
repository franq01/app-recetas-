
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './ RecipeCard'; 
import axios from 'axios';
import { auth } from '../context/firebaseConfig'; 

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiKey = '0a959868b08f4afa952c894371f1899e'; 

  const handleLogin = () => {
    navigate('/login');
  };

  const handleTimer = () => {
    navigate('/timer');
  };


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/random?number=10&apiKey=${apiKey}`
        );
        console.log('Recetas obtenidas:', response.data.recipes); 
        setRecipes(response.data.recipes);
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false); 
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recetas App
          </Typography>
         
          <Button color="inherit" onClick={handleTimer}>
            Cronómetro
          </Button>
          
          {!auth.currentUser ? (
            <Button color="inherit" onClick={handleLogin}>
              Iniciar Sesión
            </Button>
          ) : (
            <Typography variant="body1">Bienvenido, {auth.currentUser.displayName || auth.currentUser.email}</Typography>
          )}
        </Toolbar>
      </AppBar>

      
      <Container>
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
