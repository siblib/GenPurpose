export class PerformanceLogger {
    constructor() {
        this.trackedParticles = [];
        this.log = [];
    }

    startTracking(particles) {
        this.trackedParticles = [];
        this.log = []; 

        const normalParticles = particles.filter(p => p.type === 'normal');
        const oscillatorParticles = particles.filter(p => p.type === 'oscillator');
        const fibonacciParticles = particles.filter(p => p.type === 'fibonacci');

        const particleTypes = [normalParticles, oscillatorParticles, fibonacciParticles];
        let count = 0;

        while (count < 5 && particles.length > 0) {
            const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            if (randomType.length > 0) {
                const particle = randomType.splice(Math.floor(Math.random() * randomType.length), 1)[0];
                if (particle && !this.trackedParticles.find(p => p.mesh.uuid === particle.mesh.uuid)) {
                    this.trackedParticles.push(particle);
                    count++;
                }
            }
        }
    }

    logPerformance(elapsedTime) {
        this.trackedParticles.forEach(p => {
            if (p.markedForRemoval) {
                this.trackedParticles = this.trackedParticles.filter(tp => tp.mesh.uuid !== p.mesh.uuid);
                return;
            }

            let velocity = 0;
            if (p.type === 'normal' || (p.type === 'oscillator' && !p.parent)) {
                velocity = p.speed; // Speed is already updated with acceleration over time
            }

            this.log.push({
                timestamp: elapsedTime,
                particleId: p.mesh.uuid,
                particleType: p.type,
                initialSpeed: p.speed,
                acceleration: p.acceleration,
                currentVelocity: velocity,
                position: p.mesh.position.clone()
            });
        });
    }

    exportLog() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.log, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "particle_performance_log.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}
