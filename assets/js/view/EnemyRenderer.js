/**
 * Classe responsable du rendu visuel des ennemis
 */
export class EnemyRenderer {
    /**
     * @param {HTMLElement} gridContainer - Conteneur de la grille
     */
    constructor(gridContainer) {
        this.gridContainer = gridContainer;
        this.enemyElements = new Map(); // Map pour stocker les références aux éléments DOM des ennemis
    }

    /**
     * Crée un élément DOM pour un ennemi
     * @param {Enemy} enemy - L'ennemi à rendre
     * @returns {HTMLElement} L'élément DOM créé
     */
    createEnemyElement(enemy) {
        const { row, col } = enemy.getPosition();
        const enemyElement = document.createElement('div');
        
        // Classes CSS de base pour un ennemi
        enemyElement.classList.add('enemy');
        enemyElement.classList.add(enemy.getCssClass());
        enemyElement.dataset.id = enemy.id;
        enemyElement.dataset.level = enemy.getLevel();
        enemyElement.dataset.type = enemy.getType().id;
        
        // Créer la représentation visuelle interne
        const innerElement = document.createElement('div');
        innerElement.classList.add('enemy-inner');
        
        // Ajouter un indicateur de niveau si > 1
        if (enemy.getLevel() > 1) {
            const levelIndicator = document.createElement('span');
            levelIndicator.classList.add('enemy-level');
            levelIndicator.textContent = enemy.getLevel();
            enemyElement.appendChild(levelIndicator);
        }
        
        // Créer la barre de vie
        const healthBar = document.createElement('div');
        healthBar.classList.add('enemy-health-bar');
        
        const healthFill = document.createElement('div');
        healthFill.classList.add('enemy-health-fill');
        healthFill.style.width = `${enemy.getHealthPercentage()}%`;
        
        healthBar.appendChild(healthFill);
        
        // Assembler les éléments
        enemyElement.appendChild(innerElement);
        enemyElement.appendChild(healthBar);
        
        // Ajouter des attributs pour les infobulles
        enemyElement.title = this.generateEnemyTooltip(enemy);
        enemyElement.setAttribute('aria-label', enemy.getDisplayName());
        
        return enemyElement;
    }
    
    /**
     * Génère le texte d'infobulle pour un ennemi
     * @param {Enemy} enemy - L'ennemi
     * @returns {string} Le texte d'infobulle
     */
    generateEnemyTooltip(enemy) {
        let tooltip = `${enemy.getDisplayName()}\n`;
        tooltip += `Santé: ${Math.floor(enemy.getHealth())}/${Math.floor(enemy.calculateMaxHealth())}\n`;
        
        // Ajouter des informations sur les résistances si elles existent
        const resistance = enemy.resistance;
        if (resistance && Object.keys(resistance).length > 0) {
            tooltip += '\nRésistances:\n';
            
            for (const [skillType, value] of Object.entries(resistance)) {
                if (value > 0) {
                    tooltip += `- ${skillType}: ${Math.floor(value * 100)}%\n`;
                }
            }
        }
        
        return tooltip;
    }
    
    /**
     * Place un ennemi sur la grille
     * @param {Enemy} enemy - L'ennemi à placer
     */
    renderEnemy(enemy) {
        if (!enemy || !enemy.isEnemyAlive()) return;
        
        const { row, col } = enemy.getPosition();
        const cellElement = this.getCellElement(row, col);
        
        if (!cellElement) return;
        
        // Vérifier si l'ennemi existe déjà dans notre map
        let enemyElement = this.enemyElements.get(enemy.id);
        
        if (enemyElement) {
            // Mettre à jour l'ennemi existant
            this.updateEnemyElement(enemy, enemyElement);
        } else {
            // Créer un nouvel élément pour l'ennemi
            enemyElement = this.createEnemyElement(enemy);
            cellElement.appendChild(enemyElement);
            this.enemyElements.set(enemy.id, enemyElement);
        }
    }
    
    /**
     * Met à jour l'élément d'un ennemi existant
     * @param {Enemy} enemy - L'ennemi à mettre à jour
     * @param {HTMLElement} enemyElement - L'élément HTML de l'ennemi
     */
    updateEnemyElement(enemy, enemyElement) {
        if (!enemy || !enemy.isEnemyAlive() || !enemyElement) return;
        
        // Mettre à jour la barre de vie
        const healthFill = enemyElement.querySelector('.enemy-health-fill');
        if (healthFill) {
            healthFill.style.width = `${enemy.getHealthPercentage()}%`;
            
            // Ajouter des classes pour indiquer l'état de santé
            const healthPercentage = enemy.getHealthPercentage();
            healthFill.classList.remove('low-health', 'medium-health', 'high-health');
            
            if (healthPercentage < 25) {
                healthFill.classList.add('low-health');
            } else if (healthPercentage < 60) {
                healthFill.classList.add('medium-health');
            } else {
                healthFill.classList.add('high-health');
            }
        }
        
        // Mettre à jour l'infobulle
        enemyElement.title = this.generateEnemyTooltip(enemy);
        
        // Mettre à jour la position si nécessaire
        const { row, col } = enemy.getPosition();
        const cellElement = this.getCellElement(row, col);
        
        if (cellElement && enemyElement.parentElement !== cellElement) {
            if (enemyElement.parentElement) {
                enemyElement.parentElement.removeChild(enemyElement);
            }
            cellElement.appendChild(enemyElement);
        }
    }
    
    /**
     * Supprime un ennemi de la grille
     * @param {string} enemyId - L'ID de l'ennemi à supprimer
     * @returns {boolean} True si la suppression a réussi
     */
    removeEnemy(enemyId) {
        const enemyElement = this.enemyElements.get(enemyId);
        
        if (enemyElement && enemyElement.parentElement) {
            enemyElement.parentElement.removeChild(enemyElement);
            this.enemyElements.delete(enemyId);
            return true;
        }
        
        return false;
    }
    
    /**
     * Récupère l'élément de cellule à une position donnée
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {HTMLElement|null} L'élément de cellule ou null
     */
    getCellElement(row, col) {
        return this.gridContainer.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    }
}