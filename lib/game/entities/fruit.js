ig.module(
  'game.entities.fruit'
)
  .requires(
    'impact.entity',
    'game.entities.fruit-points'
  )
  .defines(function () {

    EntityFruit = ig.Entity.extend({
      size: {x: 8, y: 8},
      offset: {x: 4, y: 4},
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.PASSIVE,
      gravityFactor: 0,
      animSheet: new ig.AnimationSheet('media/hud/fruits.png', 16, 16),
      startingPosition: {x: 108, y: 160},
      bounciness: 0,
      zIndex: -10,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.addAnim('fruit0', 1, [0]);
        this.addAnim('fruit1', 1, [1]);
        this.addAnim('fruit2', 1, [2]);
        this.addAnim('fruit3', 1, [3]);
        this.addAnim('fruit4', 1, [4]);
        this.addAnim('fruit5', 1, [5]);
        this.addAnim('fruit6', 1, [6]);
        this.addAnim('fruit7', 1, [7]);

        // the original pacman has 3 values for the random timers
        this.timers = {current: 0, timer0: 9.33, timer1: 10, timer2: 9.75};
        var r = (Math.floor(Math.random() * 3)).toString();
        this.timers.current = this.timers['timer' + r];
        this.timer = new ig.Timer();

        if (x === undefined || y === undefined) {
          this.pos.x = this.startingPosition.x;
          this.pos.y = this.startingPosition.y;
        }

        // set the current animation based on the current level
        var c = ig.game.status.currentLevel;
        var s = GameSettings.levels;
        this.currentFruit = (c > 21) ? s.level21 : s['level' + c];
        this.currentAnim = this.anims['fruit' + this.currentFruit.fruit];

        ig.game.states.isFruitEdible = true;
      },

      check: function (other) {
        if (other instanceof EntityPacman) {
          var p1 = other.pos;
          var p2 = this.pos;
          if (Math.abs(p1.x - p2.x) < 4 && Math.abs(p1.y - p2.y) < 4) {
            if (ig.game.states.isFruitEdible) {
              ig.game.players.player1.score += this.currentFruit.value;
              ig.game.states.isFruitEdible = false;
            }
            this.kill();

            var points = ig.game.spawnEntity(EntityFruitPoints);
            points.bonusPoints(this.currentFruit.value);
            ig.game.sortEntitiesDeferred();
          }
        }
      },

      update: function () {
        this.parent();

        if (this.timer.delta() > this.timers.current) {
          this.kill();
        }
      }
    });
  });