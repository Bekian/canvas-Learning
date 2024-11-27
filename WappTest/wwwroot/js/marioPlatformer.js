// this code is based on the platformer from the tutorial from chris courses: https://www.youtube.com/watch?v=4q2vvZn5aoo&list=PLpPnRKq7eNW3We9VdCfx9fprhqXHwTPXL&index=19
// this is a nearly 1:1 recreation following the guide as provided in the video
// though there are some minor differences for convenience
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth - 25
canvas.height = innerHeight - 25

// creates an instance of an image object and assigns the provided source
function createImage(src) {
    const img = new Image();
    img.src = src
    return img
}

const platformPic = createImage("../images/platform.png")
const hillPic = createImage("../images/hills.png")
const bgPic = createImage("../images/background.png")
const shortPlat = createImage("../images/platformSmallTall.png")
const runLeft = createImage("../images/spriteRunLeft.png")
const runRight = createImage("../images/spriteRunRight.png")
const standLeft = createImage("../images/SpriteStandLeft.png")
const standRight = createImage("../images/SpriteStandRight.png")

const gravity = 0.9

class Player {
    constructor() {
        // he suggested we use objects with properties but thats unnecessary so we just use properties
        this.x = 100
        this.y = 100
        this.h = 150
        this.w = 66
        this.velX = 0
        this.velY = 1
        this.speed = 6
        this.image = standRight
        this.frames = 0
        this.sprites = {
            standRight,
            standLeft,
            runRight,
            runLeft
        }
        this.cropWidth = {
            stand: 177,
            run: 340
        }
        this.currentCropWidth = this.cropWidth.stand
        // the dynamic width of the player changes whether or not the player is moving
        this.currentWidth = {
            stand: 66,
            run: 125
        }
    }
    
    draw() {
        c.drawImage(this.image, this.currentCropWidth * this.frames, 0, this.currentCropWidth, 400, this.x, this.y, this.w, this.h);
    }

    update() {
        // console.log(this.image, )
        this.frames++;
        if (this.frames > 59 && (this.image == standRight || this.image == standLeft)) {
            this.frames = 0;
        } else if (this.frames > 29 && (this.image == runRight || this.image == runLeft)) {
            this.frames = 0; // Reset frames for both running left and right
        }
        this.draw();
        // update position
        this.y += this.velY 
        this.x += this.velX
        // apply gravity 
        if (this.y + this.h + this.velY <= canvas.height) { 
            this.velY += gravity
        }
    }
}

class Platform {
    constructor(x = 100, y = 100, image = platformPic) {
        this.x = x;
        this.y = y;
        this.h = image.height
        this.w = image.width
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
}

// generic game object class
class gameObject {
    constructor(x = -1, y = -1, image) {
        this.x = x;
        this.y = y;
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.x, this.y);
    }
}


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


const bottomHeight = canvas.height - (platformPic.height * 0.66)
let p1
let scrollOffset
let platforms = []
let gameObjects = []

function init() {

    scrollOffset = 0
    // init player 
    p1 = new Player()  

    // various platforms that makeup the map
    platforms = [
        new Platform(platformPic.width * 4 + (platformPic.width / 8), bottomHeight-100, shortPlat),
        new Platform(0, bottomHeight), 
        new Platform(platformPic.width - 2, bottomHeight), 
        new Platform(platformPic.width * 2 + 100, bottomHeight),
        new Platform(platformPic.width * 3 + 275, bottomHeight),
        new Platform(platformPic.width * 5 + 100, bottomHeight),
    ]
    
    // these gameObjects are just background images
    gameObjects = [
        new gameObject(0, 0, bgPic), 
        new gameObject(0, 0 + 50, hillPic)
    ]
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = '#ffffff'
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    gameObjects.forEach((obj) => {obj.draw()})

    platforms.forEach((platform) => {platform.draw()})
    p1.update()
    // left bound wall, ensures the user cannot scroll left beyond the start
    const leftBound = dir.left.moving && scrollOffset == 0 && p1.x > 0
    // X controls
    if (dir.right.moving && p1.x < 400) {
        p1.velX = p1.speed
    } else if (dir.left.moving && p1.x > 100 || leftBound) {
        p1.velX = -p1.speed
    } else {
        p1.velX = 0

        // page scrolling logic
        if (dir.right.moving) {
            scrollOffset += p1.speed
            platforms.forEach((platform) => {platform.x -= p1.speed})
            // bg parallax movement
            gameObjects.forEach((obj) => {obj.x -= (p1.speed * 0.66)})
        } else if (dir.left.moving && scrollOffset > 0) {
            scrollOffset -= p1.speed
            platforms.forEach((platform) => {platform.x += p1.speed})
            gameObjects.forEach((obj) => {obj.x += (p1.speed * 0.66)})
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

    // animations
    if (dir.right.moving && p1.image != p1.sprites.runRight) {
        p1.frames = 1
        p1.image = p1.sprites.runRight
        p1.w = p1.currentWidth.run;
        p1.currentCropWidth = p1.cropWidth.run;
    } else if (dir.left.moving && p1.image != p1.sprites.runLeft) {
        p1.frames = 1
        p1.image = p1.sprites.runLeft;
        p1.w = p1.currentWidth.run;
        p1.currentCropWidth = p1.cropWidth.run;
    }

    console.log(scrollOffset, platformPic.width * 5 - p1.w)
    // win condiditon
    if (scrollOffset >= platformPic.width * 5 + 100) {
        if (confirm("You win! Play again?")) {
            // bug here if the player is moving the player continues to move without control
            // even though the player is reset
            init()
        } else {
            location = '/' 
        }
          
    }
    // lose/die condition
    if (p1.y > canvas.height) {
        init()
    }
}
init()
animate()

addEventListener('keydown', (event) => {
    // here he uses the keycodes and destructuring to access the keycode property
    // but its not that hard to just do `event.key` plus then we have access to the rest of the object if we need it
    // and i think using actual keys is easier to read
    switch (event.key) {
        case 'w':
            if (p1.velY != 0) { break; }
            p1.velY -= p1.speed * 3;
            // we dont change the moving state or animations here
            break;
        case 'a':
            dir.left.moving = true;
            break;
        case 'd':
            dir.right.moving = true;
            break;
        default:
            break;
    }
});

addEventListener('keyup', (event) => {
    // here he uses the keycodes and destructuring to access the keycode property
    // but its not that hard to just do `event.key` plus then we have access to the rest of the object if we need it
    // and i think using actual keys is easier to read
    switch (event.key) {
        case 'a':
            dir.left.moving = false;
            p1.image = p1.sprites.standLeft; // Set to standing left
            p1.w = p1.currentWidth.stand;
            p1.currentCropWidth = p1.cropWidth.stand;
            break;
        case 'd':
            dir.right.moving = false;
            p1.image = p1.sprites.standRight; // Set to standing right
            p1.w = p1.currentWidth.stand;
            p1.currentCropWidth = p1.cropWidth.stand;
            break;
        default:
            break;
    }
});