/**
 * Classe responsable de la gestion de l'état du jeu
 * Cette classe est séparée de la logique d'affichage (Modèle dans MVC)
 */
import { Cell } from './Cell.js';
import { Tower } from './Tower.js';
import { Skill } from './Skill.js';
import { Enemy } from './Enemy.js'; // Importer la classe Enemy

export class GameState {
    constructor(gameData) {
        this.gridData = gameData.map;
        this.cellTypes = gameData.cellTypes;
        this.cellTypesMap = new Map();
        this.grid = [];
        this.towers = [];
        this.towerTypes = gameData.towerTypes;
        this.towerTypesMap = new Map();
        this.skills = gameData.skills || [];
        this.skillsMap = new Map();
        this.enemies = []; // Tableau pour stocker les ennemis
        this.enemyTypes = gameData.enemyTypes || []; // Types d'ennemis depuis les données du jeu
        this.enemyTypesMap = new Map(); // Map pour accès rapide aux types d'ennemis
        
        // Créer un Map pour un accès rapide aux types de cellules par ID
        for (const cellType of this.cellTypes) {
            this.cellTypesMap.set(cellType.id, cellType);
        }
        
        // Créer un Map pour un accès rapide aux types de tours par ID
        for (const towerType of this.towerTypes) {
            this.towerTypesMap.set(towerType.id, towerType);
        }
        
        // Créer un Map pour un accès rapide aux compétences par ID
        for (const skillData of this.skills) {
            const skill = new Skill(skillData);
            this.skillsMap.set(skillData.id, skill);
        }
        
        // Créer un Map pour un accès rapide aux types d'ennemis par ID
        if (this.enemyTypes) {
            for (const enemyType of this.enemyTypes) {
                this.enemyTypesMap.set(enemyType.id, enemyType);
            }
        }
        
        // Initialiser la grille avec des objets Cell
        this.initializeGrid();
        
        // Charger les tours initiales si présentes
        if (gameData.initialTowers) {
            this.loadInitialTowers(gameData.initialTowers);
        }
        
        // Créer un ennemi de test pour l'affichage statique
        this.createTestEnemy();
    }
    
    /**
     * Initialise la grille avec des objets Cell
     */
    initializeGrid() {
        for (let row = 0; row < this.gridData.length; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridData[row].length; col++) {
                const cellTypeId = this.gridData[row][col];
                const cellType = this.cellTypesMap.get(cellTypeId);
                this.grid[row][col] = new Cell(row, col, cellType);
            }
        }
    }
    
    /**
     * Charge les tours initiales depuis les données du jeu
     * @param {Array} initialTowers - Les données des tours initiales
     */
    loadInitialTowers(initialTowers) {
        for (const towerData of initialTowers) {
            const towerType = this.towerTypesMap.get(towerData.type);
            if (towerType) {
                const { row, col } = towerData.position;
                this.addTower(towerType, row, col);
            }
        }
    }
    
    /**
     * Récupère une compétence par son ID
     * @param {string} skillId - L'ID de la compétence
     * @returns {Skill|null} La compétence ou null si non trouvée
     */
    getSkillById(skillId) {
        return this.skillsMap.get(skillId) || null;
    }
    
    /**
     * Récupère toutes les compétences pour un type de tour
     * @param {Object} towerType - Le type de tour
     * @returns {Array<Skill>} Les compétences associées à ce type de tour
     */
    getSkillsForTowerType(towerType) {
        const skills = [];
        
        if (towerType && towerType.skills) {
            for (const skillId of towerType.skills) {
                const skill = this.getSkillById(skillId);
                if (skill) {
                    skills.push(skill);
                }
            }
        }
        
        return skills;
    }
    
    /**
     * Ajoute une tour à une position donnée
     * @param {Object} towerType - Le type de tour
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {Tower|null} La tour créée ou null si l'ajout a échoué
     */
    addTower(towerType, row, col) {
        // Vérifier que la position est valide
        const cell = this.getCell(row, col);
        if (!cell || this.getTowerAt(row, col)) {
            return null;
        }
        
        // Récupérer les compétences pour ce type de tour
        const skills = this.getSkillsForTowerType(towerType);
        
        // Créer une nouvelle tour avec ses compétences
        const tower = new Tower(towerType, row, col, skills);
        this.towers.push(tower);
        
        return tower;
    }
    
    /**
     * Supprime une tour à une position donnée
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {boolean} True si la suppression a réussi
     */
    removeTower(row, col) {
        const towerIndex = this.towers.findIndex(
            tower => tower.row === row && tower.col === col
        );
        
        if (towerIndex !== -1) {
            this.towers.splice(towerIndex, 1);
            return true;
        }
        
        return false;
    }
    
    /**
     * Récupère une tour à une position donnée
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {Tower|null} La tour ou null si aucune tour n'est présente
     */
    getTowerAt(row, col) {
        return this.towers.find(tower => tower.row === row && tower.col === col) || null;
    }
    
    /**
     * Récupère toutes les tours
     * @returns {Array} Les tours
     */
    getAllTowers() {
        return this.towers;
    }
    
    /**
     * Récupère tous les types de tours
     * @returns {Array} Les types de tours
     */
    getTowerTypes() {
        return this.towerTypes;
    }
    
    /**
     * Récupère les dimensions de la grille
     * @returns {Object} Les dimensions {rows, cols}
     */
    getGridDimensions() {
        return {
            rows: this.grid.length,
            cols: this.grid[0].length
        };
    }
    
    /**
     * Récupère la cellule à une position donnée
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {Cell|null} La cellule ou null si la position est invalide
     */
    getCell(row, col) {
        // Vérifier que la position est valide
        if (row < 0 || row >= this.grid.length || col < 0 || col >= this.grid[0].length) {
            return null;
        }
        
        return this.grid[row][col];
    }
    
    /**
     * Récupère le type de cellule à une position donnée
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {Object|null} Le type de cellule ou null si la position est invalide
     */
    getCellType(row, col) {
        const cell = this.getCell(row, col);
        return cell ? cell.getType() : null;
    }
    
    /**
     * Vérifie si une cellule est traversable
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {boolean} True si la cellule est traversable, false sinon
     */
    isCellWalkable(row, col) {
        const cell = this.getCell(row, col);
        return cell ? cell.isWalkable() : false;
    }
    
    /**
     * Crée un ennemi de test pour l'affichage
     */
    createTestEnemy() {
        // S'assurer qu'il y a au moins un type d'ennemi
        if (this.enemyTypes.length === 0) {
            // Créer un type d'ennemi par défaut si aucun n'est défini
            const defaultEnemyType = {
                id: 'frontend_ticket',
                type: 'frontend',
                label: 'Ticket Frontend',
                cssClass: 'enemy-frontend',
                health: 100,
                speed: 1,
                reward: 10,
                resistance: { html_css: 0.2, javascript: 0 }
            };
            
            this.enemyTypes.push(defaultEnemyType);
            this.enemyTypesMap.set(defaultEnemyType.id, defaultEnemyType);
        }
        
        // Choisir un type d'ennemi (le premier disponible)
        const enemyType = this.enemyTypes[0];
        
        // Trouver une position valide sur un chemin (si possible)
        let startRow = 2; // Position par défaut
        let startCol = 2;
        
        // Chercher une cellule de chemin pour placer l'ennemi
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                const cell = this.getCell(row, col);
                if (cell && cell.isWalkable()) {
                    startRow = row;
                    startCol = col;
                    break;
                }
            }
        }
        
        // Créer et ajouter l'ennemi
        const enemy = new Enemy(enemyType, startRow, startCol, 1);
        this.enemies.push(enemy);
        
        return enemy;
    }
    
    /**
     * Ajoute un nouvel ennemi au jeu
     * @param {string} enemyTypeId - L'ID du type d'ennemi
     * @param {number} row - La ligne de départ
     * @param {number} col - La colonne de départ
     * @param {number} [level=1] - Le niveau de l'ennemi
     * @returns {Enemy|null} L'ennemi créé ou null si la création a échoué
     */
    addEnemy(enemyTypeId, row, col, level = 1) {
        const enemyType = this.enemyTypesMap.get(enemyTypeId);
        
        if (!enemyType) {
            console.error(`Type d'ennemi non trouvé: ${enemyTypeId}`);
            return null;
        }
        
        const cell = this.getCell(row, col);
        if (!cell || !cell.isWalkable()) {
            console.error(`Position invalide pour un ennemi: (${row}, ${col})`);
            return null;
        }
        
        const enemy = new Enemy(enemyType, row, col, level);
        this.enemies.push(enemy);
        
        return enemy;
    }
    
    /**
     * Récupère un ennemi par son ID
     * @param {string} enemyId - L'ID de l'ennemi
     * @returns {Enemy|null} L'ennemi trouvé ou null
     */
    getEnemyById(enemyId) {
        return this.enemies.find(enemy => enemy.id === enemyId) || null;
    }
    
    /**
     * Récupère tous les ennemis actifs
     * @returns {Array<Enemy>} Les ennemis actifs
     */
    getAllEnemies() {
        return this.enemies.filter(enemy => enemy.isEnemyAlive());
    }
    
    /**
     * Supprime un ennemi du jeu
     * @param {string} enemyId - L'ID de l'ennemi à supprimer
     * @returns {boolean} True si la suppression a réussi
     */
    removeEnemy(enemyId) {
        const enemyIndex = this.enemies.findIndex(enemy => enemy.id === enemyId);
        
        if (enemyIndex !== -1) {
            this.enemies.splice(enemyIndex, 1);
            return true;
        }
        
        return false;
    }
    
    /**
     * Trouve tous les ennemis à portée d'une tour spécifique
     * @param {Tower} tower - La tour pour laquelle rechercher des ennemis
     * @returns {Array} Les ennemis à portée, avec leur distance
     */
    findEnemiesInTowerRange(tower) {
        return tower.findEnemiesInRange(this.getAllEnemies());
    }
    
    /**
     * Trouve tous les ennemis à portée de chaque tour
     * @returns {Object} Un objet avec les tours comme clés et les ennemis à portée comme valeurs
     */
    findAllEnemiesInRange() {
        const result = {};
        
        for (const tower of this.towers) {
            result[tower.id] = this.findEnemiesInTowerRange(tower);
        }
        
        return result;
    }
    
    /**
     * Vérifie si un ennemi spécifique est à portée d'une tour
     * @param {Tower} tower - La tour
     * @param {Enemy} enemy - L'ennemi à vérifier
     * @returns {boolean} True si l'ennemi est à portée
     */
    isEnemyInTowerRange(tower, enemy) {
        return tower.isEnemyInRange(enemy);
    }
    
    /**
     * Trouve l'ennemi le plus proche dans la portée d'une tour
     * @param {Tower} tower - La tour
     * @returns {Enemy|null} L'ennemi le plus proche ou null si aucun n'est à portée
     */
    findClosestEnemyToTower(tower) {
        return tower.findClosestEnemy(this.getAllEnemies());
    }
    
    /**
     * Obtient toutes les données nécessaires pour le rendu
     * @returns {Object} Les données pour le rendu
     */
    getDataForRendering() {
        return {
            grid: this.grid,
            dimensions: this.getGridDimensions(),
            cellTypes: this.cellTypes,
            towers: this.towers,
            towerTypes: this.towerTypes,
            skills: this.skills,
            enemies: this.enemies, // Ajouter les ennemis aux données de rendu
            enemyTypes: this.enemyTypes
        };
    }
}