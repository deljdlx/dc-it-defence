/**
 * Classe responsable du chargement des données du jeu
 */
export class GameLoader {
    constructor() {
        this.gameDataPath = '/assets/game.json';
    }

    /**
     * Charge les données du jeu depuis le fichier JSON
     * @returns {Promise<Object>} Les données du jeu
     */
    async loadGameData() {
        try {
            const response = await fetch(this.gameDataPath);
            
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement des données: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Vérifier que le format est valide
            this.validateGameData(data);
            
            return data;
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            throw error;
        }
    }

    /**
     * Valide le format des données chargées
     * @param {Object} data - Les données à valider
     * @throws {Error} Si les données sont invalides
     */
    validateGameData(data) {
        // Vérifier que l'attribut map existe
        if (!data.map || !Array.isArray(data.map)) {
            throw new Error('Le format des données est invalide: attribut map manquant ou invalide');
        }
        
        // Vérifier que tous les cellTypes sont définis
        if (!data.cellTypes || !Array.isArray(data.cellTypes)) {
            throw new Error('Le format des données est invalide: attribut cellTypes manquant ou invalide');
        }
        
        // Vérifier que la grille est bien formée (rectangulaire)
        const rowLength = data.map[0].length;
        for (const row of data.map) {
            if (row.length !== rowLength) {
                throw new Error('Le format des données est invalide: la grille n\'est pas rectangulaire');
            }
        }
    }
}