ig.module(
  'game.entities.bigdot'
)
  .requires(
    'impact.entity'
  )
  .defines(function () {

    EntityBigdot = ig.Entity.extend({
      size: {x: 8, y: 8},
      offset: {x: 4, y: 4},
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.PASSIVE,
      gravityFactor: 0,
      animSheet: new ig.AnimationSheet('media/ghost4.png', 16, 16),
      bounciness: 0,
      zIndex: -10,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.addAnim('bigdot', 0.15, [48, 55]);
        this.currentAnim = this.anims.bigdot;
      },

      check: function (other) {
        if (other instanceof EntityPacman) {
          ig.game.status.eatenDots++;

          var i, ghosts = ig.game.getEntitiesByType(EntityGhost);
          for (i = 0; i < ghosts.length; i++) {
            ghosts[i].edibleMode(true);
            ghosts[i].isEdible = true; // TODO: Move this to a method
            if (!ghosts[i].isInHouse) {
              ghosts[i].changeDirection();
            }
          }
          this.kill();

          GameSettings.settings.currentMultiplier = 1;
          ig.game.players.player1.score += 50;
        }
      },

      update: function () {
        this.parent();
      }
    });
  });