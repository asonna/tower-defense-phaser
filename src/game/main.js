//MACHINE GUN TOWER
var GameState = function(game) {
};
GameState.prototype.preload = function() {
    this.game.load.image('bullet', '/assets/bullet.png');
		this.game.load.image('arrow', '/assets/cannon.png');
		this.game.load.image('runner', '/assets/runnerBasic.png');
    this.game.load.image('runnerTank', '/assets/runnerTank.png');
    this.game.load.spritesheet('explosion', '/assets/ex1.png', 50, 50);
};
    var maxHealth = null;

GameState.prototype.create = function() {
    this.game.stage.backgroundColor = 0x4488cc;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // Create Group for Explosion
    this.explosionGroup = this.game.add.group();
    //KEEP WITHINRADIUS UPDATED
    this.withinRadius = [];
    this.targetRadius = 500;
    this.SHOT_DELAY = 100; // milliseconds (10 bullets/second)
    this.BULLET_SPEED = 850; // pixels/second
    this.NUMBER_OF_BULLETS = 20;
    this.runnerDmg = 5;
    this.runnerTankDmg = 2;


    // Create Gun
    this.gun = this.game.add.sprite(40, 400, 'arrow');
    // Set the pivot point to the center of the gun
    this.gun.anchor.setTo(0.5, 0.5);

    //BULLET POOL OBJECT
    this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
        var bullet = this.game.add.sprite(0, 0, 'bullet');
        this.bulletPool.add(bullet);
        // Set its pivot point to the center of the bullet origin
        bullet.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.kill();
    }

    //BASIC RUNNERS GROUP
    this.runners = this.game.add.group();
    this.runners.enableBody = true;

    for(var i = 0; i < 3;i++) {
      var runner = this.runners.create(200 + i, game.world.height - 900 + (i * 250), 'runner', maxHealth);
      // this.game.physics.arcade.enable(runner);
      // this.runners.add(runner);
      runner.body.immovable = true;
      console.log(maxHealth);
    }

    this.runners.setAll('body.velocity.y', 100);

    //TANK RUNNERS GROUP
    this.runnerTanks = this.game.add.group();
    this.runnerTanks.enableBody = true;

    for(var i = 0; i < 3;i++) {
      var runnerTank = this.runnerTanks.create(300 + i * 100, game.world.height - 400 + (i * 100), 'runnerTank', maxHealth);

      runnerTank.body.immovable = true;
      console.log(maxHealth);
    }
};

//BULLET SHOOT
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

//BULLET KILLED PER HEALTH
GameState.prototype.update = function() {

  //BASIC RUNNER DAMAGE
  this.game.physics.arcade.collide(this.bulletPool, this.runners, function(bullet, runner) {
      this.getExplosion(bullet.x, bullet.y);
      bullet.kill();
        if (runner.maxHealth > 0) {
          runner.maxHealth = runner.maxHealth - this.runnerDmg;
        } else if (runner.maxHealth <= 0) {
          var index = this.withinRadius.indexOf(runner)
          if(index >= 0) {
            this.withinRadius.splice(index, 1);
          }
          runner.kill();
          console.log("runner: " + runner.maxHealth);
        }
  }, null, this);

  //TANK RUNNER DAMAGE
  this.game.physics.arcade.collide(this.bulletPool, this.runnerTanks, function(bullet, runnerTank) {
      this.getExplosion(bullet.x, bullet.y);
      bullet.kill();
      if (runnerTank.maxHealth > 0) {
        runnerTank.maxHealth = runnerTank.maxHealth - this.runnerTankDmg;
      } else if (runnerTank.maxHealth <= 0){
        runnerTank.kill();
        var index = this.withinRadius.indexOf(runnerTank)
        if(index >= 0) {
          this.withinRadius.splice(index, 1);
        }
        console.log("runnerTank: " + runnerTank.maxHealth);
      }
  }, null, this);

//BULLET TARGETING
  if (this.game) {
		var withinRadius = [];
    var waveRunners = [];
    //TARGETING RUNNERS
    this.runners.forEachExists(function(runner) {
      waveRunners.push(runner);
    });
    //TARGETING TANK RUNNERS
    this.runnerTanks.forEachExists(function(runnerTank) {
      waveRunners.push(runnerTank);
    });
    //TARGET SHOOTING AREA
    for(i=0; i<waveRunners.length; i++ ) {
			var distance = this.game.physics.arcade.distanceBetween(this.gun, waveRunners[i]);
      console.log(i);
      console.log(waveRunners[i]);
			if (distance<= this.targetRadius) {
				// withinRadius.push(waveRunners[i]);
        if(this.withinRadius.indexOf(waveRunners[i]) < 0) {
          this.withinRadius.push(waveRunners[i]);
        }
				this.gun.rotation = this.game.physics.arcade.angleBetween(this.gun, this.withinRadius[0]);
				this.shootBullet();
			}
		}
    if(this.withinRadius.length > 0) {
      var distanceCurrent = this.game.physics.arcade.distanceBetween(this.gun, this.withinRadius[0]);
      if(distanceCurrent > this.targetRadius) {
        this.withinRadius.shift();
      }
    }
    console.log("Targets in radius: " + this.withinRadius.length);
    // // This way works but without distance and probably won't scale.
    // this.gun.rotation = this.game.physics.arcade.angleBetween(this.gun, this.runners.getClosestTo(this.gun));
    // this.shootBullet();
  }
};

//BULLET EXPLOSION
GameState.prototype.getExplosion = function(x, y) {
    var explosion = this.explosionGroup.getFirstDead();
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,11,12], 30, false);
        animation.killOnComplete = true;

        this.explosionGroup.add(explosion);
    }
    explosion.revive();
    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;
    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);
    explosion.animations.play('boom');
    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);
