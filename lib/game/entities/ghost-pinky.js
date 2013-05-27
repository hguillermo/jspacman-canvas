ig.module(
  'game.entities.ghost-pinky'
)
  .requires(
    'game.entities.ghost'
  )
  .defines(function () {
    EntityGhostPinky = EntityGhost.extend({
      _wmIgnore: false,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        // pink ghost
        this.setupAnimation(1);
        this.direction = 'down';
        this.currentAnim = this.anims.down;
        this.vel.x = 0;
        this.vel.y = 40;

        this.isInHouse = true;
        this.startingPosition = {x: 108, y: 136};

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

        this.name  = 'pinky';
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

          // set the target point
          targetD = pacman1.direction;
          if (targetD === 'left') {
            targetX = pacman1.pos.x + 4 - (4 * 8);
            targetY = pacman1.pos.y + 4;
          } else if (targetD === 'right') {
            targetX = pacman1.pos.x + 4 + (4 * 8);
            targetY = pacman1.pos.y + 4;
          } else if (targetD === 'up') {
            targetX = pacman1.pos.x + 4 - (4 * 8);
            targetY = pacman1.pos.y + 4 - (4 * 8);
          } else if (targetD === 'down') {
            targetX = pacman1.pos.x;
            targetY = pacman1.pos.y + 4 + (4 * 8);
          }
          targetP = {x: targetX, y: targetY};

          // calculate all the distances to the target
          for (i = 0; i < options.length; i++) {
            options[i].distanceToTarget = this.distance(options[i], targetP);
          }

          // calculate the new direction based on the min distance to target
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
          // if the ghost is in edible mode run away
          if (this.isInEdibleMode) {
            idx = idxMax;
          } else {
            idx = idxMin;
          }

          // set the new direction
          this.nextDirection.direction = options[idx].direction;
        }
      },

      goToTheHouse: function () {
        if (this.pos.x === 108 && this.pos.y === 112) {
          this.vel.y = this.curVel.y;
          this.vel.x = 0;
          return;
        }
        if (this.pos.x === 108 && this.pos.y >= 136) {
          this.isInEdibleMode = false;
          this.isInHouse      = true;
          this.isInEyeMode    = false;
          this.isInBonusMode  = false;
          this.isEdible       = false;
          this.isManualMove   = false;
          return;
        }

        this.updateDirection();
        this.getNextDirections();
        this.decideNextDirectionGoingHome(108, 136);
      },

      getOutOfHouse: function () {
        this.direction = 'up';
        if (!this.isInEdibleMode) {
          this.currentAnim = this.anims.up;
        }
        this.vel.x = 0;
        this.vel.y = -40;

        if (this.pos.y === 112) {
          this.isInHouse = false;
          this.nextDirection = {x: 108, y: 112, direction: 'left'};
          this.updateDirection();
        }
      }
    });
  });