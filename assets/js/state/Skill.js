/**
 * Classe représentant une compétence d'une tour (développeur)
 */
export class Skill {
    /**
     * @param {Object} skillData - Les données de la compétence
     * @param {number} level - Le niveau initial de la compétence (par défaut 1)
     */
    constructor(skillData, level = 1) {
        this.id = skillData.id;
        this.name = skillData.name;
        this.label = skillData.label;
        this.damage = skillData.damage;
        this.range = skillData.range;
        this.cooldown = skillData.cooldown; // Temps de recharge en millisecondes
        this.description = skillData.description;
        this.cssClass = skillData.cssClass;
        this.targetType = skillData.targetType; // Type de ticket que cette compétence cible
        this.effectModifier = skillData.effectModifier || 1.0; // Modificateur d'effet contre certains types
        this.level = level; // Niveau de la compétence
        this.maxLevel = skillData.maxLevel || 10; // Niveau maximum par défaut
    }

    /**
     * Récupère l'identifiant de la compétence
     * @returns {string} L'identifiant
     */
    getId() {
        return this.id;
    }

    /**
     * Récupère le nom de la compétence
     * @returns {string} Le nom
     */
    getName() {
        return this.name;
    }

    /**
     * Récupère le label d'affichage de la compétence
     * @returns {string} Le label
     */
    getLabel() {
        return this.label;
    }

    /**
     * Récupère le niveau actuel de la compétence
     * @returns {number} Le niveau
     */
    getLevel() {
        return this.level;
    }

    /**
     * Récupère le niveau maximum de la compétence
     * @returns {number} Le niveau maximum
     */
    getMaxLevel() {
        return this.maxLevel;
    }

    /**
     * Augmente le niveau de la compétence
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
     * Récupère les dégâts de base de la compétence ajustés selon le niveau
     * @returns {number} Les dégâts
     */
    getDamage() {
        // Augmentation de 20% par niveau
        return this.damage * (1 + (this.level - 1) * 0.2);
    }

    /**
     * Récupère la portée de la compétence ajustée selon le niveau
     * @returns {number} La portée
     */
    getRange() {
        // Augmentation de 10% par niveau
        return this.range * (1 + (this.level - 1) * 0.1);
    }

    /**
     * Récupère le temps de recharge de la compétence ajusté selon le niveau
     * @returns {number} Le temps de recharge en ms
     */
    getCooldown() {
        // Réduction du cooldown de 8% par niveau (mais pas moins de 50% du cooldown initial)
        const reductionFactor = Math.max(0.5, 1 - (this.level - 1) * 0.08);
        return Math.floor(this.cooldown * reductionFactor);
    }

    /**
     * Récupère la description de la compétence
     * @returns {string} La description
     */
    getDescription() {
        return this.description;
    }

    /**
     * Récupère la classe CSS associée à cette compétence
     * @returns {string} La classe CSS
     */
    getCssClass() {
        return this.cssClass;
    }

    /**
     * Calcule les dégâts effectifs contre un type d'ennemi spécifique
     * @param {string} enemyType - Le type d'ennemi
     * @returns {number} Les dégâts effectifs
     */
    getEffectiveDamage(enemyType) {
        let damageMultiplier = 1;
        
        if (this.targetType === enemyType) {
            damageMultiplier = this.effectModifier;
        }
        
        return this.getDamage() * damageMultiplier;
    }

    /**
     * Récupère le nom d'affichage de la compétence avec son niveau
     * @returns {string} Le nom d'affichage
     */
    getDisplayName() {
        return `${this.label} Nv.${this.level}`;
    }

    /**
     * Récupère le coût d'amélioration de la compétence
     * @returns {number} Le coût d'amélioration
     */
    getUpgradeCost() {
        // Coût de base qui augmente avec le niveau
        const baseCost = 50;
        return Math.floor(baseCost * Math.pow(1.5, this.level - 1));
    }
}