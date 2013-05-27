ig.module(
  'game.screens.intro-screen'
)
  .requires(
    'impact.game'
  )
  .defines(function () {

    IntroScreen = ig.Game.extend({

      init: function () {
        this.cur = 0;
        this.end = 39;
        this.img = [];
        var i;
        for (i = 0; i <= this.end; i++) {
          this.img.push(new ig.Image('media/animations/gameloading/1gameloading' + i + '.jpg'));
        }
        this.timer = new ig.Timer();
        this.delay = 0.10;
      },

      update: function () {
        // Update all entities and backgroundMaps
        this.parent();

        if (this.timer.delta() >= this.delay) {
          this.cur++;
          this.timer.reset();
          if (this.cur > this.end) {
            ig.system.setGameNow(DemoScreen, null);
          }
        }
      },

      draw: function () {
        // Draw all entities and backgroundMaps
        this.parent();

        if (this.cur <= this.end) {
          this.img[this.cur].draw(0, 0);
        }
      }
    });
  });