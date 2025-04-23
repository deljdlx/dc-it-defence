/**
 * Classe représentant une tour dans le jeu
 * Dans notre contexte, représente un développeur
 */
import { Skill } from './Skill.js';

export class Tower {
    /**
     * @param {Object} towerType - Type de tour (données depuis le JSON)
     * @param {number} row - Position ligne dans la grille
     * @param {number} col - Position colonne dans la grille
     * @param {Array<Skill>} skills - Les compétences associées à cette tour
     */
    constructor(towerType, row, col, skills = []) {
        this.type = towerType;
        this.row = row;
        this.col = col;
        this.level = 1; // Niveau global du développeur
        this.currentCooldown = 0;
        this.skills = skills; // Tableau d'objets Skill, chacun avec son propre niveau
        this.cost = towerType.cost;
        this.activeSkillIndex = 0;
        this.lastAttackTime = 0;
        this.maxLevel = 10; // Niveau maximum du développeur
    }

    /**
     * Récupère la position de la tour
     * @returns {Object} La position {row, col}
     */
    getPosition() {
        return {
            row: this.row,
            col: this.col
        };
    }

    /**
     * Récupère les propriétés du type de tour
     * @returns {Object} Le type de tour
     */
    getType() {
        return this.type;
    }

    /**
     * Récupère le niveau actuel de la tour
     * @returns {number} Le niveau
     */
    getLevel() {
        return this.level;
    }

    /**
     * Récupère toutes les compétences de la tour
     * @returns {Array<Skill>} Les compétences
     */
    getSkills() {
        return this.skills;
    }

    /**
     * Ajoute une compétence à la tour
     * @param {Skill} skill - La compétence à ajouter
     */
    addSkill(skill) {
        this.skills.push(skill);
    }

    /**
     * Récupère la compétence active
     * @returns {Skill|null} La compétence active ou null si aucune
     */
    getActiveSkill() {
        return this.skills.length > 0 ? this.skills[this.activeSkillIndex] : null;
    }

    /**
     * Change la compétence active
     * @param {number} index - L'index de la nouvelle compétence active
     * @returns {boolean} True si le changement a réussi
     */
    setActiveSkill(index) {
        if (index >= 0 && index < this.skills.length) {
            this.activeSkillIndex = index;
            return true;
        }
        return false;
    }

    /**
     * Récupère la portée de la tour (basée sur la compétence active)
     * @returns {number} La portée
     */
    getRange() {
        const activeSkill = this.getActiveSkill();
        if (!activeSkill) return 0;
        
        // Le niveau global du développeur augmente légèrement la portée
        const developerBonus = 1 + (this.level - 1) * 0.05;
        return activeSkill.getRange() * developerBonus;
    }

    /**
     * Récupère les dégâts de la tour (basés sur la compétence active)
     * @returns {number} Les dégâts
     */
    getDamage() {
        const activeSkill = this.getActiveSkill();
        if (!activeSkill) return 0;
        
        // Le niveau global du développeur augmente légèrement les dégâts
        const developerBonus = 1 + (this.level - 1) * 0.1;
        return activeSkill.getDamage() * developerBonus;
    }

    /**
     * Récupère le temps de recharge de la tour (basé sur la compétence active)
     * @returns {number} Le temps de recharge en millisecondes
     */
    getCooldown() {
        const activeSkill = this.getActiveSkill();
        if (!activeSkill) return 0;
        
        // Le niveau global du développeur réduit légèrement le cooldown
        const developerBonus = Math.max(0.8, 1 - (this.level - 1) * 0.05);
        return Math.floor(activeSkill.getCooldown() * developerBonus);
    }

    /**
     * Vérifie si la tour est prête à attaquer
     * @param {number} currentTime - Le timestamp actuel
     * @returns {boolean} True si la tour est prête à attaquer
     */
    isReadyToAttack(currentTime) {
        return (currentTime - this.lastAttackTime) >= this.getCooldown();
    }

    /**
     * Réinitialise le cooldown après une attaque
     * @param {number} currentTime - Le timestamp actuel
     */
    resetCooldown(currentTime) {
        this.lastAttackTime = currentTime;
    }

    /**
     * Améliore le niveau d'une compétence spécifique
     * @param {number} skillIndex - L'index de la compétence à améliorer
     * @returns {boolean} True si l'amélioration a réussi
     */
    upgradeSkill(skillIndex) {
        if (skillIndex >= 0 && skillIndex < this.skills.length) {
            return this.skills[skillIndex].upgrade();
        }
        return false;
    }

    /**
     * Améliore la tour d'un niveau global
     * @returns {boolean} True si l'amélioration a réussi
     */
    upgrade() {
        if (this.level < this.maxLevel) {
            this.level++;
            return true;
        }
        return false;
    }

    /**
     * Récupère le coût d'amélioration d'une compétence spécifique
     * @param {number} skillIndex - L'index de la compétence
     * @returns {number} Le coût d'amélioration
     */
    getSkillUpgradeCost(skillIndex) {
        if (skillIndex >= 0 && skillIndex < this.skills.length) {
            return this.skills[skillIndex].getUpgradeCost();
        }
        return 0;
    }

    /**
     * Récupère le coût d'amélioration du niveau global de la tour
     * @returns {number} Le coût d'amélioration
     */
    getUpgradeCost() {
        // Le coût d'amélioration global est plus élevé que celui des compétences individuelles
        return Math.floor(this.cost * 0.7 * Math.pow(1.5, this.level - 1));
    }

    /**
     * Récupère la classe CSS associée à cette tour
     * @returns {string} La classe CSS
     */
    getCssClass() {
        return this.type.cssClass;
    }

    /**
     * Récupère le nom d'affichage de la tour
     * @returns {string} Le nom d'affichage
     */
    getDisplayName() {
        const activeSkill = this.getActiveSkill();
        return `${this.type.label} Nv.${this.level}${activeSkill ? ` [${activeSkill.getDisplayName()}]` : ''}`;
    }
    
    /**
     * Calcule les dégâts effectifs contre un type d'ennemi spécifique
     * @param {string} enemyType - Le type d'ennemi
     * @returns {number} Les dégâts effectifs
     */
    getEffectiveDamage(enemyType) {
        const activeSkill = this.getActiveSkill();
        if (!activeSkill) return 0;
        
        // Le niveau global du développeur augmente légèrement les dégâts effectifs
        const developerBonus = 1 + (this.level - 1) * 0.1;
        return activeSkill.getEffectiveDamage(enemyType) * developerBonus;
    }

    /**
     * Trouve tous les ennemis à portée de la compétence active
     * @param {Array<Enemy>} enemies - Liste de tous les ennemis
     * @returns {Array<Enemy>} Les ennemis à portée
     */
    findEnemiesInRange(enemies) {
        const activeSkill = this.getActiveSkill();
        if (!activeSkill) return [];
        
        const range = this.getRange(); // Portée ajustée par le niveau de la tour
        const inRangeEnemies = [];
        
        for (const enemy of enemies) {
            if (!enemy.isEnemyAlive()) continue;
            
            // Calcul de la distance entre la tour et l'ennemi
            const distance = this.calculateDistance(enemy);
            
            // Si l'ennemi est à portée, l'ajouter à la liste
            if (distance <= range) {
                inRangeEnemies.push({
                    enemy: enemy,
                    distance: distance
                });
            }
        }
        
        // Trier les ennemis par distance (du plus proche au plus éloigné)
        return inRangeEnemies.sort((a, b) => a.distance - b.distance);
    }
    
    /**
     * Calcule la distance euclidienne entre la tour et un ennemi
     * @param {Enemy} enemy - L'ennemi dont on veut calculer la distance
     * @returns {number} La distance
     */
    calculateDistance(enemy) {
        const enemyPos = enemy.getPosition();
        const rowDiff = this.row - enemyPos.row;
        const colDiff = this.col - enemyPos.col;
        
        // Distance euclidienne (théorème de Pythagore)
        return Math.sqrt(rowDiff * rowDiff + colDiff * colDiff);
    }
    
    /**
     * Vérifie si un ennemi spécifique est à portée de la compétence active
     * @param {Enemy} enemy - L'ennemi à vérifier
     * @returns {boolean} True si l'ennemi est à portée
     */
    isEnemyInRange(enemy) {
        const range = this.getRange();
        const distance = this.calculateDistance(enemy);
        return distance <= range;
    }
    
    /**
     * Récupère l'ennemi le plus proche dans la portée
     * @param {Array<Enemy>} enemies - Liste de tous les ennemis
     * @returns {Enemy|null} L'ennemi le plus proche ou null si aucun n'est à portée
     */
    findClosestEnemy(enemies) {
        const inRangeEnemies = this.findEnemiesInRange(enemies);
        return inRangeEnemies.length > 0 ? inRangeEnemies[0].enemy : null;
    }
}