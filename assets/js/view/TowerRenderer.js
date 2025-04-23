/**
 * Classe responsable du rendu visuel des tours
 */
export class TowerRenderer {
    /**
     * @param {HTMLElement} gridContainer - Conteneur de la grille
     * @param {GameState} gameState - Référence à l'état du jeu
     */
    constructor(gridContainer, gameState) {
        this.gridContainer = gridContainer;
        this.gameState = gameState; // Référence à l'état du jeu
        this.rangeIndicators = new Map(); // Pour stocker les indicateurs de portée
        
        // Ajouter un gestionnaire d'événements au conteneur de la grille
        this.setupEventListeners();
    }
    
    /**
     * Configure les gestionnaires d'événements pour les tours
     */
    setupEventListeners() {
        // Délégation d'événements pour éviter d'attacher trop d'écouteurs
        this.gridContainer.addEventListener('mouseenter', (event) => {
            const towerElement = this.findTowerElement(event.target);
            if (towerElement) {
                const row = parseInt(towerElement.dataset.row);
                const col = parseInt(towerElement.dataset.col);
                this.showRangeIndicator(row, col);
                // Surligner les ennemis à portée quand la souris passe sur une tourelle
                this.highlightEnemiesInRange(row, col);
            }
        }, true);
        
        this.gridContainer.addEventListener('mouseleave', (event) => {
            const towerElement = this.findTowerElement(event.target);
            if (towerElement) {
                const row = parseInt(towerElement.dataset.row);
                const col = parseInt(towerElement.dataset.col);
                this.hideRangeIndicator(row, col);
                // Enlever le surlignage des ennemis quand la souris quitte la tourelle
                this.unhighlightEnemiesInRange();
            }
        }, true);
    }
    
    /**
     * Trouve l'élément tour à partir d'un élément cible d'événement
     * @param {HTMLElement} target - L'élément cible de l'événement
     * @returns {HTMLElement|null} L'élément tour ou null
     */
    findTowerElement(target) {
        // Vérifier si l'élément lui-même est une tour
        if (target.classList && target.classList.contains('tower')) {
            return target;
        }
        
        // Vérifier si c'est un enfant d'une tour
        const towerParent = target.closest('.tower');
        if (towerParent) {
            return towerParent;
        }
        
        return null;
    }

    /**
     * Crée un élément DOM pour une tour
     * @param {Tower} tower - La tour à rendre
     * @returns {HTMLElement} L'élément DOM créé
     */
    createTowerElement(tower) {
        const { row, col } = tower.getPosition();
        const towerElement = document.createElement('div');
        
        // Classes CSS de base pour une tour
        towerElement.classList.add('tower');
        towerElement.classList.add(tower.getCssClass());
        towerElement.dataset.level = tower.getLevel();
        towerElement.dataset.towerType = tower.getType().id;
        towerElement.dataset.row = row;
        towerElement.dataset.col = col;
        
        // Créer la représentation visuelle interne
        const innerElement = document.createElement('div');
        innerElement.classList.add('tower-inner');
        
        // Ajouter un indicateur de niveau global
        const levelIndicator = document.createElement('span');
        levelIndicator.classList.add('tower-level');
        levelIndicator.textContent = tower.getLevel();
        
        // Ajouter un indicateur de compétence active (si disponible)
        const activeSkill = tower.getActiveSkill();
        if (activeSkill) {
            const skillIndicator = document.createElement('div');
            skillIndicator.classList.add('tower-skill-indicator');
            skillIndicator.classList.add(activeSkill.getCssClass());
            skillIndicator.setAttribute('title', `${activeSkill.getLabel()} Nv.${activeSkill.getLevel()}`);
            skillIndicator.dataset.skillLevel = activeSkill.getLevel();
            
            // Créer un élément spécifique pour le niveau de compétence
            const skillLevelIndicator = document.createElement('span');
            skillLevelIndicator.classList.add('skill-level');
            skillLevelIndicator.textContent = activeSkill.getLevel();
            skillIndicator.appendChild(skillLevelIndicator);
            
            innerElement.appendChild(skillIndicator);
        }
        
        // Assembler les éléments
        towerElement.appendChild(innerElement);
        towerElement.appendChild(levelIndicator);
        
        // Ajouter des attributs pour les infobulles
        towerElement.title = this.generateTowerTooltip(tower);
        towerElement.setAttribute('aria-label', tower.getDisplayName());
        
        return towerElement;
    }

    /**
     * Génère le texte d'infobulle pour une tour
     * @param {Tower} tower - La tour
     * @returns {string} Le texte d'infobulle
     */
    generateTowerTooltip(tower) {
        const skills = tower.getSkills();
        let tooltip = `${tower.getType().label} (Nv.${tower.getLevel()})\n`;
        
        // Ajouter les compétences et leurs niveaux
        if (skills.length > 0) {
            tooltip += `\nCompétences:\n`;
            for (const skill of skills) {
                tooltip += `- ${skill.getLabel()} Nv.${skill.getLevel()}\n`;
            }
        }
        
        return tooltip;
    }

    /**
     * Place une tour sur une cellule de la grille
     * @param {Tower} tower - La tour à placer
     * @param {HTMLElement} cellElement - L'élément de la cellule où placer la tour
     */
    placeTowerOnCell(tower, cellElement) {
        const towerElement = this.createTowerElement(tower);
        cellElement.appendChild(towerElement);
        cellElement.classList.add('has-tower');
    }

    /**
     * Met à jour l'apparence d'une tour existante
     * @param {Tower} tower - La tour à mettre à jour
     */
    updateTowerElement(tower) {
        const { row, col } = tower.getPosition();
        const towerElement = this.getTowerElement(row, col);
        
        if (towerElement) {
            // Mettre à jour le niveau global
            towerElement.dataset.level = tower.getLevel();
            
            // Mettre à jour l'indicateur de niveau global
            const levelIndicator = towerElement.querySelector('.tower-level');
            if (levelIndicator) {
                levelIndicator.textContent = tower.getLevel();
            }
            
            // Mettre à jour l'indicateur de compétence active
            const activeSkill = tower.getActiveSkill();
            if (activeSkill) {
                let skillIndicator = towerElement.querySelector('.tower-skill-indicator');
                const innerElement = towerElement.querySelector('.tower-inner');
                
                // Si l'indicateur n'existe pas, le créer
                if (!skillIndicator && innerElement) {
                    skillIndicator = document.createElement('div');
                    skillIndicator.classList.add('tower-skill-indicator');
                    innerElement.appendChild(skillIndicator);
                }
                
                if (skillIndicator) {
                    // Mettre à jour les classes et attributs
                    skillIndicator.className = 'tower-skill-indicator';
                    skillIndicator.classList.add(activeSkill.getCssClass());
                    skillIndicator.setAttribute('title', `${activeSkill.getLabel()} Nv.${activeSkill.getLevel()}`);
                    skillIndicator.dataset.skillLevel = activeSkill.getLevel();
                    
                    // Mettre à jour le niveau de compétence
                    let skillLevelIndicator = skillIndicator.querySelector('.skill-level');
                    if (!skillLevelIndicator) {
                        skillLevelIndicator = document.createElement('span');
                        skillLevelIndicator.classList.add('skill-level');
                        skillIndicator.appendChild(skillLevelIndicator);
                    }
                    
                    if (skillLevelIndicator) {
                        skillLevelIndicator.textContent = activeSkill.getLevel();
                    }
                }
            }
            
            // Mettre à jour le titre (infobulle)
            towerElement.title = this.generateTowerTooltip(tower);
            towerElement.setAttribute('aria-label', tower.getDisplayName());
        }
    }

    /**
     * Récupère l'élément DOM correspondant à une tour
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {HTMLElement|null} L'élément DOM ou null s'il n'existe pas
     */
    getTowerElement(row, col) {
        const cellElement = this.gridContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        return cellElement ? cellElement.querySelector('.tower') : null;
    }

    /**
     * Supprime une tour de la grille
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {boolean} True si la suppression a réussi
     */
    removeTower(row, col) {
        const cellElement = this.gridContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const towerElement = cellElement ? cellElement.querySelector('.tower') : null;
        
        if (towerElement && cellElement) {
            cellElement.removeChild(towerElement);
            cellElement.classList.remove('has-tower');
            this.hideRangeIndicator(row, col);
            return true;
        }
        
        return false;
    }
    
    /**
     * Affiche l'indicateur de portée pour une tour
     * @param {number} row - La ligne de la tour
     * @param {number} col - La colonne de la tour
     */
    showRangeIndicator(row, col) {
        // Récupérer l'élément de la tour
        const towerElement = this.getTowerElement(row, col);
        
        if (!towerElement) return;
        
        // Récupérer l'instance de la tour à partir de l'élément DOM
        const tower = this.getTowerInstance(row, col);
        if (!tower) return;
        
        // Récupérer la compétence active et sa portée
        const activeSkill = tower.getActiveSkill();
        if (!activeSkill) return;
        
        const range = tower.getRange(); // Inclut les bonus de niveau de tour
        
        // Vérifier si un indicateur existe déjà
        const key = `${row},${col}`;
        if (this.rangeIndicators.has(key)) return;
        
        // Créer l'indicateur de portée
        const rangeIndicator = document.createElement('div');
        rangeIndicator.classList.add('range-indicator');
        
        // Calculer la taille de l'indicateur basée sur la portée
        // La taille est en cellules, chaque cellule a une dimension particulière
        const cellSize = 40; // pixels (basé sur la taille de la grille dans GridRenderer)
        const diameter = (range * 2 + 1) * cellSize;
        
        rangeIndicator.style.width = `${diameter}px`;
        rangeIndicator.style.height = `${diameter}px`;
        
        // Ajouter la classe CSS correspondant à la compétence active
        rangeIndicator.classList.add(`range-${activeSkill.getName()}`);
        
        // Ajouter l'indicateur à l'élément de la tour
        // Puisque nous utilisons transform: translate(-50%, -50%) dans le CSS,
        // nous n'avons pas besoin de calculer le positionnement ici
        towerElement.appendChild(rangeIndicator);
        
        // Stocker une référence à l'indicateur
        this.rangeIndicators.set(key, rangeIndicator);
        
        // Surligner les ennemis à portée
        this.highlightEnemiesInRange(row, col);
    }
    
    /**
     * Cache l'indicateur de portée pour une tour
     * @param {number} row - La ligne de la tour
     * @param {number} col - La colonne de la tour
     */
    hideRangeIndicator(row, col) {
        const key = `${row},${col}`;
        const indicator = this.rangeIndicators.get(key);
        
        if (indicator && indicator.parentElement) {
            indicator.parentElement.removeChild(indicator);
            this.rangeIndicators.delete(key);
        }
        
        // Désurligné les ennemis lorsque l'indicateur de portée est caché
        this.unhighlightEnemiesInRange();
    }
    
    /**
     * Récupère l'instance de la tour à une position donnée
     * @param {number} row - La ligne de la tour
     * @param {number} col - La colonne de la tour
     * @returns {Tower|null} L'instance de la tour ou null
     */
    getTowerInstance(row, col) {
        return this.gameState.getTowerAt(row, col);
    }
    
    /**
     * Surligne tous les ennemis à portée d'une tour
     * @param {number} row - La ligne de la tour
     * @param {number} col - La colonne de la tour
     */
    highlightEnemiesInRange(row, col) {
        const tower = this.getTowerInstance(row, col);
        if (!tower) return;
        
        // Récupérer tous les ennemis à portée
        const enemiesInRange = this.gameState.findEnemiesInTowerRange(tower);
        
        // Ajouter la classe 'in-range' à tous les ennemis à portée
        for (const enemyData of enemiesInRange) {
            const enemyElement = this.getEnemyElement(enemyData.enemy.id);
            if (enemyElement) {
                enemyElement.classList.add('in-range');
            }
        }
    }
    
    /**
     * Désurligné tous les ennemis (retire la classe 'in-range')
     */
    unhighlightEnemiesInRange() {
        // Sélectionner tous les ennemis avec la classe 'in-range'
        const inRangeEnemies = document.querySelectorAll('.enemy.in-range');
        
        // Retirer la classe de tous les ennemis
        for (const enemyElement of inRangeEnemies) {
            enemyElement.classList.remove('in-range');
        }
    }
    
    /**
     * Récupère l'élément DOM d'un ennemi par son ID
     * @param {string} enemyId - L'ID de l'ennemi
     * @returns {HTMLElement|null} L'élément ennemi ou null
     */
    getEnemyElement(enemyId) {
        return document.querySelector(`.enemy[data-id="${enemyId}"]`);
    }
}