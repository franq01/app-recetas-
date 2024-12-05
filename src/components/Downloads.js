import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
} from '@mui/material';

const MyDownloads = () => {
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const storedDownloads = JSON.parse(localStorage.getItem('downloads')) || [];
    setDownloads(storedDownloads);
  }, []);

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Mis Descargas
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Inicio
          </Button>
          <Button color="inherit" onClick={() => navigate('/favorites')}>
            Favoritos
          </Button>
          <Button color="inherit" onClick={() => navigate('/profile')}>
            Mi Perfil
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido de Descargas */}
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tus recetas descargadas:
        </Typography>
        {downloads.length > 0 ? (
          <Grid container spacing={2}>
            {downloads.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} key={recipe.id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    margin: 'auto',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.image}
                    alt={recipe.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {recipe.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {recipe.summary
                        ? recipe.summary.substring(0, 100) + '...'
                        : 'Sin descripción disponible.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No tienes recetas descargadas aún.
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default MyDownloads;
