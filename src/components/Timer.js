import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, TextField, Box } from '@mui/material';
import useSound from 'use-sound';
import { useNavigate } from 'react-router-dom';
import { auth } from '../context/firebaseConfig';

const StyledTextField = {
  marginBottom: '20px',
  width: '250px',  // Ajusté el tamaño del TextField
  '& input': {
    textAlign: 'center',
    fontSize: '24px',
  }
};

const Timer = () => {
  const [inputTime, setInputTime] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [play, { stop, error }] = useSound('/alarma.mp3', { volume: 1, interrupt: true });
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      play();
      setIsActive(false);
      setIsAlarmPlaying(true);
    }
    return () => clearInterval(timer);
  }, [isActive, seconds, play]);

  useEffect(() => {
    if (error) {
      console.error("Error al cargar el sonido:", error);
      alert("No se pudo reproducir el sonido. Por favor, verifica la ruta del archivo.");
    }
  }, [error]);

  const handleInputChange = (event) => setInputTime(event.target.value);

  const startTimer = () => {
    const timeInSeconds = parseInt(inputTime) * 60;
    if (!isNaN(timeInSeconds) && timeInSeconds > 0) {
      setSeconds(timeInSeconds);
      setIsActive(true);
      setIsAlarmPlaying(false);
    } else {
      alert("Por favor, ingresa un tiempo válido.");
    }
  };

  const resetTimer = () => {
    setInputTime('');
    setSeconds(0);
    setIsActive(false);
    setIsAlarmPlaying(false);
  };

  const stopAlarm = () => {
    stop();
    setIsAlarmPlaying(false);
  };

  const handleLogin = () => navigate('/login');
  const handleFavorites = () => navigate('/favorites');
  const handleHome = () => navigate('/home');

  return (
    <div>
      {/* Navbar flotante */}
      <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Recetas App</Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          <Button color="inherit" onClick={handleFavorites}>Favoritos</Button>
          
          {!auth.currentUser ? (
            <Button color="inherit" onClick={handleLogin}>Iniciar Sesión</Button>
          ) : (
            <Typography variant="body1" sx={{ ml: 2, color: 'white' }}>Bienvenido, {auth.currentUser.displayName}</Typography>
          )}
        </Toolbar>
      </AppBar>

      {/* Espaciado para evitar superposición */}
      <Toolbar />

      {/* Contenido del Timer */}
      <Box display="flex" flexDirection="column" alignItems="center" marginTop="120px">
        <Typography variant="h3" marginBottom="20px" color="black" sx={{ fontWeight: 'bold' }}>Temporizador</Typography>

        <TextField
          label="Tiempo en minutos"
          variant="outlined"
          value={inputTime}
          onChange={handleInputChange}
          disabled={isActive}
          sx={StyledTextField}
        />

        <Typography variant="h2" marginBottom="20px" color="black">
          {`${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={startTimer}
          disabled={isActive || !inputTime}
          sx={{
            marginBottom: '10px', 
            width: '250px',
            fontSize: '18px',
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            }
          }}
        >
          Iniciar
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={resetTimer}
          sx={{
            width: '250px', 
            fontSize: '18px', 
            borderColor: 'black', 
            color: 'black',
            '&:hover': {
              borderColor: '#333',
              color: '#333',
            }
          }}
        >
          Reiniciar
        </Button>

        {isAlarmPlaying && (
          <Button
            variant="contained"
            color="error"
            onClick={stopAlarm}
            sx={{
              marginTop: '10px', 
              width: '250px', 
              fontSize: '18px',
              backgroundColor: 'red',
              '&:hover': {
                backgroundColor: '#d32f2f',
              }
            }}
          >
            Detener Alarma
          </Button>
        )}
      </Box>
    </div>
  );
};

export default Timer;
