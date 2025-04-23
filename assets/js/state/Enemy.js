/**
 * Classe représentant un ennemi (ticket) dans le jeu
 */
export class Enemy {
    /**
     * @param {Object} enemyType - Type d'ennemi (données depuis le JSON)
     * @param {number} startRow - Position ligne de départ dans la grille
     * @param {number} startCol - Position colonne de départ dans la grille
     * @param {number} [level=1] - Niveau de difficulté de l'ennemi
     */
    constructor(enemyType, startRow, startCol, level = 1) {
        this.type = enemyType;
        this.id = Math.random().toString(36).substring(2, 9); // ID unique
        this.row = startRow;
        this.col = startCol;
        this.level = level;
        this.health = this.calculateMaxHealth();
        this.speed = enemyType.speed;
        this.isAlive = true;
        this.reward = enemyType.reward * level;
        this.targetType = enemyType.type; // Type de ticket (frontend, backend, etc.)
        this.resistance = enemyType.resistance || {}; // Résistances aux différentes compétences
    }

    /**
     * Calcule les points de vie maximum de l'ennemi en fonction de son niveau
     * @returns {number} Points de vie maximum
     */
    calculateMaxHealth() {
        return this.type.health * Math.pow(1.2, this.level - 1);
    }

    /**
     * Récupère la position actuelle de l'ennemi
     * @returns {Object} La position {row, col}
     */
    getPosition() {
        return {
            row: this.row,
            col: this.col
        };
    }

    /**
     * Récupère le type d'ennemi
     * @returns {Object} Le type d'ennemi
     */
    getType() {
        return this.type;
    }

    /**
     * Récupère le niveau de l'ennemi
     * @returns {number} Le niveau
     */
    getLevel() {
        return this.level;
    }

    /**
     * Récupère les points de vie actuels de l'ennemi
     * @returns {number} Points de vie
     */
    getHealth() {
        return this.health;
    }

    /**
     * Récupère le pourcentage de vie restant
     * @returns {number} Pourcentage de vie (0-100)
     */
    getHealthPercentage() {
        return (this.health / this.calculateMaxHealth()) * 100;
    }

    /**
     * Inflige des dégâts à l'ennemi
     * @param {number} amount - Quantité de dégâts
     * @param {string} [skillType] - Type de compétence utilisée pour les dégâts
     * @returns {boolean} True si l'ennemi est toujours en vie
     */
    takeDamage(amount, skillType = null) {
        // Appliquer la résistance si un type de compétence est spécifié
        if (skillType && this.resistance[skillType]) {
            amount *= (1 - this.resistance[skillType]);
        }

        this.health -= Math.max(1, amount); // Au moins 1 point de dégâts
        
        if (this.health <= 0) {
            this.isAlive = false;
            this.health = 0;
            return false;
        }
        
        return true;
    }

    /**
     * Vérifie si l'ennemi est toujours en vie
     * @returns {boolean} True si l'ennemi est en vie
     */
    isEnemyAlive() {
        return this.isAlive;
    }

    /**
     * Récupère la récompense pour avoir vaincu cet ennemi
     * @returns {number} La récompense
     */
    getReward() {
        return this.reward;
    }

    /**
     * Récupère la classe CSS associée à cet ennemi
     * @returns {string} La classe CSS
     */
    getCssClass() {
        return this.type.cssClass;
    }

    /**
     * Récupère le nom d'affichage de l'ennemi
     * @returns {string} Le nom d'affichage
     */
    getDisplayName() {
        return `${this.type.label}${this.level > 1 ? ` Nv.${this.level}` : ''}`;
    }
}