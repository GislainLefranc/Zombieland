// Dossier : src/hooks, Fichier : useSelection.ts
// Ce hook permet de gérer la sélection d'éléments dans une liste en stockant les IDs sélectionnés dans un Set.

import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer la sélection d'éléments.
 * @template T - Type des éléments ayant une propriété id.
 */
export const useSelection = <T extends { id: number }>() => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  /**
   * Bascule la sélection d'un élément : ajoute si non sélectionné, supprime sinon.
   * @param item - Élément dont on souhaite basculer la sélection.
   */
  const toggleSelection = useCallback((item: T) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) {
        newSet.delete(item.id);
      } else {
        newSet.add(item.id);
      }
      return newSet;
    });
  }, []);

  /**
   * Efface toutes les sélections.
   */
  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  /**
   * Vérifie si un élément est sélectionné.
   * @param id - ID de l'élément à vérifier.
   */
  const isSelected = useCallback((id: number) => selectedItems.has(id), [selectedItems]);

  return {
    selectedItems: Array.from(selectedItems),
    toggleSelection,
    clearSelection,
    isSelected,
  };
};
