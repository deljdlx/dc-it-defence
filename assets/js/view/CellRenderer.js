/**
 * Classe responsable du rendu visuel d'une cellule individuelle
 */
export class CellRenderer {
    /**
     * @param {HTMLElement} gridContainer - Conteneur de la grille
     */
    constructor(gridContainer) {
        this.gridContainer = gridContainer;
    }

    /**
     * Crée une cellule DOM
     * @param {Cell} cell - L'objet cellule à rendre
     * @returns {HTMLElement} L'élément DOM créé
     */
    createCellElement(cell) {
        const { row, col } = cell.getPosition();
        const cellElement = document.createElement('div');
        
        cellElement.classList.add('grid-cell');
        cellElement.dataset.row = row;
        cellElement.dataset.col = col;
        
        // Ajouter la classe CSS spécifique au type de cellule
        cellElement.classList.add(cell.getCssClass());
        
        return cellElement;
    }

    /**
     * Met à jour l'apparence d'une cellule existante
     * @param {HTMLElement} cellElement - L'élément DOM de la cellule
     * @param {Cell} cell - L'objet cellule
     */
    updateCellElement(cellElement, cell) {
        // Réinitialiser toutes les classes de type (à adapter selon vos besoins)
        cellElement.className = 'grid-cell';
        
        // Ajouter la classe CSS spécifique au type de cellule
        cellElement.classList.add(cell.getCssClass());
    }

    /**
     * Récupère l'élément DOM correspondant à une position de cellule
     * @param {number} row - La ligne
     * @param {number} col - La colonne
     * @returns {HTMLElement|null} L'élément DOM ou null s'il n'existe pas
     */
    getCellElement(row, col) {
        return this.gridContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }
}