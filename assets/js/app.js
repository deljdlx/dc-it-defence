// Point d'entrée principal de l'application
import { GameState } from './state/GameState.js';
import { GridRenderer } from './view/GridRenderer.js';
import { GameLoader } from './loaders/GameLoader.js';
import { GameClock } from './state/GameClock.js'; // Importer la classe GameClock

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
        
        // Initialiser l'horloge du jeu
        const gameClock = new GameClock({
            tickRate: 30, // 30 ticks logiques par seconde
            gameSpeed: 1.0 // Vitesse normale
        });
        
        // Configurer les fonctions de mise à jour et de rendu
        gameClock.subscribeToLogic((gameTime) => {
            // Mettre à jour l'état du jeu
            gameState.update(gameTime);
        });
        
        gameClock.subscribeToRender((renderTime) => {
            // Mettre à jour le rendu graphique
            gridRenderer.render();
        });
        
        // Effectuer le premier rendu
        gridRenderer.render();
        
        // Démarrer l'horloge du jeu
        gameClock.start();
        
        // Stocker une référence à l'horloge dans window pour y accéder depuis la console
        window.gameClock = gameClock;
        window.gameState = gameState;
        
        console.log('Jeu initialisé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du jeu:', error);
    }
});