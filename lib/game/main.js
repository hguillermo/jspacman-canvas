ig.module(
  'game.main'
)
  .requires(
    'game.screens.intro-screen',
    'game.screens.demo-screen',
    'game.screens.game-screen'
  )
  .defines(function () {

    ig.System.inject({
      setGameNow: function (gameClass, startLevel) {
        ig.game = new (gameClass)(startLevel);
        ig.system.setDelegate(ig.game);
      }
    });

    ig.startNewGame = function (fps, width, height, scale) {
      ig.main('#canvas', IntroScreen, fps, width, height, scale);
    };

    ig.startNewGame(30, 224, 288, 2);
  });