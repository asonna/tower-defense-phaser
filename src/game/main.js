// This example uses the Phaser 2.2.2 framework


var GameState = function(game) {
};

// Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.image('bullet', '/assets/bullet.png');
		this.game.load.image('arrow', '/assets/arrow.png');
		this.game.load.image('star', '/assets/star.png');

};

// Setup the example
GameState.prototype.create = function() {
    // Set stage background color
    this.game.stage.backgroundColor = 0x4488cc;

    // Define constants
    this.SHOT_DELAY = 1000; // milliseconds (10 bullets/second)
    this.BULLET_SPEED = 500; // pixels/second
    this.NUMBER_OF_BULLETS = 20;

    // Create an object representing our tower
																	// x         y               image
    this.gun = this.game.add.sprite(50, 300, 'arrow');
		// Create an object representing our runner
		this.runner = this.game.add.sprite(300, 100, 'star');
		this.runner = this.game.add.sprite(600, 300, 'star');
		this.runner = this.game.add.sprite(700, 100, 'star');






    // Set the pivot point to the center of the gun
    this.gun.anchor.setTo(0.5, 0.5);

    // Create an object pool of dudes
    this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        // Create each bullet and add it to the group.
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);

        // Set its pivot point to the center of the bullet
        bullet.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

        // Set its initial state to "dead".
        bullet.kill();
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

    // Revive the bullet
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
    // Aim the gun at the pointer.


	    // Shoot a bullet at runner inside radius
	    if (this.game) {

				var runner0 = this.game.add.sprite(300, 100, 'star');
				var runner1 = this.game.add.sprite(600, 300, 'star');
				var runner2 = this.game.add.sprite(700, 100, 'star');

				var runners = [runner0, runner1, runner2];
				var withinRadius = [];

				for(i=0; i<runners.length; i++ ) {
					var distance = this.game.physics.arcade.distanceBetween(this.gun, runners[i]);
					if (distance<= 670 ) {
						withinRadius.push(runners[i]);
						// console.log("distancebetween: " + distance)
						this.gun.rotation = this.game.physics.arcade.angleBetween(this.gun, withinRadius[0]);
						this.shootBullet();
					}

				}


				// var targetRadius = this.game.physics.arcade.distanceBetween(this.gun, this.withinRadius[0]);

				//
				// if (targetRadius <= 700 ){
        // this.shootBullet();
				// }
	    }




};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
