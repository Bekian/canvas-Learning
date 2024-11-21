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

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

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
class Ball{
  constructor(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
  }

  update() {
    let bounceCondition = this.y + this.radius > canvas.height
    if (bounceCondition) {
        this.dy = -this.dy * friction
    } else {
        this.dy += gravity
    }
    // this.dy += 2
    this.y += this.dy
    this.draw()
  }
}

// Implementation
let objects
function init() {
    objects = []
    let ball = new Ball(canvas.width/2, canvas.height/2,2, 2, 20, randomColor(colors),)
    objects.push(ball)
    for (let i = 0; i < 400; i++) {
        objects.push()
    }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, canvas.width, canvas.height)

  objects.forEach(object => {
   object.update()
  })
}

init()
animate()
