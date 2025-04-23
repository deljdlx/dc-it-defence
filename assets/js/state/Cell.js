/**
 * Classe représentant une cellule individuelle dans la grille
 */
export class Cell {
    /**
     * @param {number} row - La position de la ligne dans la grille
     * @param {number} col - La position de la colonne dans la grille
     * @param {Object} cellType - Le type de cellule avec ses propriétés
     */
    constructor(row, col, cellType) {
        this.row = row;
        this.col = col;
        this.type = cellType;
    }

    /**
     * Récupère la position de la cellule
     * @returns {Object} La position {row, col}
     */
    getPosition() {
        return {
            row: this.row,
            col: this.col
        };
    }

    /**
     * Récupère le type de cellule
     * @returns {Object} Le type de cellule
     */
    getType() {
        return this.type;
    }

    /**
     * Vérifie si la cellule est traversable
     * @returns {boolean} True si la cellule est traversable, false sinon
     */
    isWalkable() {
        return this.type.walkable;
    }

    /**
     * Récupère la classe CSS associée à cette cellule
     * @returns {string} La classe CSS
     */
    getCssClass() {
        return this.type.cssClass;
    }
}