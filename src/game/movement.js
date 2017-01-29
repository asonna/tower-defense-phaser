function movement(platformObjs) {
	if(cursors.left.isDown) {
		player.body.velocity.x = -150;
		if(platformObjs) {
			player.animations.play('left');
		} else {
			player.animations.stop();
			player.frame = 3;
		}
	} else if(cursors.right.isDown) {
		player.body.velocity.x = 150;
		if(platformObjs) {
			player.animations.play('right');
		} else {
			player.animations.stop();
			player.frame = 6;
		}
	} else {
		player.animations.stop();
		player.frame = 4;
	}

	if(cursors.up.isDown && player.body.touching.down && platformObjs) {
		player.body.velocity.y = -350;
	}

	if(!platformObjs && cursors.down.isDown) {
		player.body.velocity.y = 300;
	}
}
