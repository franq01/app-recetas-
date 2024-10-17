// src/components/Timer.js
import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';

const Timer = () => {
  const [time, setTime] = useState(0); 
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Para el sonido de la alarma
  const alarmSound = new Audio('https://www.soundjay.com/button/beep-07.wav'); 

  useEffect(() => {
    let timer = null;

    if (isActive) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsActive(false);
            setIsFinished(true);
            alarmSound.play(); // Reproduce el sonido al terminar
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setIsFinished(false);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
    setIsFinished(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Cronómetro
        </Typography>
        <Typography variant="h2" component="div" gutterBottom>
          {isFinished ? '¡Tiempo!' : `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleStart} disabled={isActive || isFinished}>
          Iniciar
        </Button>
        <Button variant="contained" color="secondary" onClick={handleStop} disabled={!isActive}>
          Detener
        </Button>
        <Button variant="contained" onClick={handleReset}>
          Reiniciar
        </Button>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => setTime(time + 60)} disabled={isActive}>
            +1 Minuto
          </Button>
          <Button variant="outlined" onClick={() => setTime(time + 300)} disabled={isActive} sx={{ ml: 1 }}>
            +5 Minutos
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Timer;
