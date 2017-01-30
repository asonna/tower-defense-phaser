var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('sky', '../assets/sky.png');
	game.load.image('ground', '../assets/platform.png');
	game.load.image('star', '../assets/star.png');
	game.load.spritesheet('dude', '../assets/dude.png', 32, 48);
	game.load.spritesheet('baddie', '../assets/baddie.png', 32, 32);

}

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var enemies;
var tests;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = game.input.keyboard.createCursorKeys();

	game.add.sprite(0,0, 'sky');

	platforms = game.add.group();
	platforms.enableBody = true;

	stars = game.add.group();
	stars.enableBody = true;

	for(var i = 0; i < 12; i++) {
		var star = stars.create(i * 70, 0, 'star');

		star.body.gravity.y = 6;

		star.body.bounce.y = 0.7 + Math.random() * 0.2;
	}

	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2, 2);
	ground.body.immovable = true;

	var ledge = platforms.create(400, 400, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 250, 'ground');
	ledge.body.immovable = true;

  player = game.add.sprite(32, game.world.height - 150, 'dude');
  game.physics.arcade.enable(player);

  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);

	enemies = game.add.group();

	for(var i = 0; i < 3; i++) {
		var enemy = game.add.sprite(500 + i * 50, game.world.height - 150, 'baddie');
		game.physics.arcade.enable(enemy);
		enemy.body.bounce.y = 0.2;
		enemy.body.gravity.y = 300;
		enemy.body.collideWorldBounds = true;
		// enemy.body.onWorldBounds = new Phaser.Signal();
		// enemy.body.onWorldBounds.add(moo, this);
		enemy.frame = 1;

		enemy.animations.add('left', [0, 1], 10, true);
	  enemy.animations.add('right', [2, 3], 10, true);

		enemies.add(enemy);
	};

	tests = game.add.group();

	for(var i = 0; i < 3; i++) {
		var enemy = tests.create(500 + i * 50, game.world.height - 300, 'baddie');
		game.physics.arcade.enable(enemy);
		enemy.body.bounce.y = 0.2;
		enemy.body.gravity.y = 300;
		enemy.body.collideWorldBounds = true;
		enemy.frame = 1;
	};


	scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
  var hitPlatform = game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(stars, platforms);
	game.physics.arcade.collide(enemies, platforms);

	game.physics.arcade.overlap(player, stars, collectStar, null, this);

	player.body.velocity.x = 0;

	enemies.setAll('body.velocity.x', -100);
	enemies.callAll('animations.play', 'animations', 'left');

	// enemies.forEachExists(function(enemy) {
	// 	if(enemy.body.onWall()) {
	// 		console.log("on wall");
	// 		enemy.body.velocity.x = 100;
	// 	} else {
	// 		enemy.body.velocity.x = 50;
	// 	}
	// });

	movement(hitPlatform);
}

// function moo(sprite, up, down, left, right) {
// 	if(left) {
// 		console.log("poo");
// 	}
// }
