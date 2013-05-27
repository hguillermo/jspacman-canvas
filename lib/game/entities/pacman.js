ig.module(
  'game.entities.pacman'
)
  .requires(
    'impact.entity'
  )
  .defines(function () {

    EntityPacman = ig.Entity.extend({
      size: {x: 8, y: 8},
      offset: {x: 4, y: 4},
      type: ig.Entity.TYPE.A,
      checkAgainst: ig.Entity.TYPE.B,
      collides: ig.Entity.COLLIDES.PASSIVE,
      gravityFactor: 0,
      bounciness: 0,
      zIndex: 10,
      animSheet: new ig.AnimationSheet('media/pacman4.png', 16, 16),

      direction: 'left',
      startingPosition: {x: 108, y: 208},
      isPacmanDying: false,
      isPacmanDyingTimerStarted: false,
      isPacmanDyingAnimationStarted: false,
      isPacmanEatingDot: false,
      isPacmanHidden: false,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        // Add the animations
        this.addAnim('close',       0.06,   [8]);
        this.addAnim('left',        0.06,   [4, 5]);
        this.addAnim('right',       0.06,   [0, 1]);
        this.addAnim('down',        0.06,   [2, 3]);
        this.addAnim('up',          0.06,   [6, 7]);
        this.addAnim('openright',   1,      [1]);
        this.addAnim('openleft',    1,      [4]);
        this.addAnim('openup',      1,      [7]);
        this.addAnim('opendown',    1,      [2]);
        this.addAnim('hidden',      1,      [21]);
        this.addAnim('dying',       0.15,   [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 20]);

        var ls = GameSettings.levelSettings();
        var gs = GameSettings.settings;
        this.curVel = {};
        this.curVel.x = ls.pacmanSpeed * gs.pacmanMaxSpeed;
        this.curVel.y = ls.pacmanSpeed * gs.pacmanMaxSpeed;
        this.curVelDots = {};
        this.curVelDots.x = ls.pacmanSpeedDots * gs.pacmanMaxSpeed;
        this.curVelDots.y = ls.pacmanSpeedDots * gs.pacmanMaxSpeed;
        this.vel.x = -this.curVel.x;
        this.vel.y = 0;
        // this.numberOfLifes = ig.game.settings.numberOfInitialLifes;

        if (x === undefined || y === undefined) {
          this.pos.x = this.startingPosition.x;
          this.pos.y = this.startingPosition.y;
        }

        this.timer = new ig.Timer();
        this.timer.pause();

        this.isPacmanDead = false;
      },

      check: function (other) {
        var ghost = other;
        if (ghost instanceof EntityGhost && !ghost.isEdible) {
          ig.game.states.isPacmanDead = true;
          this.isPacmanDead   = true; // TODO: is this better than the previous line
          this.isPacmanDying  = true;
        } else if (ghost instanceof EntityGhost && ghost.isInEdibleMode && !ghost.isInEyeMode && !ghost.isInHouse) {
          this.isPacmanHidden = true;
          ghost.isInEdibleMode = false;
          ghost.isInBonusMode = true;

          var settings = GameSettings.settings;
          var bonusAnimation = 'bonus' + (200 * settings.currentMultiplier).toString();
          settings.currentMultiplier *= settings.multiplier;
          ghost.currentAnim = ghost.anims[bonusAnimation];
          ig.game.states.isGamePaused = true;
          ig.game.states.isGhostDeadStarting = true;
          ig.game.states.ghostsToUpdate.push(ghost);

          ig.game.players.player1.score += (200 * settings.currentMultiplier);
          ig.game.players.player1.eatenGhosts += 1;
        }
      },

      update: function () {
        if (ig.game.states.isGamePaused) {
          return;
        }

        if (ig.game.states && ig.game.states.isPacmanDead) {
          if (this.showDyingAnimation()) {
            return;
          }
        }

        this.adjustY();
        this.adjustX();
        this.checkWhenInTunnel();
        this.updateDots();
        this.adjustAnimationWhenNotMoving();

        this.parent();
      },

      showDyingAnimation: function () {
        if (this.isPacmanDying) {
          if (!this.isPacmanDyingTimerStarted) {
            this.timer = null;
            this.timer = new ig.Timer();
            this.timer.reset();
            this.vel.x = 0;
            this.vel.y = 0;
            this.isPacmanDyingTimerStarted = true;
            return true;
          }
          if (this.isPacmanDyingTimerStarted &&
              this.timer.delta() < 1.0) {
            return true;
          }
          if (!this.isPacmanDyingAnimationStarted) {
            var i, ghosts = ig.game.getEntitiesByType(EntityGhost);
            for (i = 0; i < ghosts.length; i++) {
              ghosts[i].kill();
            }
            var fruits = ig.game.getEntitiesByType(EntityFruit);
            for (i = 0; i < fruits.length; i++) {
              fruits[i].kill();
            }
            this.currentAnim = this.anims.dying;
            //this.currentAnim.rewind(); // this didn't udpate the frame value to 0
            this.currentAnim.gotoFrame(0);
            this.isPacmanDyingAnimationStarted = true;
            return true;
          }
          if (this.isPacmanDyingAnimationStarted && this.currentAnim.frame === 11) {
            this.timer.pause();

            this.pos.x = this.startingPosition.x;
            this.pos.y = this.startingPosition.y;
            this.setStatusClose();

            this.isPacmanDying = false;
            this.isPacmanDyingTimerStarted = false;
            this.isPacmanDyingAnimationStarted = false;

            ig.game.states.isPacmanDead = false;
            ig.game.states.isLevelStarting = true;
            ig.game.states.isLevelStartingTimerStarted = false;
            ig.game.states.isGamePaused = true;

            ig.game.players.player1.lifes -= 1;
            ig.game.checkGameIsOver();

            return false;
          }

          this.parent();
          return true;
        }
      },

      adjustAnimationWhenNotMoving: function () {
        if (!ig.game.states.isLevelStarting && !this.isPacmanHidden && !ig.game.states.isLevelCompleted) {
          if (this.pos.x === this.last.x && this.pos.y === this.last.y) {
            this.currentAnim = this.anims['open' + this.direction];
          }
        }
      },

      adjustY: function () {
        var m, d, check, xCornering = 0, yCornering = 0;
        var x = this.pos.x, y = this.pos.y;

        m = Math.floor(y / 8);
        m = (y % 8 === 0) ? m-- : m;
        d = Math.abs(y - m * 8);

        if (ig.input.state('left') && this.direction !== 'left') {
          // going up to left
          check = ig.game.collisionMap.trace(x + 4, (m * 8) + 4, -8, 0, 1, 1);
          xCornering = -2;
          if (d <= 3 && xCornering !== 0 && !check.collision.x) {
            this.pos.y = m * 8;
            this.pos.x += xCornering;
            this.direction = 'left';
            this.adjustAnimationAndSpeed();
          }
        } else if (ig.input.state('right') && this.direction !== 'right') {
          // going up to right
          check = ig.game.collisionMap.trace(x + 4, (m * 8) + 4, 8, 0, 1, 1);
          xCornering = 2;
          if (d <= 3 && xCornering !== 0 && !check.collision.x) {
            this.pos.y = m * 8;
            this.pos.x += xCornering;
            this.direction = 'right';
            this.adjustAnimationAndSpeed();
          }
        }
      },

      adjustX: function () {
        var m, d, check, xCornering = 0, yCornering = 0;
        var x = this.pos.x, y = this.pos.y;

        m = Math.floor(x / 8);
        m = (x % 8 === 0) ? m-- : m;
        d = Math.abs(x - m * 8);

        if (ig.input.state('up')  && this.direction !== 'up') {
          // going left to up
          check = ig.game.collisionMap.trace((m * 8) + 4, y + 4, 0, -8, 1, 1);
          yCornering = -2;
          if (d <= 3 && yCornering !== 0 && !check.collision.y) {
            this.pos.x = m * 8;
            this.pos.y += yCornering;
            this.direction = 'up';
            this.adjustAnimationAndSpeed();
          }
        } else if (ig.input.state('down') && this.direction !== 'down') {
          // avoid pacman going into the ghost house
          if (y === 112 && x >= 88 && x <= 136) {
            return;
          }
          // going left to down
          check = ig.game.collisionMap.trace((m * 8) + 4, y + 4, 0, 8, 1, 1);
          yCornering = 2;
          if (d <= 3 && yCornering !== 0 && !check.collision.y) {
            this.pos.x = m * 8;
            this.pos.y += yCornering;
            this.direction = 'down';
            this.adjustAnimationAndSpeed();
          }
        }
      },

      updateDots: function () {
        if (!ig.game.backgroundMaps[0]) {
          return;
        }
        var x = this.pos.x + 4, y = this.pos.y + 4;
        var dot = ig.game.backgroundMaps[0].getTile(x, y);
        if (dot === 114) {
          ig.game.status.eatenDots++;
          ig.game.backgroundMaps[0].setTile(x, y, 0);
          ig.game.maze.mapDots.push({x: x, y: y});

          ig.game.players.player1.score += 10;
          this.isPacmanEatingDot = true;
          this.adjustAnimationAndSpeed();
          var self = this;
          setTimeout(function () {
            self.isPacmanEatingDot = false;
            if (!ig.game.states.isPacmanDead && !ig.game.states.isLevelCompleted) {
              self.adjustAnimationAndSpeed();
            }
          }, 100);
        }
      },

      adjustAnimationAndSpeed: function () {
        if (this.isPacmanHidden) {
          this.setStatusHidden();
          return;
        }
        var speed = this.curVel;
        if (this.isPacmanEatingDot) {
          speed = this.curVelDots;
        }
        var d = this.direction;
        this.currentAnim = this.anims[d];
        if (d === 'left') {
          this.vel.x = -speed.x;
          this.vel.y = 0;
        } else if (d === 'right') {
          this.vel.x = speed.x;
          this.vel.y = 0;
        } else if (d === 'up') {
          this.vel.x = 0;
          this.vel.y = -speed.y;
        } else if (d === 'down') {
          this.vel.x = 0;
          this.vel.y = speed.x;
        }
      },

      setStatusReady: function () {
        this.direction = 'left';
        this.adjustAnimationAndSpeed();
        this.pos.x = this.startingPosition.x;
        this.pos.y = this.startingPosition.y;
        // BUG: Impact doesn't update the last until the next key input.
        this.last.x = -1;
        this.last.y = -1;
      },

      setStatusClose: function () {
        this.vel.x = 0;
        this.vel.y = 0;
        this.currentAnim = this.anims.close;
        this.direction = 'stopped';
      },

      setStatusHidden: function () {
        this.currentAnim = this.anims.hidden;
      },

      checkWhenInTunnel: function () {
        if (this.pos.x < 0 && this.pos.y === 136 && this.direction === 'left') {
          this.pos.x = 256;
          this.pos.y = 136;
        } else if (this.pos.x >= 256 && this.pos.y === 136 && this.direction === 'right') {
          this.pos.x = 0;
          this.pos.y = 136;
        }
      }
    });
  });