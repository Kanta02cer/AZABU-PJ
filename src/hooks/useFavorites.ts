import { useState, useEffect, useCallback } from 'react';

export function useFavorites(key: string = 'azabu_favorites') {
  const [favorites, setFavorites] = useState<(string | number)[]>(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(favorites));
  }, [favorites, key]);

  const toggleFavorite = useCallback((id: string | number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback((id: string | number) => {
    return favorites.includes(id);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
