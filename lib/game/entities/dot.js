ig.module(
  'game.entities.dot'
)
  .requires(
    'impact.entity'
  )
  .defines(function () {

    EntityDot = ig.Entity.extend({
      size: {x: 8, y: 8},

      offset: {x: 4, y: 4},

      type: ig.Entity.TYPE.A, // Player friendly group

      checkAgainst: ig.Entity.TYPE.NONE,

      collides: ig.Entity.COLLIDES.PASSIVE,

      gravityFactor: 0,

      animSheet: new ig.AnimationSheet('media/ghost4.png', 16, 16),

      bounciness: 0,

      direction: 'right',

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        // Add the animations
        this.addAnim('dot', 10, [44]);

        this.maxVel.x = 0;
        this.maxVel.y = 0;

        this.vel.x = 0;
        this.vel.y = 0;

        this.currentAnim = this.anims.dot;
      },

      update: function () {
        // check if pacman collided this
        //var pacman = ig.game.entities[0].pos;

        // var check = ig.game.collisionMap.trace(pacman.x, pacman.y, 0, 0, 8, 8);
        // if(check.collision.y || check.collision.x){
        //  this.kill();
        // }

        var pacman = ig.game.getEntitiesByType(EntityPacman)[0];
        if (pacman && Math.abs(this.pos.x - pacman.pos.x) < 4 && Math.abs(this.pos.y - pacman.pos.y) < 4) {
          this.kill();

          totalDots++;
        }

        // move
        //this.parent();
      }
    });

  });