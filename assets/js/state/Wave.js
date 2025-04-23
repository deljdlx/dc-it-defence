/**
 * Classe représentant une vague d'ennemis
 */
import { Enemy } from './Enemy.js';

export class Wave {
    /**
     * @param {Object} waveData - Données de configuration de la vague
     * @param {Array} enemyTypes - Types d'ennemis disponibles
     */
    constructor(waveData, enemyTypes) {
        this.id = waveData.id;
        this.name = waveData.name || `Vague ${this.id}`;
        this.enemyTypes = enemyTypes;
        this.enemyTypesMap = new Map();
        
        // Créer un Map pour un accès rapide aux types d'ennemis par ID
        for (const enemyType of enemyTypes) {
            this.enemyTypesMap.set(enemyType.id, enemyType);
        }
        
        this.enemies = []; // Liste des ennemis actifs
        this.pendingEnemies = []; // Liste des ennemis en attente de spawn
        this.spawnPoints = waveData.spawnPoints || []; // Points d'apparition
        this.spawnInterval = waveData.spawnInterval || 2000; // Temps entre les spawns en ms
        this.lastSpawnTime = 0; // Horodatage du dernier spawn
        this.isActive = false;
        this.isCompleted = false;
        this.enemiesDefeated = 0;
        this.totalEnemies = 0;
        
        // Initialiser les ennemis en attente
        this.initPendingEnemies(waveData.enemies);
    }
    
    /**
     * Initialise la liste des ennemis en attente à partir des données de configuration
     * @param {Array} enemiesData - Données des ennemis à créer
     */
    initPendingEnemies(enemiesData) {
        // Réinitialiser les compteurs
        this.pendingEnemies = [];
        this.totalEnemies = enemiesData.length;
        
        // Créer la liste des ennemis à faire apparaître
        for (const enemyData of enemiesData) {
            const enemyType = this.enemyTypesMap.get(enemyData.type);
            if (enemyType) {
                this.pendingEnemies.push({
                    type: enemyType,
                    level: enemyData.level || 1,
                    spawnPoint: enemyData.spawnPoint || 0
                });
            }
        }
    }
    
    /**
     * Démarre la vague
     */
    start() {
        this.isActive = true;
        this.isCompleted = false;
        this.lastSpawnTime = Date.now();
    }
    
    /**
     * Met à jour l'état de la vague
     * @param {number} currentTime - Horodatage actuel
     * @returns {Enemy|null} Nouvel ennemi créé ou null
     */
    update(currentTime) {
        // Si la vague est inactive ou terminée, ne rien faire
        if (!this.isActive || this.isCompleted) {
            return null;
        }
        
        // Vérifier s'il est temps de faire apparaître un nouvel ennemi
        if (this.pendingEnemies.length > 0 && 
            (currentTime - this.lastSpawnTime) >= this.spawnInterval) {
            
            const enemyInfo = this.pendingEnemies.shift();
            const spawnPoint = this.spawnPoints[enemyInfo.spawnPoint] || this.spawnPoints[0];
            
            if (spawnPoint) {
                // Créer un nouvel ennemi
                const enemy = new Enemy(
                    enemyInfo.type,
                    spawnPoint.row,
                    spawnPoint.col,
                    enemyInfo.level
                );
                
                // Ajouter l'ennemi à la liste des ennemis actifs
                this.enemies.push(enemy);
                
                // Mettre à jour l'horodatage du dernier spawn
                this.lastSpawnTime = currentTime;
                
                return enemy;
            }
        }
        
        // Vérifier si la vague est terminée (tous les ennemis ont été créés et vaincus)
        if (this.pendingEnemies.length === 0 && this.enemies.length === 0) {
            this.isCompleted = true;
            this.isActive = false;
        }
        
        return null;
    }
    
    /**
     * Notifie la vague qu'un ennemi a été vaincu
     * @param {Enemy} enemy - L'ennemi vaincu
     */
    enemyDefeated(enemy) {
        // Supprimer l'ennemi de la liste des ennemis actifs
        const index = this.enemies.findIndex(e => e.id === enemy.id);
        if (index !== -1) {
            this.enemies.splice(index, 1);
            this.enemiesDefeated++;
        }
    }
    
    /**
     * Récupère la liste des ennemis actifs
     * @returns {Array<Enemy>} La liste des ennemis
     */
    getEnemies() {
        return this.enemies;
    }
    
    /**
     * Récupère le nom de la vague
     * @returns {string} Le nom de la vague
     */
    getName() {
        return this.name;
    }
    
    /**
     * Récupère l'ID de la vague
     * @returns {number} L'ID de la vague
     */
    getId() {
        return this.id;
    }
    
    /**
     * Vérifie si la vague est active
     * @returns {boolean} True si la vague est active
     */
    isWaveActive() {
        return this.isActive;
    }
    
    /**
     * Vérifie si la vague est terminée
     * @returns {boolean} True si la vague est terminée
     */
    isWaveCompleted() {
        return this.isCompleted;
    }
    
    /**
     * Récupère le pourcentage de progression de la vague
     * @returns {number} Pourcentage de progression (0-100)
     */
    getProgressPercentage() {
        if (this.totalEnemies === 0) return 0;
        return (this.enemiesDefeated / this.totalEnemies) * 100;
    }
}