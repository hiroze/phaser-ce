'use strict';

const game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    //first parameter is asset key- link to the loaded asset used when creating sprites
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

let player;
let platforms;
let stars;
let score = 0;
let scoreText;
let cursors;

function create() {
    //=====  CREATE WORLD =====
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //background for game
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;
    //creates ground
    const ground = platforms.create(0, game.world.height - 64, 'ground');
    //scales ground to fit width of game
    ground.scale.setTo(2, 2);
    //stops ground from moving away when jumped on
    ground.body.immovable = true;
    //creates 2 ledges
    let ledge = platforms.create(400, 400, 'ground');
    //keeps ledges from moving when player interacts with it
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    //=====  CREATE PLAYER =====

    //player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    //enables physics on player
    game.physics.arcade.enable(player);
    //player physics properties
    player.body.bounce.y = 0.9;
    //weight of object, higher means fall faster
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;
    //walk left; uses frames 0-3 and runs at 10 fps; true tells animation to loop
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    //walk right; uses frames 5-8 and runs at 10 fps; true tells animation to loop
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //=====  CREATE STARS =====
    stars = game.add.group();
    stars.enableBody = true;
    for (let i = 0; i < 12; i++) {
        //creates a star inside stars group
        let star = stars.create(i * 70, 0, 'star');
        //star gravity
        star.body.gravity.y = 100;
        //randomized star bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //=====  SCORE  =====
    scoreText = game.add.text(16, 16, 'score: --', {
        fontSize: '32px',
        fill: '#000'
    });
}

function update() {
    //collide play with objects(platforms, stars)
    let hitPlatform = game.physics.arcade.collide(player, platforms);
    player.body.velocity.x = 0;
    cursors = game.input.keyboard.createCursorKeys();
    //move left
    if (cursors.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        //move right
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        //stand still
        player.animations.stop();
        player.frame = 4;
    }
    //jump if touching ground
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = 550;
    }
    //keeps stars from falling through platforms
    game.physics.arcade.collide(stars, platforms);

    //player overlapping star or not
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

function collectStar(player, star) {
    //removes star when player collides
    star.kill();
    //add and update score
    score += 100;
    scoreText.text = `Score: ${score}`;
}
