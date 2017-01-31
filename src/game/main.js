// This example uses the Phaser 2.2.2 framework


var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('bullet', '/assets/bullet.png');
		this.game.load.image('arrow', '/assets/arrow.png');
		this.game.load.image('runner', '/assets/star.png');
    this.game.load.spritesheet('explosion', '/assets/ex1.png', 50, 50);


};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background color
    this.game.stage.backgroundColor = 0x4488cc;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Define constants
    this.SHOT_DELAY = 1000; // milliseconds (10 bullets/second)
    this.BULLET_SPEED = 500; // pixels/second
    this.NUMBER_OF_BULLETS = 20;

    // Create an object representing our tower

    this.gun = this.game.add.sprite(50, 300, 'arrow');

    // Create a group for explosions
    this.explosionGroup = this.game.add.group();

    // Set the pivot point to the center of the gun
    this.gun.anchor.setTo(0.5, 0.5);

    // Create an object pool of dudes
    this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);

        // Set its pivot point to the center of the bullet origin
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
        // this.game.physics.enable(runner, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
    }

    // //Runner group on bottom
    // this.runner = this.game.add.group();
    // for(var x = 0; x < this.game.width; x += 200) {
    //     // Add the ground blocks, enable physics on each, make them immovable
    //     var runnerGroup = this.game.add.sprite(x, this.game.height - 32, 'runner');
    //     this.game.physics.enable(runnerGroup, Phaser.Physics.ARCADE);
    //     // runner.body.immovable = true;
    //     // runner.body.allowGravity = false;
    //     this.runner.add(runnerGroup);
    // }

    // // Create an object representing our runner
    // this.runner = this.game.add.sprite(300, 350, 'runner');
    // this.runner = this.game.add.sprite(600, 275, 'runner');
    // this.runner = this.game.add.sprite(700, 100, 'runner');
    //
    // //Runner group on bottom
    // this.runner = this.game.add.group();
    // for(var x = 0; x < this.game.width; x += 200) {
    //     // Add the ground blocks, enable physics on each, make them immovable
    //     var runnerGroup = this.game.add.sprite(x, this.game.height - 32, 'runner');
    //     this.game.physics.enable(runnerGroup, Phaser.Physics.ARCADE);
    //     // runner.body.immovable = true;
    //     // runner.body.allowGravity = false;
    //     this.runner.add(runnerGroup);
    // }

    this.runners = this.game.add.group();
    this.runners.enableBody = true;

    for(var i = 0; i < 3;i++) {
      var runner = this.runners.create(100 + i * 100, game.world.height - 400 + (i * 100), 'runner');
      // this.game.physics.arcade.enable(runner);
      // this.runners.add(runner);
    }




};


GameState.prototype.shootBullet = function() {
    // Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;



    // Get a dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;

    // This makes the bullet "alive"
    bullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    bullet.reset(this.gun.x, this.gun.y);
    bullet.rotation = this.gun.rotation;

    // Shoot it in the right direction
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
};

// The update() method is called every frame
GameState.prototype.update = function() {
  // Check if bullets have collided with the ground
  this.game.physics.arcade.collide(this.bulletPool, this.runners, function(bullet, runner) {
      console.log("colliding");
      this.getExplosion(bullet.x, bullet.y);

      // Kill the bullet
      bullet.kill();
      runner.kill();
      console.log("killing");
  }, null, this);


	    // Shoot a bullet at runner inside radius
	    if (this.game) {

				var withinRadius = [];

        var tempRunners = [];
        this.runners.forEachExists(function(runner) {
          tempRunners.push(runner);
        });

        for(i=0; i<tempRunners.length; i++ ) {
					var distance = this.game.physics.arcade.distanceBetween(this.gun, tempRunners[i]);
					if (distance<= 600) {
						withinRadius.push(tempRunners[i]);
						// console.log("distancebetween: " + distance)
						this.gun.rotation = this.game.physics.arcade.angleBetween(this.gun, withinRadius[0]);
						this.shootBullet();
					}
				}

        // // This way works but without distance and probably won't scale.
        // this.gun.rotation = this.game.physics.arcade.angleBetween(this.gun, this.runners.getClosestTo(this.gun));
        // this.shootBullet();


				// var targetRadius = this.game.physics.arcade.distanceBetween(this.gun, this.withinRadius[0]);

				//
				// if (targetRadius <= 700 ){
        // this.shootBullet();
				// }
	    }
};

GameState.prototype.getExplosion = function(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11,12], 30, false);
        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
