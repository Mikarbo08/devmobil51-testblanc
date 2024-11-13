import Bullet from './Bullet.js';

class Shooter {
    constructor(x, y, r, turnSpeed, fireRate, angle, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.turnSpeed = turnSpeed;
        this.fireRate = fireRate;
        this.angle = angle;
        this.color = color;
        this.bullets = [];
        this.lastFireTime = 0;
    }

    draw(ctx) {
        // Dessiner le demi-cercle (base du canon)
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();

        // Dessiner la barre (canon) avec rotation
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, 0); // Début de la tige au centre du demi-cercle
        ctx.lineTo(this.r * 2, 0); // Longueur de la tige
        ctx.stroke();
        ctx.restore();

        // Dessiner les projectiles
        this.bullets.forEach(bullet => bullet.draw(ctx));
    }

    fire(currentTime) {
        if (currentTime - this.lastFireTime >= 200) {
            const x2 = this.x + Math.cos(this.angle) * this.r;
            const y2 = this.y + Math.sin(this.angle) * this.r;
            const bullet = new Bullet(x2, y2, this.angle);
            this.bullets.push(bullet);
            this.lastFireTime = currentTime;
        }
    }

    fireBonus() {
        const startAngle = Math.PI;
        const endAngle = 2 * Math.PI;
        const angleStep = 0.05;

        for (let angle = startAngle; angle <= endAngle; angle += angleStep) {
            const x2 = this.x + Math.cos(angle) * this.r;
            const y2 = this.y + Math.sin(angle) * this.r;
            const bullet = new Bullet(x2, y2, angle);
            this.bullets.push(bullet);
        }
    }

    updateBullets(deltaTime) {
        this.bullets.forEach(bullet => bullet.move(deltaTime));
        this.bullets = this.bullets.filter(bullet => bullet.x >= 0 && bullet.x <= window.innerWidth && bullet.y >= 0 && bullet.y <= window.innerHeight);
    }

    checkCollisions(targets, bonusTargets) {
        this.bullets = this.bullets.filter(bullet => {
            let hit = false;
            targets.forEach((target, index) => {
                if (bullet.isCollidingWith(target)) {
                    targets.splice(index, 1);
                    hit = true;
                }
            });
            bonusTargets.forEach((bonusTarget, index) => {
                if (bullet.isCollidingWith(bonusTarget)) {
                    bonusTargets.splice(index, 1);
                    this.fireBonus();
                    hit = true;
                }
            });
            return !hit;
        });
    }
}

export default Shooter;