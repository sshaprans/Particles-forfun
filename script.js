var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

document.body.style.margin = 0;
document.documentElement.style.overflow = "hidden";

canvas.height = innerHeight;
canvas.width = innerWidth;

addEventListener('resize', function () {
    canvas.height = innerHeight;
    canvas.width = innerWidth;
});



// -------------- Particles ----------------------

function Particles(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8
    }
    this.gravity = 0.8;
    this.friction = 0.6;
    this.radiusBreak = 3;
}

Particles.prototype.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
}
Particles.prototype.update = function () {
    if (this.y + this.radius + this.velocity.y > innerHeight - groundHeight ||
        this.y - this.radius - this.velocity.y < 0) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.break();
    } else if (this.x + this.radius + this.velocity.x > innerWidth ||
        this.x - this.radius - this.velocity.x < 0) {
        this.velocity.x = -this.velocity.x * this.friction;
        this.break();
    } else {
        this.velocity.y += this.gravity;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
}
Particles.prototype.break = function () {
    for (let i = 0; i < 4; i++) {
        miniparticles.push(new miniParticles(this.x, this.y, 2));
    }
    this.radius -= this.radiusBreak;
}

//----------------- mini Particles ------------------

function miniParticles(x, y, radius, color) {
    Particles.call(this, x, y, radius, color)
    this.velocity = {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5
    }
    this.gravity = -0.3;
    this.friction = .95;
    this.timeToLive = 100;
    this.opacity = 1;
    this.color = color;
}
miniParticles.prototype.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = 'rgba(60, 60, 60, ' + this.opacity + ')';;
    c.fill();
    c.closePath();
    c.restore();
}
miniParticles.prototype.update = function () {
    if (this.y + this.radius + this.velocity.y > innerHeight - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
    } else {
        this.velocity.y += this.gravity;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.timeToLive -= 1;
    this.opacity -= 1 / this.timeToLive;
    this.draw();
}


//---------------- Implimentations -----------------


//  Background Gradient -----------------
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#333b44')
backgroundGradient.addColorStop(1, '#e2e2e2')


var groundHeight = 100;

// Arrays For The Particles ------------------
var particles = [];
var miniparticles = [];

addEventListener('mousedown', function (e) {
    var x = e.x;
    var y = e.y;
    var radius = 15;
    particles.push(new Particles(x, y, radius, '#222'));
})
addEventListener('ontouchstart', function (e) {
    var x = e.x;
    var y = e.y;
    var radius = 15;
    particles.push(new Particles(x, y, radius, '#222'));
})





//----------------- Animation Loop ------------------

function animate() {
    // Render Loop -----------------------
    requestAnimationFrame(animate);
    // Background ------------------------
    c.fillStyle = backgroundGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Ground ----------------------
    c.fillStyle = '#2e3438'
    c.fillRect(0, canvas.height - groundHeight, canvas.width, canvas.height - groundHeight);
    particles.forEach((particle, index) => {
        particle.update();
        if (particle.radius == 0) {
            particles.splice(index, 1);
        }
    })
    miniparticles.forEach((miniparticle, index) => {
        miniparticle.update();
        if (miniparticle.timeToLive == 1) {
            miniparticles.splice(index, 1);
        }
    });
}
animate();