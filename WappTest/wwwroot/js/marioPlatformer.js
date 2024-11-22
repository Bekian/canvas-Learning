// this code is based on the platformer from the tutorial from chris courses: https://www.youtube.com/watch?v=4q2vvZn5aoo&list=PLpPnRKq7eNW3We9VdCfx9fprhqXHwTPXL&index=19
// this is a nearly 1:1 recreation following the guide as provided in the video
// though there are some minor differences for convenience
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth - 25
canvas.height = innerHeight - 25

const platformPic = new Image();
platformPic.src = "../images/platform.png"

let imageLoaded = false;
platformPic.onload = () => {
    imageLoaded = true;
};

const gravity = 0.9

class Player {
    constructor() {
        // he suggested we use objects with properties but thats unnecessary so we just use properties
        this.x = 100
        this.y = 100
        this.h = 100
        this.w = 100
        this.velX = 0
        this.velY = 1
    }
    
    draw() {
        c.fillStyle = 'Red'
        c.fillRect(this.x, this.y, this.w, this.h)
    }

    update() {
        this.draw()
        // update position
        this.y += this.velY 
        this.x += this.velX
        // apply gravity 
        if (this.y + this.h + this.velY <= canvas.height) { 
            this.velY += gravity
        } else {
            // unless the player is on the ground
            this.velY = 0
        }
        // using floor breaks the logic
        // this.y = Math.ceil(this.y)
        // this.velY = Math.ceil(this.velY)
    }
}

class Platform {
    constructor(x = 100, y = 100) {
        this.x = x;
        this.y = y;
        this.h = 100;
        this.w = 600;
    }

    draw() {
        if (imageLoaded) {
            c.drawImage(platformPic, this.x, this.y, this.w, this.h);
        }
    }
}

const p1 = new Player()  
// this was initially keys and left right up and down
// but i changed it so its shorter
const dir = {
    right: {
        moving: false
    },
    left: {
        moving: false
    },
    up: {
        moving: false
    },
    down: {
        moving: false
    }
}

const platforms = [new Platform(400, 200), new Platform(300, 350)]

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = '#ffffff'
    c.fillRect(0, 0, canvas.width, canvas.height)
    platforms.forEach((platform) => {platform.draw()})
    p1.update()
    // X controls
    if (dir.right.moving && p1.x < 400) {
        p1.velX = 5
    } else if (dir.left.moving && p1.x > 100) {
        p1.velX = -5
    } else {
        p1.velX = 0

        // page scrolling logic
        if (dir.right.moving) {
            platforms.forEach((platform) => {platform.x -= 5})
        } else if (dir.left.moving) {
            platforms.forEach((platform) => {platform.x += 5})
        }
    }

    // platform & player collision detection
    platforms.forEach((platform) => {
        // square above platform
        const Ycondition1 = p1.y + p1.h <= platform.y
        // square and velocity is below platform
        // blocks the square from falling through the platforms height
        const Ycondition2 = p1.y + p1.h + p1.velY >= platform.y
        // square is inside X bounds of the platform
        // allows the square to fall outside the bounds of the platform 
        // left bound
        const Xcondition1 = p1.x + p1.w >= platform.x
        // right bound
        const Xcondition2 = p1.x <= platform.x + platform.w
        if (Ycondition1 && Ycondition2 && Xcondition1 && Xcondition2) {
            p1.velY = 0
        }
    })
}

animate()

addEventListener('keydown', (event) => {
    // here he uses the keycodes and destructuring to access the keycode property
    // but its not that hard to just do `event.key` plus then we have access to the rest of the object if we need it
    // and i think using actual keys is easier to read
    switch (event.key) {
        case 'w':
            // dir.up.moving = true
            p1.velY -= 25
            break;
        case 'a':
            dir.left.moving = true
            break;
        case 'd':
            dir.right.moving = true
            break;
        default:
            break;
    }
})

addEventListener('keyup', (event) => {
    // here he uses the keycodes and destructuring to access the keycode property
    // but its not that hard to just do `event.key` plus then we have access to the rest of the object if we need it
    // and i think using actual keys is easier to read
    switch (event.key) {
        // case 'w':
            // p1.velY = 0
            // break;
        case 'a':
            dir.left.moving = false
            break;
        case 'd':
            dir.right.moving = false
            break;
        default:
            break;
    }
})