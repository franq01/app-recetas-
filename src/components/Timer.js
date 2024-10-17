import React, { useState, useEffect } from 'react';
import { Button, Typography, TextField, Box } from '@mui/material';
import useSound from 'use-sound'; 
import '../App.css'; 


const StyledTextField = {
  marginBottom: '20px',
  width: '200px',
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

  
  const [play, { stop, error }] = useSound('/alarma.mp3', {
    volume: 1, 
    interrupt: true 
  });

  
  useEffect(() => {
    let timer;
    if (isActive && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
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

  
  const handleInputChange = (event) => {
    setInputTime(event.target.value);
  };

  
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginTop="30px">
      <Typography variant="h3" marginBottom="20px" color="primary">
        Temporizador
      </Typography>

      {/* Campo para que el usuario ingrese el tiempo en minutos */}
      <TextField
        label="Tiempo en minutos"
        variant="outlined"
        value={inputTime}
        onChange={handleInputChange}
        disabled={isActive} 
        sx={StyledTextField}
      />

      <Typography variant="h2" marginBottom="20px" color="secondary">
        {`${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`}
      </Typography>

      {/* Botón para iniciar o pausar el temporizador */}
      <Button
        variant="contained"
        color="primary"
        onClick={startTimer}
        disabled={isActive || !inputTime} // Deshabilitar si ya está en marcha o no hay tiempo ingresado
        style={{ marginBottom: '10px', width: '200px' }}
      >
        Iniciar
      </Button>

      {/* Botón para reiniciar */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={resetTimer}
        style={{ width: '200px' }}
      >
        Reiniciar
      </Button>

      {/* Botón para detener la alarma */}
      {isAlarmPlaying && (
        <Button
          variant="contained"
          color="error"
          onClick={stopAlarm}
          style={{ marginTop: '10px', width: '200px' }}
        >
          Detener Alarma
        </Button>
      )}
    </Box>
  );
};

export default Timer;
