import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box, Avatar, AppBar,
  Toolbar, } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth, storage } from '../context/firebaseConfig';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signOut, updateProfile } from 'firebase/auth'; // Importa la función para actualizar el perfil

const Profile = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false); // Para mostrar un cargando mientras se sube la imagen
  const user = auth.currentUser;

  useEffect(() => {
    // Observa el estado de autenticación para mantener la sesión activa
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setImageUrl(user.photoURL); // Si el usuario tiene una foto de Google, la usamos
      } else {
        setImageUrl('');
      }
    });

    return () => unsubscribe(); // Limpia el observador cuando el componente se desmonte
  }, []);

  const handleLogin = () => {
    navigate('/login'); // Redirige a la página de inicio de sesión
  };

  const handleDownloads = () => {
    navigate('/downloads'); // Redirige a las descargas
  };

  const handleTimer = () => {
    navigate('/timer'); //redirige  a timer
  };
  

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión en Firebase
      navigate('/login'); // Redirige a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  const handleImageUpload = (file) => {
    setLoading(true); // Activa el cargando cuando empiece la subida
    const storageRef = ref(storage, `profile_images/${auth.currentUser.uid}.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Aquí puedes agregar una barra de progreso si lo deseas
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL); // Guardar la URL de la imagen subida
          
          // Actualiza el perfil del usuario con la nueva foto
          updateProfile(user, {
            photoURL: downloadURL
          })
          .then(() => {
            console.log("Foto de perfil actualizada");
            setLoading(false); // Desactiva el cargando
          })
          .catch((error) => {
            console.error("Error al actualizar la foto de perfil:", error);
            setLoading(false);
          });
        });
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      handleImageUpload(file);
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
    
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#333',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            Recetas App
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 'bold',
              color: '#FFF',
              '&:hover': {
                backgroundColor: '#555',
              },
            }}
          >
            Home
          </Button>
        </Toolbar>
      </AppBar>


      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Mi Perfil
        </Typography>

        {user ? (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bienvenido, {getDisplayName()}
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Inicia Sesión
          </Typography>
        )}

        {!user && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mb: 2, backgroundColor: '#000000' }}
          >
            Iniciar Sesión
          </Button>
        )}

        {user && (
          <>
            <Avatar
              alt="Foto de perfil"
              src={imageUrl || user.photoURL || '/default-profile.jpg'} // Si no tiene foto de Google, se muestra la foto subida o una predeterminada
              sx={{ width: 100, height: 100, mb: 2 }}
            />

            {/* Si está logueado por correo, permite subir una imagen */}
            {user.providerData[0].providerId !== 'google.com' && (
              <Button
                variant="contained"
                color="primary"
                component="label"
                sx={{ mb: 2, backgroundColor: '#000000' }}
              >
                Subir Foto de Perfil
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            )}

            {/* Botón para cerrar sesión */}
            <Button
              variant="contained"
              
              onClick={handleLogout}
              sx={{ mb: 2, backgroundColor: '#000000' }}
            >
              Cerrar Sesión
            </Button>
          </>
        )}

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTimer}
            sx={{ backgroundColor: '#000000' }}
          >
            Cronómetro
          </Button>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloads}
          sx={{ backgroundColor: '#000000' }}
        >
          Mis Descargas
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;