ig.module(
  'game.entities.ghost-clyde'
)
  .requires(
    'game.entities.ghost'
  )
  .defines(function () {
    EntityGhostClyde = EntityGhost.extend({
      _wmIgnore: false,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        // orange ghost
        this.setupAnimation(3);
        this.direction = 'up';
        this.currentAnim = this.anims.up;
        this.vel.x = 0;
        this.vel.y = -40;

        this.isInHouse = true;
        this.startingPosition = {x: 124, y: 136};
        this.maxBounces = 40;
        this.curBounces = 0;

        if (x === undefined || y === undefined) {
          this.pos.x = this.startingPosition.x;
          this.pos.y = this.startingPosition.y;
        } else {
          this.pos.x = x;
          this.pos.y = y;
          this.currentAnim = this.anims.right;
          this.vel.x = 0;
          this.vel.y = 0;
          this.isInDemoMode = true;
        }

        this.name  = 'clyde';
      },

      update: function () {
        if (this.isInDemoMode) {
          return;
        }

        this.parent();

        if (this.isInEyeMode) {
          return;
        }

        var options = this.nextDirectionOptions;
        var pacman1 = ig.game.players.player1.pacman;

        // decide what is the new direction for the ghost in the next intersetion
        if (options.length > 0) {
          var i, d, targetX, targetY, targetD;

          // set the pacman target point
          targetX = pacman1.pos.x + 4;
          targetY = pacman1.pos.y + 4;
          targetP = {x: targetX, y: targetY};

          // calculate all the distances to the target
          for (i = 0; i < options.length; i++) {
            options[i].distanceToTarget = this.distance(options[i], targetP);
          }

          // calculate the new direction based on the min and max distance to target
          var idxMin = 0, min = options[idxMin].distanceToTarget, idxMax = 0, max = min, idx;
          for (i = 1; i < options.length; i++) {
            d = options[i].distanceToTarget;
            if (min > d) {
              min = d;
              idxMin = i;
            }
            if (max < d) {
              max = d;
              idxMax = i;
            }
          }

          var distanceToPacman = this.distance(targetP, {x: this.pos.x + 4, y: this.pos.y + 4});
          // if distance to pacman is 8 tiles greater
          if (distanceToPacman >= 8 * 8) {
            // personality like blinky
            idx = idxMin;
          } else {
            // shame personality...run away
            idx = idxMax;
          }
          // if the ghost is in edible mode run away
          if (this.isInEdibleMode) {
            idx = idxMax;
          }

          // set the new direction
          this.nextDirection.direction = options[idx].direction;
        }
      },

      goToTheHouse: function () {
        if (this.pos.x === 108 && this.pos.y === 112 && this.isManualMove) {
          this.vel.y = this.curVel.y;
          this.vel.x = 0;
          return;
        }
        if (this.pos.x === 108 && this.pos.y > 136 && this.isManualMove) {
          this.pos.x = 108 - 3;
          this.pos.y = 136;
          this.vel.y = 0;
          this.vel.x = this.curVel.x;
          return;
        }
        if (this.pos.y === 136 && this.pos.x >= 124 && this.isManualMove) {
          this.direction = 'up';
          this.currentAnim = this.anims.up;
          this.pos.x = 124;
          this.pos.y = 136;
          this.vel.x = 0;
          this.vel.y = -40;
          this.curBounces = 0;
          this.isInEdibleMode = false;
          this.isInHouse      = true;
          this.isInEyeMode    = false;
          this.isInBonusMode  = false;
          this.isEdible       = false;
          this.isManualMove   = false;
          return;
        }
        if (this.isManualMove) {
          return;
        }

        this.updateDirection();
        this.getNextDirections();
        this.decideNextDirectionGoingHome(124, 136);
      },

      getOutOfHouse: function () {
        if (this.pos.y === 112) {
          this.isInHouse = false;
          this.nextDirection = {x: 108, y: 112, direction: 'left'};
          this.updateDirection();
          return;
        }
        if (this.curBounces <= this.maxBounces) {
          if (this.pos.y <= 130) {
            this.curBounces++;
            this.direction = 'down';
            if (!this.isInEdibleMode) {
              this.currentAnim = this.anims.down;
            }
            this.vel.x = 0;
            this.vel.y = 40;
          } else if (this.pos.y >= 142) {
            this.curBounces++;
            this.direction = 'up';
            if (!this.isInEdibleMode) {
              this.currentAnim = this.anims.up;
            }
            this.vel.x = 0;
            this.vel.y = -40;
          }
        } else {
          if (Math.abs(this.pos.y - 136) < 3 && this.pos.x > 108) {
            this.direction = 'left';
            if (!this.isInEdibleMode) {
              this.currentAnim = this.anims.left;
            }
            this.vel.x = -40;
            this.vel.y = 0;
            this.pos.y = 136;
          } else if (this.pos.y === 136 && Math.abs(this.pos.x - 108) < 3) {
            this.direction = 'up';
            if (!this.isInEdibleMode) {
              this.currentAnim = this.anims.up;
            }
            this.vel.x = 0;
            this.vel.y = -40;
            this.pos.x = 108;
          }
        }
      }
    });
  });