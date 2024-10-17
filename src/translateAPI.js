

import axios from 'axios';

export const translateText = async (text, targetLang) => {
  const apiKey = 'AIzaSyA7NCYaRRGpWwqHUBOJ0kBLcisVDWqjHzI'; 
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

  const body = {
    q: text,
    target: targetLang,
  };

  try {
    const response = await axios.post(url, body);
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error al traducir:', error);
    return null; 
  }
};
