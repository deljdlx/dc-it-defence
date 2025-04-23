// Point d'entrée principal de l'application
import { GameState } from './state/GameState.js';
import { GridRenderer } from './view/GridRenderer.js';
import { GameLoader } from './loaders/GameLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Charger les données du jeu
        const gameLoader = new GameLoader();
        const gameData = await gameLoader.loadGameData();
        
        // Initialiser l'état du jeu
        const gameState = new GameState(gameData);
        
        // Initialiser le rendu
        const gridContainer = document.getElementById('grid-container');
        const gridRenderer = new GridRenderer(gridContainer, gameState);
        
        // Effectuer le premier rendu
        gridRenderer.render();
        
        console.log('Jeu initialisé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du jeu:', error);
    }
});