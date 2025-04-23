/**
 * Classe responsable de la gestion du temps et de la synchronisation
 * des animations du jeu
 */
export class GameClock {
    /**
     * @param {Object} options - Options de configuration
     * @param {number} options.tickRate - Nombre de ticks par seconde (par défaut 60)
     * @param {number} options.gameSpeed - Vitesse du jeu (1.0 = vitesse normale)
     */
    constructor(options = {}) {
        this.tickRate = options.tickRate || 60; // Ticks par seconde
        this.tickInterval = 1000 / this.tickRate; // Intervalle entre les ticks en ms
        this.gameSpeed = options.gameSpeed || 1.0; // Vitesse de jeu (multiplicateur)
        this.isRunning = false; // Indique si l'horloge tourne
        this.isPaused = false; // Indique si le jeu est en pause
        
        this.lastTickTime = 0; // Timestamp du dernier tick
        this.elapsedTime = 0; // Temps écoulé depuis le début du jeu
        this.deltaTime = 0; // Temps écoulé depuis le dernier tick
        this.frameCount = 0; // Nombre de frames rendus
        this.tickCount = 0; // Nombre de ticks de logique exécutés
        
        this.logicSubscribers = []; // Fonctions à appeler à chaque tick de logique
        this.renderSubscribers = []; // Fonctions à appeler à chaque frame
        
        this.animationFrameId = null; // ID de requestAnimationFrame
        this.fpsUpdateInterval = 1000; // Intervalle de mise à jour du FPS (en ms)
        this.lastFpsUpdate = 0; // Dernière mise à jour du compteur FPS
        this.fps = 0; // Frames per second
        this.tps = 0; // Ticks per second (logique)
    }
    
    /**
     * Démarre l'horloge du jeu
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.lastTickTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        
        console.log('GameClock: Démarrage de l\'horloge');
    }
    
    /**
     * Arrête l'horloge du jeu
     */
    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        console.log('GameClock: Arrêt de l\'horloge');
    }
    
    /**
     * Met le jeu en pause (la logique s'arrête mais le rendu continue)
     */
    pause() {
        this.isPaused = true;
    }
    
    /**
     * Reprend le jeu après une pause
     */
    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.lastTickTime = performance.now();
        }
    }
    
    /**
     * Change la vitesse du jeu
     * @param {number} speed - Nouvelle vitesse (1.0 = normal)
     */
    setGameSpeed(speed) {
        this.gameSpeed = Math.max(0.1, Math.min(5.0, speed));
    }
    
    /**
     * Boucle principale du jeu
     * @param {number} timestamp - Timestamp actuel
     */
    gameLoop(timestamp) {
        if (!this.isRunning) return;
        
        // Calculer le delta time (temps écoulé depuis le dernier frame)
        this.deltaTime = timestamp - this.lastTickTime;
        this.lastTickTime = timestamp;
        
        // Mettre à jour le temps total écoulé
        if (!this.isPaused) {
            this.elapsedTime += this.deltaTime * this.gameSpeed;
        }
        
        // Exécuter la logique de jeu
        if (!this.isPaused) {
            // Calculer combien de ticks logiques doivent être exécutés
            const adjustedDelta = this.deltaTime * this.gameSpeed;
            const ticksToExecute = Math.floor(adjustedDelta / this.tickInterval);
            
            // Exécuter les ticks de logique
            for (let i = 0; i < ticksToExecute; i++) {
                this.executeLogicTick();
                this.tickCount++;
            }
        }
        
        // Exécuter le rendu
        this.executeRender();
        this.frameCount++;
        
        // Calculer et mettre à jour le FPS
        if (timestamp - this.lastFpsUpdate > this.fpsUpdateInterval) {
            const elapsed = timestamp - this.lastFpsUpdate;
            this.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.tps = Math.round((this.tickCount * 1000) / elapsed);
            
            // Réinitialiser les compteurs
            this.frameCount = 0;
            this.tickCount = 0;
            this.lastFpsUpdate = timestamp;
        }
        
        // Continuer la boucle
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    /**
     * Exécute un tick de logique de jeu
     */
    executeLogicTick() {
        const gameTime = {
            elapsed: this.elapsedTime,
            delta: this.tickInterval, // Delta time fixe pour la logique
            speed: this.gameSpeed
        };
        
        // Appeler tous les souscripteurs de logique
        for (const subscriber of this.logicSubscribers) {
            subscriber(gameTime);
        }
    }
    
    /**
     * Exécute un rendu de jeu
     */
    executeRender() {
        const renderTime = {
            elapsed: this.elapsedTime,
            delta: this.deltaTime,
            fps: this.fps,
            tps: this.tps
        };
        
        // Appeler tous les souscripteurs de rendu
        for (const subscriber of this.renderSubscribers) {
            subscriber(renderTime);
        }
    }
    
    /**
     * Abonne une fonction à être appelée à chaque tick de logique
     * @param {Function} callback - Fonction à appeler
     */
    subscribeToLogic(callback) {
        if (typeof callback === 'function') {
            this.logicSubscribers.push(callback);
            return true;
        }
        return false;
    }
    
    /**
     * Désabonne une fonction des ticks de logique
     * @param {Function} callback - Fonction à désabonner
     */
    unsubscribeFromLogic(callback) {
        const index = this.logicSubscribers.indexOf(callback);
        if (index !== -1) {
            this.logicSubscribers.splice(index, 1);
            return true;
        }
        return false;
    }
    
    /**
     * Abonne une fonction à être appelée à chaque rendu
     * @param {Function} callback - Fonction à appeler
     */
    subscribeToRender(callback) {
        if (typeof callback === 'function') {
            this.renderSubscribers.push(callback);
            return true;
        }
        return false;
    }
    
    /**
     * Désabonne une fonction des rendus
     * @param {Function} callback - Fonction à désabonner
     */
    unsubscribeFromRender(callback) {
        const index = this.renderSubscribers.indexOf(callback);
        if (index !== -1) {
            this.renderSubscribers.splice(index, 1);
            return true;
        }
        return false;
    }
    
    /**
     * Récupère le temps écoulé depuis le début du jeu
     * @returns {number} Temps écoulé en millisecondes
     */
    getElapsedTime() {
        return this.elapsedTime;
    }
    
    /**
     * Récupère le FPS actuel
     * @returns {number} Frames par seconde
     */
    getFPS() {
        return this.fps;
    }
    
    /**
     * Récupère le TPS actuel (ticks par seconde)
     * @returns {number} Ticks par seconde
     */
    getTPS() {
        return this.tps;
    }
    
    /**
     * Récupère la vitesse actuelle du jeu
     * @returns {number} Vitesse du jeu
     */
    getGameSpeed() {
        return this.gameSpeed;
    }
    
    /**
     * Vérifie si le jeu est en pause
     * @returns {boolean} True si le jeu est en pause
     */
    isPaused() {
        return this.isPaused;
    }
    
    /**
     * Vérifie si l'horloge tourne
     * @returns {boolean} True si l'horloge tourne
     */
    isClockRunning() {
        return this.isRunning;
    }
}