/**
 * Classe responsable du rendu visuel de la grille
 * Cette classe est séparée de la logique de données (Vue dans MVC)
 */
import { CellRenderer } from './CellRenderer.js';
import { TowerRenderer } from './TowerRenderer.js';
import { EnemyRenderer } from './EnemyRenderer.js';

export class GridRenderer {
    /**
     * @param {HTMLElement} container - L'élément DOM qui contiendra la grille
     * @param {GameState} gameState - L'état du jeu
     */
    constructor(container, gameState) {
        this.container = container;
        this.gameState = gameState;
        this.cellRenderer = new CellRenderer(container);
        this.towerRenderer = new TowerRenderer(container, gameState); // Passer gameState au TowerRenderer
        this.enemyRenderer = new EnemyRenderer(container); // Ajouter EnemyRenderer
        this.initialized = false;
    }
    
    /**
     * Initialise la grille dans le DOM
     */
    initialize() {
        if (this.initialized) return;
        
        const { rows, cols } = this.gameState.getGridDimensions();
        
        // Configurer le conteneur de la grille avec Grid CSS
        this.container.style.gridTemplateRows = `repeat(${rows}, 40px)`;
        this.container.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        
        // Créer les cellules
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = this.gameState.getCell(row, col);
                if (cell) {
                    const cellElement = this.cellRenderer.createCellElement(cell);
                    this.container.appendChild(cellElement);
                }
            }
        }
        
        this.initialized = true;
    }
    
    /**
     * Met à jour l'apparence des cellules en fonction de leur type
     */
    updateCells() {
        const { rows, cols } = this.gameState.getGridDimensions();
        
        // Pour chaque cellule, mettre à jour son apparence
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = this.gameState.getCell(row, col);
                if (cell) {
                    const cellElement = this.cellRenderer.getCellElement(row, col);
                    if (cellElement) {
                        this.cellRenderer.updateCellElement(cellElement, cell);
                    }
                }
            }
        }
    }
    
    /**
     * Rend les tours sur la grille
     */
    renderTowers() {
        const towers = this.gameState.getAllTowers();
        
        // Pour chaque tour, la rendre sur la grille
        for (const tower of towers) {
            const { row, col } = tower.getPosition();
            const cellElement = this.cellRenderer.getCellElement(row, col);
            
            if (cellElement && !cellElement.classList.contains('has-tower')) {
                this.towerRenderer.placeTowerOnCell(tower, cellElement);
            } else if (cellElement && cellElement.classList.contains('has-tower')) {
                this.towerRenderer.updateTowerElement(tower);
            }
        }
    }
    
    /**
     * Rend les ennemis sur la grille
     */
    renderEnemies() {
        const enemies = this.gameState.getAllEnemies();
        
        // Pour chaque ennemi, le rendre sur la grille
        for (const enemy of enemies) {
            if (enemy && enemy.isEnemyAlive()) {
                this.enemyRenderer.renderEnemy(enemy);
            }
        }
    }
    
    /**
     * Effectue le rendu complet de la grille
     */
    render() {
        // Initialiser si ce n'est pas déjà fait
        if (!this.initialized) {
            this.initialize();
        }
        
        // Mettre à jour l'apparence des cellules
        this.updateCells();
        
        // Rendre les tours
        this.renderTowers();
        
        // Rendre les ennemis
        this.renderEnemies();
    }
}