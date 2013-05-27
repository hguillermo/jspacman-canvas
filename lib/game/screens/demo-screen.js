ig.module(
  'game.screens.demo-screen'
)
  .requires(
    'impact.game',
    'impact.font',
    'game.entities.ghost',
    'game.entities.ghost-blinky',
    'game.entities.ghost-clyde',
    'game.entities.ghost-inky',
    'game.entities.ghost-pinky',
    'game.entities.pacman',
    'game.entities.bigdot',
    'game.settings.general'
  )
  .defines(function () {

    DemoScreen = ig.Game.extend({
      fontWhite: new ig.Font('media/fonts/pacwb08.font.png'),
      fontRed: new ig.Font('media/fonts/pacrb08.font.png'),
      fontYellow: new ig.Font('media/fonts/pacyb08.font.png'),
      fontBlue: new ig.Font('media/fonts/pacbb08.font.png'),
      fontPink: new ig.Font('media/fonts/pacpb08.font.png'),
      fontOrange: new ig.Font('media/fonts/pacob08.font.png'),
      lifeSprite: new ig.Image('media/hud/pacman.png'),
      fruitsSprite: new ig.Image('media/hud/fruits.png'),
      ghostsSprite: new ig.Image('media/ghost4.png'),

      init: function () {
        ig.input.bind(ig.KEY.SPACE, 'start');
        ig.input.bind(ig.KEY.P, 'start');
        ig.input.bind(ig.KEY._1, 'start');
        ig.input.bind(ig.KEY._5, 'addCredit');
        ig.input.bind(ig.KEY.Q, 'addCredit');

        ig.game.spawnEntity(EntityGhostBlinky, 28, 76);
        ig.game.spawnEntity(EntityGhostPinky, 28, 96);
        ig.game.spawnEntity(EntityGhostInky, 28, 116);
        ig.game.spawnEntity(EntityGhostClyde, 28, 136);
      },

      update: function () {
        // Update all entities and backgroundMaps
        this.parent();

        if (ig.input.state('start')) {
          if (GameSettings.settings.credits > 0) {
            GameSettings.settings.credits -= 1;
            ig.system.setGameNow(GameScreen, null);
          }
        }
        if (ig.input.released('addCredit')) {
          GameSettings.settings.credits += 1;
        }
      },

      draw: function () {
        // Draw all entities and backgroundMaps
        this.parent();

        this.showScores();
        this.showGhosts();
        this.showDotPoints();
        this.showHelp();
      },

      showScores: function () {
        var x = ig.system.width / 2;
        var y = 0;

        this.fontWhite.draw('1UP', 26, 0, ig.Font.ALIGN.LEFT);
        this.fontWhite.draw('2UP', 178, 0, ig.Font.ALIGN.LEFT);

        this.fontWhite.draw('HIGH SCORE', x, y, ig.Font.ALIGN.CENTER);
        this.fontWhite.draw(GameSettings.settings.highScore, x, 9, ig.Font.ALIGN.CENTER);

        score = GameSettings.settings.score1Up;
        if (score === 0) {
          score = '00';
        }
        this.fontWhite.draw(score, 62, 9, ig.Font.ALIGN.RIGHT);
      },

      showGhosts: function () {
        this.fontWhite.letterSpacing = 1;
        this.fontRed.letterSpacing = 1;
        this.fontPink.letterSpacing = 1;
        this.fontBlue.letterSpacing = 1;
        this.fontOrange.letterSpacing = 1;
        this.fontWhite.draw('CHARACTER / NICKNAME', 34, 56, ig.Font.ALIGN.LEFT);
        this.fontRed.draw('OIKAKE----"AKABEI"', 46, 76, ig.Font.ALIGN.LEFT);
        this.fontPink.draw('MACHIBUSE--"PINKY"', 46, 96, ig.Font.ALIGN.LEFT);
        this.fontBlue.draw('KIMAGURE--"AOSUKE"', 46, 116, ig.Font.ALIGN.LEFT);
        this.fontOrange.draw('OTOBOKE---"GUZUTA"', 46, 136, ig.Font.ALIGN.LEFT);

        this.fontWhite.draw('CREDITS', 10, 270, ig.Font.ALIGN.LEFT);
        this.fontWhite.draw(GameSettings.settings.credits, 76, 270, ig.Font.ALIGN.LEFT);
      },

      showDotPoints: function () {
        var x = ig.system.width / 2;

        this.ghostsSprite.drawTile(x - 40, 197, 56, 16);
        this.fontWhite.draw('10 pts', x - 20, 200, ig.Font.ALIGN.LEFT);
        this.ghostsSprite.drawTile(x - 40, 211, 48, 16);
        this.fontWhite.draw('50 pts', x - 20, 214, ig.Font.ALIGN.LEFT);

        this.fontPink.draw('namco', x, 240, ig.Font.ALIGN.CENTER);
      },

      showHelp: function () {
        this.fontBlue.draw('5:Add Coins', 120, 260, ig.Font.ALIGN.LEFT);
        this.fontBlue.draw('1:Play', 120, 270, ig.Font.ALIGN.LEFT);
      }
    });
  });