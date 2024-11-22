function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1  
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

function rotate(velX, velY, angle) {
    const x = velX * Math.cos(angle) - velY * Math.sin(angle)
    const y = velX * Math.sin(angle) + velY * Math.cos(angle)
    return {x, y}
}

// Resolve collision function
// i dont usually shorten words but i dont wanna type the whole thing out
function resolveCollision(par1, par2) {
    const xVelDiff = par1.velX - par2.velX
    const yVelDiff = par1.velY - par2.velY

    const xDist = par2.x - par1.x
    const yDist = par2.y - par1.y

    // prevent particle overlap
    if (xVelDiff * xDist + yVelDiff * yDist >= 0) {
        // get the angle between 2 particles
        const collisionAngle = -Math.atan2(par2.y - par1.y, par2.x - par1.x)

        // initial rotated velocity
        const u1 = rotate(par1.velX, par1.velY, collisionAngle)
        const u2 = rotate(par2.velX, par2.velY, collisionAngle)

        // calculate new particle velocities
        const vel1X = u1.x * (par1.mass - par2.mass) / (par1.mass + par2.mass) + u2.x * 2 * par2.mass / (par1.mass + par2.mass)
        const vel1Y = u1.y
        const vel2X = u2.x * (par1.mass - par2.mass) / (par1.mass + par2.mass) + u1.x * 2 * par1.mass / (par1.mass + par2.mass)
        const vel2Y = u2.y

        // get final velocities
        const vFinal1 = rotate(vel1X, vel1Y, -collisionAngle)
        const vFinal2 = rotate(vel2X, vel2Y, -collisionAngle)

        // reassign new velocities
        par1.velX = vFinal1.x
        par1.velY = vFinal1.y
        par2.velX = vFinal2.x
        par2.velY = vFinal2.y
        console.log('bonk')
    }
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth - 25
canvas.height = innerHeight - 25

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

let gravity = 1
let friction = 0.95

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Particle{
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.velX = Math.random() - 0.5
    this.velY = Math.random() - 0.5
    this.radius = radius
    this.color = color
    this.mass = 1
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.strokeStyle = this.color
    c.stroke()
    c.closePath()
  }

  update(particles) {
    particles.forEach(particle => {
        if (this == particle) {return}
        if (distance(this.x, this.y, particle.x, particle.y) - this.radius * 2 < 0) {
            resolveCollision(this, particle)
        }
    })

    // wall collision
    let leftWallCollide = this.x - this.radius <= 0
    let rightWallCollide = this.x + this.radius >= canvas.width
    let topWallCollide = this.y - this.radius <= 0
    let bottomWallCollide = this.y + this.radius >= canvas.height
    if (leftWallCollide || rightWallCollide) {
        this.velX *= -1
    }
    if (topWallCollide || bottomWallCollide) {
        this.velY *= -1
    }
    this.x += this.velX
    this.y += this.velY
    this.draw()
  }
}

// Implementation
// this init function creates all the particles on startup
let particles
function init() {
    particles = []
    // create nParticles
    let nParticles = 50;
    for (let i = 0; i < nParticles; i++) {
        // set a radius and a random x and y value for each initial position
        let radius = 20;
        let randX = randomIntFromRange(radius, canvas.width - radius)
        let randY = randomIntFromRange(radius, canvas.height - radius)
        // if not the first particle
        if (i != 0) {
            // check if each particle overlaps with another
            let overlapping;
            do {
                overlapping = false;
                particles.forEach(particle => {
                    // if the particles overlap
                    if (distance(randX, randY, particle.x, particle.y) - radius * 2 < 0) {
                        // set overlap to false, reassign new positions and try again
                        overlapping = true;
                        randX = randomIntFromRange(radius, canvas.width - radius)
                        randY = randomIntFromRange(radius, canvas.height - radius);
                    }
                });
            } while (overlapping);
        }
        // generate particle if not overlapping
        let particle = new Particle(randX, randY, radius, randomColor(colors));
        // push to array
        particles.push(particle);
    }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  particles.forEach(object => {
   object.update(particles)
  })
}

init()
animate()
