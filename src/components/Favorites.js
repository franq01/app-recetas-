import React, { useState, useEffect } from 'react';
import { db, auth } from '../context/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RecipeCard from './ RecipeCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites);
        }
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>Mis Favoritos</h2>
      <div>
        {favorites.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
