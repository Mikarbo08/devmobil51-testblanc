import Shooter from '../class/Shooter.js';
import Target from '../class/Target.js';
import BonusTarget from '../class/BonusTarget.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Réduire la vitesse de rotation du canon
const shooter = new Shooter(canvas.width / 2, canvas.height - 30, 30, 0.02, 1, Math.PI, 'blue');
const targets = [];
const bonusTargets = [];

let lastTime = 0;
let lastTargetTime = 0;
let lastBonusTargetTime = 0;
let keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys['a']) {
        shooter.angle -= shooter.turnSpeed * deltaTime;
    }
    if (keys['d']) {
        shooter.angle += shooter.turnSpeed * deltaTime;
    }

    // Assurez-vous que l'angle reste entre π et 2π
    if (shooter.angle < Math.PI) {
        shooter.angle = Math.PI;
    }
    if (shooter.angle > 2 * Math.PI) {
        shooter.angle = 2 * Math.PI;
    }

    // Génération des cibles toutes les secondes
    if (timestamp - lastTargetTime >= 1000) {
        const x = Math.random() * (canvas.width - 40) + 20;
        const target = new Target(x, 20);
        targets.push(target);
        lastTargetTime = timestamp;
    }

    // Génération des cibles bonus toutes les 15 secondes
    if (timestamp - lastBonusTargetTime >= 1500) {
        const x = Math.random() * (canvas.width - 80) + 40;
        const bonusTarget = new BonusTarget(x, 20);
        bonusTargets.push(bonusTarget);
        lastBonusTargetTime = timestamp;
    }

    // Tirer des projectiles toutes les 200 ms si la barre d'espace est enfoncée
    if (keys[' ']) {
        shooter.fire(timestamp);
    }

    // Mise à jour et dessin des cibles
    targets.forEach(target => target.move(deltaTime));
    targets.forEach(target => target.draw(ctx));

    // Mise à jour et dessin des cibles bonus
    bonusTargets.forEach(bonusTarget => bonusTarget.move(deltaTime));
    bonusTargets.forEach(bonusTarget => bonusTarget.draw(ctx));

    // Arrêter la boucle d'animation si une cible atteint le bas de l'écran
    if (targets.some(target => target.y + target.r >= canvas.height) || bonusTargets.some(bonusTarget => bonusTarget.y + bonusTarget.r >= canvas.height)) {
        return;
    }

    shooter.updateBullets(deltaTime);
    shooter.checkCollisions(targets, bonusTargets);
    shooter.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);