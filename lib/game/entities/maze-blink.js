ig.module(
  'game.entities.maze-blink'
)
  .requires(
    'impact.entity'
  )
  .defines(function () {

    EntityMazeBlink = ig.Entity.extend({
      size: {x: 224, y: 248},

      type: ig.Entity.TYPE.NONE,

      collides: ig.Entity.COLLIDES.NEVER,

      gravityFactor: 0,

      animSheet: new ig.AnimationSheet('media/mazeblinking.png', 224, 248),

      bounciness: 0,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        this.addAnim('mazeblinking', 0.20, [0, 1]);
        this.currentAnim = this.anims.mazeblinking;
      },

      update: function () {
        this.currentAnim = this.anims.mazeblinking;
        this.parent();
      }
    });
  });