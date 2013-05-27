ig.module(
  'game.entities.ghost'
)
  .requires(
    'impact.entity',
    'game.settings.general'
  )
  .defines(function () {

    EntityGhost = ig.Entity.extend({
      _wmIgnore: true,
      size: {x: 8, y: 8},
      offset: {x: 4, y: 4},
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.PASSIVE,
      gravityFactor: 0,
      animSheet: new ig.AnimationSheet('media/ghost4.png', 16, 16),
      bounciness: 0,
      zIndex: 20,

      direction: 'right',
      nextDirection: {x: -1, y: -1, direction: ''},
      nextDirectionOptions: [],

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        var ls = GameSettings.levelSettings();
        var gs = GameSettings.settings;
        this.curVel         = {x: ls.ghostSpeed * gs.ghostsMaxSpeed, y: ls.ghostSpeed * gs.ghostsMaxSpeed};
        this.curVelEyeMode  = {x: gs.ghostsMaxSpeed, y: gs.ghostsMaxSpeed};
        this.curVelBlueMode = {x: ls.ghostFrightened * gs.ghostsMaxSpeed, y: ls.ghostFrightened * gs.ghostsMaxSpeed};
        this.curVelInTunnel = {x: ls.ghostTunnelSpeed * gs.ghostsMaxSpeed, y: ls.ghostTunnelSpeed * gs.ghostsMaxSpeed};

        this.vel.x = this.curVel.x;
        this.vel.y = 0;

        // variables to control the ghosts in edible mode
        this.timer = new ig.Timer();
        this.timer.pause();
        this.totalTimeEdibleMode      = ls.blueTime;
        this.isEdibleModeStarting     = false;
        this.isEdibleModeTimerStarted = false;

        this.isInEdibleMode = false;
        this.isInHouse      = true;
        this.isInEyeMode    = false;
        this.isInBonusMode  = false;
        this.isManualMove   = false;
        this.isInTunnel     = false;
        this.isInTunnel1st  = false;
        this.isInDemoMode   = false;
        // this.isDirChanged   = false;

        this.isEdible = false;
      },

      setupAnimation: function (offset) {
        // offset based on the ghost png file
        offset *= 8;

        // Add the animations
        this.addAnim('right',     0.10, [offset, 1 + offset]);
        this.addAnim('left',      0.10, [2 + offset, 3 + offset]);
        this.addAnim('up',        0.10, [4 + offset, 5 + offset]);
        this.addAnim('down',      0.10, [6 + offset, 7 + offset]);
        this.addAnim('blue',      0.10, [32, 33]);
        this.addAnim('white',     0.25, [32, 34, 33, 35]);
        this.addAnim('eyesright', 1,    [36]);
        this.addAnim('eyesleft',  1,    [37]);
        this.addAnim('eyesup',    1,    [38]);
        this.addAnim('eyesdown',  1,    [39]);
        this.addAnim('bonus200',  1,    [40]);
        this.addAnim('bonus400',  1,    [41]);
        this.addAnim('bonus800',  1,    [42]);
        this.addAnim('bonus1600', 1,    [43]);
      },

      edibleMode: function (val) {
        this.isInEdibleMode = val;
        this.isEdibleModeStarting = true;
        this.isEdibleModeTimerStarted = false;
      },

      update: function () {
        if (ig.game.states && ig.game.states.isGamePaused && !this.isInEyeMode) {
          return;
        }

        if (ig.game.states && ig.game.states.isPacmanDead) {
          this.vel.x = 0;
          this.vel.y = 0;
        }

        if (this.isInEyeMode) {
          this.goToTheHouse();
          this.adjustGhostInTunnel();
          this.parent();
          return;
        }

        if (this.isInHouse) {
          this.adjustEdibleMode();
          this.getOutOfHouse();
          this.parent();
          return;
        }

        this.updateDirection();
        this.getNextDirections();
        this.adjustEdibleMode();
        this.adjustGhostInTunnel();

        this.parent();
      },

      adjustAnimationAndSpeed: function () {
        var eyeModeAnim = '';
        var speed = this.curVel;
        if (this.isInEyeMode) {
          eyeModeAnim = 'eyes';
          speed = this.curVelEyeMode;
        }
        if (this.isInTunnel) {
          speed = this.curVelInTunnel;
        } else if (this.isInEdibleMode) {
          speed = this.curVelBlueMode;
        }

        var d = this.direction;
        if (!this.isInEdibleMode) {
          this.currentAnim = this.anims[eyeModeAnim + d];
        }
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
          this.vel.y = speed.y;
        }
      },

      adjustEdibleMode: function () {
        if (this.isInEdibleMode && !this.isEdibleModeTimerStarted) {
          this.timer = new ig.Timer();
          this.isEdibleModeTimerStarted = true;
          this.adjustAnimationAndSpeed();
          return true;
        }

        if (this.isInEdibleMode && this.isEdibleModeTimerStarted) {
          if (this.timer.delta() <= this.totalTimeEdibleMode - 2) {
            this.currentAnim = this.anims.blue;
          } else if (this.timer.delta() <= this.totalTimeEdibleMode) {
            this.currentAnim = this.anims.white;
          } else {
            this.isInEdibleMode = false;
            this.isEdible       = false;
            this.isEdibleModeTimerStarted = false;
            this.adjustAnimationAndSpeed();
          }
        }
      },

      adjustGhostInTunnel: function () {
        if (this.pos.x < 0 && this.pos.y === 136 && this.direction === 'left') {
          this.pos.x = 256;
          this.pos.y = 136;
        } else if (this.pos.x >= 256 && this.pos.y === 136 && this.direction === 'right') {
          this.pos.x = 0;
          this.pos.y = 136;
        }
        if (this.pos.y === 136 &&
            ((this.pos.x >= 176 && this.pos.x <= 272) ||
            (this.pos.x >= 0 && this.pos.x <= 48))) {
          this.isInTunnel = true;
          if (!this.isInTunnel1st && !ig.game.states.isPacmanDead) {
            this.adjustAnimationAndSpeed();
            this.isInTunnel1st = true;
          }
        } else {
          this.isInTunnel = false;
          if (this.isInTunnel1st && !ig.game.states.isPacmanDead) {
            this.adjustAnimationAndSpeed();
            this.isInTunnel1st = false;
          }
        }
      },

      adjustGhostIfStucked: function () {
        // TODO: This is a patch. Sometime the ghost gets stucked. The changeDirection method is causing the bug
        if (this.pos.x === this.last.x && this.pos.y === this.last.y) {

        }
      },

      changeDirection: function () {
        // if (this.nextDirection.direction.length !== 0) {
        //   this.isDirChanged = false;
        //   return;
        // }
        // this.isDirChanged = true;
        var dirs = this.getDirectionsCanMove();

        if (this.direction === 'left') {
          if (dirs.right) {
            this.direction = 'right';
          } else if (dirs.up) {
            this.direction = 'up';
          } else if (dirs.down) {
            this.direction = 'down';
          }
        } else if (this.direction === 'right') {
          if (dirs.left) {
            this.direction = 'left';
          } else if (dirs.up) {
            this.direction = 'up';
          } else if (dirs.down) {
            this.direction = 'down';
          }
        } else if (this.direction === 'up') {
          if (dirs.down) {
            this.direction = 'down';
          } else if (dirs.right) {
            this.direction = 'right';
          } else if (dirs.left) {
            this.direction = 'left';
          }
        } else if (this.direction === 'down') {
          this.direction = 'up';
          if (dirs.up) {
            this.direction = 'up';
          } else if (dirs.right) {
            this.direction = 'right';
          } else if (dirs.left) {
            this.direction = 'left';
          }
        }
        this.adjustAnimationAndSpeed();
        // this.nextDirection = {x: -1, y: -1, direction: ''};
        this.getNextDirections();
        this.updateDirection();
      },

      updateDirection: function () {
        var d = this.nextDirection.direction;
        var c = this.direction;
        if (d.length === 0 || d === c) {
          return;
        }

        var eyeModeAnim = '';
        var speed = this.curVel;
        if (this.isInEyeMode) {
          eyeModeAnim = 'eyes';
          speed = this.curVelEyeMode;
        }
        if (this.isInTunnel) {
          speed = this.curVelInTunnel;
        } else if (this.isInEdibleMode) {
          speed = this.curVelBlueMode;
        }

        if (Math.abs(this.nextDirection.x - this.pos.x) <= 3 &&
            Math.abs(this.nextDirection.y - this.pos.y) <= 3) {
          this.pos.x = this.nextDirection.x;
          this.pos.y = this.nextDirection.y;
          this.direction = d;
          if (!this.isInEdibleMode) {
            this.currentAnim = this.anims[eyeModeAnim + d];
          }
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
            this.vel.y = speed.y;
          }

          this.nextDirection = {x: -1, y: -1, direction: ''};
        }
      },

      getDirectionsCanMove: function() {
        var m, c, canGoLeft, canGoRight, canGoUp, canGoDown;
        var x = this.pos.x, y = this.pos.y, x2, y2;

        var directionsCanMoveOptions = {};

        if (this.direction === 'down' || this.direction === 'up') {
          m  = Math.floor(y / 8);
          y2 = m * 8;
          c = ig.game.collisionMap.trace(x, y2, 0, 8, 1, 1).collision;
          directionsCanMoveOptions.down = (!c.y) ? true : false;
          c = ig.game.collisionMap.trace(x, y2, 0, -8, 1, 1).collision;
          directionsCanMoveOptions.up = (!c.y) ? true : false;
        }
        if (this.direction === 'right' || this.direction === 'left') {
          m   = Math.floor(x / 8);
          x2  = m * 8;
          c = ig.game.collisionMap.trace(x2, y, 8, 0, 1, 1).collision;
          directionsCanMoveOptions.right = (!c.x) ? true : false;
          c = ig.game.collisionMap.trace(x2, y, -8, 0, 1, 1).collision;
          directionsCanMoveOptions.left = (!c.x) ? true : false;
        }

        return directionsCanMoveOptions;
      },

      getNextDirections: function () {
        var m, c, d, canGoLeft, canGoRight, canGoUp, canGoDown;
        var x = this.pos.x, y = this.pos.y, x2, y2, x3, y3;

        this.nextDirectionOptions = [];

        if (this.direction === 'down') {
          m   = Math.floor(y / 8);
          y2  = m * 8;
          d   = y - y2; // close to the current tile
          y3  = y2 + 8; // this is the next tile
          c   = ig.game.collisionMap.trace(x, y2, 0, 8, 1, 1).collision;

          if (d <= 4 && !c.x && !c.y && d !== 0) {
            canGoLeft   = (ig.game.collisionMap.trace(x, y3, -9, 0, 8, 8)).collision.x ? false : true;
            canGoRight  = (ig.game.collisionMap.trace(x, y3, 9, 0, 8, 8)).collision.x ? false : true;
            canGoDown   = (ig.game.collisionMap.trace(x, y3, 0, 9, 8, 8)).collision.y ? false : true;

            if (canGoLeft) {
              this.nextDirectionOptions.push({x: x + 4 - 8, y: y3 + 4, direction: 'left'});
            }
            if (canGoRight) {
              this.nextDirectionOptions.push({x: x + 4 + 8, y: y3 + 4, direction: 'right'});
            }
            if (canGoDown) {
              this.nextDirectionOptions.push({x: x + 4, y: y3 + 4 + 8, direction: 'down'});
            }
            this.nextDirection.x = x;
            this.nextDirection.y = y3;
          }
        } else if (this.direction === 'up') {
          m   = Math.floor(y / 8);
          y2  = m * 8;
          d   = y - y2; // close to the current tile
          y3  = y2 - 8; // this is the next tile
          c   = ig.game.collisionMap.trace(x, y2, 0, -8, 1, 1).collision;

          if (d <= 4 && !c.x && !c.y && d !== 0) {
            canGoLeft   = (ig.game.collisionMap.trace(x, y3, -9, 0, 8, 8)).collision.x ? false : true;
            canGoRight  = (ig.game.collisionMap.trace(x, y3, 9, 0, 8, 8)).collision.x ? false : true;
            canGoUp     = (ig.game.collisionMap.trace(x, y3, 0, -9, 8, 8)).collision.y ? false : true;

            if (canGoLeft) {
              this.nextDirectionOptions.push({x: x + 4 - 8, y: y3 + 4, direction: 'left'});
            }
            if (canGoRight) {
              this.nextDirectionOptions.push({x: x + 4 + 8, y: y3 + 4, direction: 'right'});
            }
            if (canGoUp) {
              this.nextDirectionOptions.push({x: x + 4, y: y3 + 4 - 8, direction: 'up'});
            }
            this.nextDirection.x = x;
            this.nextDirection.y = y3;
          }
        } else if (this.direction === 'right') {
          m   = Math.floor(x / 8);
          x2  = m * 8;
          d   = x - x2; // close to the current tile
          x3  = x2 + 8; // this is the next tile
          c   = ig.game.collisionMap.trace(x2, y, 8, 0, 1, 1).collision;

          if (d <= 4 && !c.x && !c.y && d !== 0) {
            canGoUp     = (ig.game.collisionMap.trace(x3, y, 0, -9, 8, 8)).collision.y ? false : true;
            canGoDown   = (ig.game.collisionMap.trace(x3, y, 0, 9, 8, 8)).collision.y ? false : true;
            canGoRight  = (ig.game.collisionMap.trace(x3, y, 9, 0, 8, 8)).collision.x ? false : true;

            // avoid ghost going back to the ghost house.
            if (y === 112 && x >= 88 && x <= 136) {
              if (this.isInEyeMode && Math.abs(x - 108) <= 3) {
                this.pos.x = 108;
                this.vel.x = 0;
                canGoDown = true;
                this.isManualMove = true;
              } else {
                canGoDown = false;
              }
            }

            if (canGoUp) {
              this.nextDirectionOptions.push({x: x3 + 4, y: y + 4 - 8, direction: 'up'});
            }
            if (canGoDown) {
              this.nextDirectionOptions.push({x: x3 + 4, y: y + 4 + 8, direction: 'down'});
            }
            if (canGoRight) {
              this.nextDirectionOptions.push({x: x3 + 4 + 8, y: y + 4, direction: 'right'});
            }
            this.nextDirection.x = x3;
            this.nextDirection.y = y;
          }
        } else if (this.direction === 'left') {
          m   = Math.floor(x / 8);
          x2  = m * 8;
          d   = x - x2; // close to the current tile
          x3  = x2 - 8; // this is the next tile
          c   = ig.game.collisionMap.trace(x2, y, -8, 0, 1, 1).collision;

          if (d <= 4 && !c.x && !c.y && d !== 0) {
            canGoUp     = (ig.game.collisionMap.trace(x3, y, 0, -9, 8, 8)).collision.y ? false : true;
            canGoDown   = (ig.game.collisionMap.trace(x3, y, 0, 9, 8, 8)).collision.y ? false : true;
            canGoLeft   = (ig.game.collisionMap.trace(x3, y, -9, 0, 8, 8)).collision.x ? false : true;

            // avoid ghost going back to the house. check this!!! not sure if it is working
            if (y === 112 && x >= 88 && x <= 136) {
              if (this.isInEyeMode && Math.abs(x - 108) <= 3) {
                this.pos.x = 108;
                this.vel.x = 0;
                canGoDown = true;
                this.isManualMove = true;
              } else {
                canGoDown = false;
              }
            }

            if (canGoUp) {
              this.nextDirectionOptions.push({x: x3 + 4, y: y + 4 - 8, direction: 'up'});
            }
            if (canGoDown) {
              this.nextDirectionOptions.push({x: x3 + 4, y: y + 4 + 8, direction: 'down'});
            }
            if (canGoLeft) {
              this.nextDirectionOptions.push({x: x3 + 4 - 8, y: y + 4, direction: 'left'});
            }
            this.nextDirection.x = x3;
            this.nextDirection.y = y;
          }
        }
      },

      decideNextDirectionGoingHome: function (targetX,  targetY) {
        // decide what is the new direction for the ghost in the next intersetion
        var options = this.nextDirectionOptions;

        // decide what is the new direction for the ghost in the next intersetion
        if (options.length > 0) {
          var i, d;

          // set the ghost house target point
          targetP = {x: targetX, y: targetY};

          // calculate all the distances to the ghost house target
          for (i = 0; i < options.length; i++) {
            options[i].distanceToTarget = this.distance(options[i], targetP);
          }

          // calculate the new direction based on the min distance to target
          var idx = 0, min = options[idx].distanceToTarget;
          for (i = 1; i < options.length; i++) {
            d = options[i].distanceToTarget;
            if (min > d) {
              min = d;
              idx = i;
            }
          }

          // set the new direction
          this.nextDirection.direction = options[idx].direction;
        }
      },

      distance: function (p1, p2) {
        var xs = 0, ys = 0;

        xs = p2.x - p1.x;
        xs = xs * xs;
        ys = p2.y - p1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
      }
    });
  });