ig.module(
  'game.entities.fruit-points'
)
  .requires(
    'impact.entity'
  )
  .defines(function () {

    EntityFruitPoints = ig.Entity.extend({
      size: {x: 8, y: 8},
      offset: {x: 4, y: 4},
      type: ig.Entity.TYPE.NONE,
      checkAgainst: ig.Entity.TYPE.NONE,
      collides: ig.Entity.COLLIDES.NEVER,
      gravityFactor: 0,
      imageSheet: new ig.Image('media/ghost4.png'),
      startingPosition: {x: 108, y: 160},
      bounciness: 0,
      zIndex: -10,
      points: 0,

      init: function (x, y, settings) {
        this.parent(x, y, settings);

        // set the tiles to represent the fruits bouns points
        this.bonusPointsTiles = {
          100: [44, 49, 44],
          300: [44, 50, 44],
          500: [44, 51, 44],
          700: [44, 52, 44],
          1000: [44, 53, 54],
          2000: [57, 58, 54],
          3000: [59, 60, 54],
          5000: [61, 62, 54]
        };

        this.timer = new ig.Timer();
        this.delay = 2.5;

        if (x === undefined || y === undefined) {
          this.pos.x = this.startingPosition.x;
          this.pos.y = this.startingPosition.y;
        }
      },

      bonusPoints: function (points) {
        // create the images to show the points
        this.currentTilesToShow = this.bonusPointsTiles[points.toString()];
      },

      update: function () {
        this.parent();

        if (this.timer.delta() > this.delay) {
          this.kill();
        }
      },

      draw: function () {
        this.parent();

        this.imageSheet.drawTile(this.startingPosition.x - 4 - 16, this.startingPosition.y - 4, this.currentTilesToShow[0], 16);
        this.imageSheet.drawTile(this.startingPosition.x - 4, this.startingPosition.y - 4, this.currentTilesToShow[1], 16);
        this.imageSheet.drawTile(this.startingPosition.x - 4 + 16, this.startingPosition.y - 4, this.currentTilesToShow[2], 16);
      }
    });
  });