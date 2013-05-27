ig.module(
  'game.screens.game-screen'
)
  .requires(
    'impact.game',
    'impact.font',
    'game.entities.ghost',
    'game.entities.fruit',
    'game.entities.maze-blink',
    'game.entities.ghost-blinky',
    'game.entities.ghost-clyde',
    'game.entities.ghost-inky',
    'game.entities.ghost-pinky',
    'game.entities.pacman',
    'game.entities.bigdot',
    'game.levels.maze',
    'game.settings.general'
    // ,'impact.debug.debug'  
  )
  .defines(function () {

    GameScreen = ig.Game.extend({
      fontWhite: new ig.Font('media/fonts/pacwb08.font.png'),
      fontRed: new ig.Font('media/fonts/pacrb08.font.png'),
      fontYellow: new ig.Font('media/fonts/pacyb08.font.png'),
      fontBlue: new ig.Font('media/fonts/pacbb08.font.png'),
      lifeSprite: new ig.Image('media/hud/pacman.png'),
      fruitsSprite: new ig.Image('media/hud/fruits.png'),
      mazeSprite: new ig.Image('media/mazeblinking.png'),

      states: {
        isPacmanDead: false,
        isGamePaused: true,
        isGameStarting: true,
        isGameOver: false,
        isLevelCompleted: false,
        isLevelStarting: true,
        isLevelStartingTimerStarted: false,
        isGhostDeadStarting: false,
        isGhostDeadStartingTimerStarted: false,
        isMazeBlinkStarting: false,
        isMazeBlinkTimerStarted: false,
        isMazeBlinkCreated: false,
        isGameOverStarting: false,
        isGameOverTimerStarted: false,
        isExtraLifeAdded: false,
        areGhostsAdded: false,
        ghostsToUpdate: [],
        showPacmanPos: false,
        isFruitEdible: false,
        showPlayerOneMessage: true
      },
      status: {
        currentLevel: 0,
        totalDots: 244,
        eatenDots: 0
      },
      players: {
        pacmans: [],
        player1: {player: null, score: 0, lifes: 0, last: {x: 0, y: 0}, eatenGhosts: 0},
        player2: {player: null, score: 0, lifes: 0, last: {x: 0, y: 0}, eatenGhosts: 0}
      },
      maze: {
        mapDots: []
      },

      init: function () {
        // Initialize your game here; bind keys etc.
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');

        this.timer = new ig.Timer();
        this.timer.pause();
        this.delayStartingGame    = 1.5;
        this.delayStartingLevel   = 1.5;
        this.delayTmp             = 0;
        this.delayEated           = 0.70;
        this.delayMazeWorldPaused = 1.5;
        this.delayMaze            = 3.0;
        this.delayGameOver        = 3.0;
        this.timerFont  = new ig.Timer();
        this.delayFont1  = 0.25;
        this.delayFont2  = 0.60;

        this.loadLevel(LevelMaze);
      },

      update: function () {
        if (this.states.isLevelStarting &&
            this.showStartingLevelAnimation() &&
            this.states.isGamePaused) {
          return;
        }

        if (this.states.isMazeBlinkStarting &&
            this.showMazeBlinkingAnimation() &&
            this.states.isGamePaused) {
          if (this.states.isMazeBlinkCreated) {
            this.parent();
          }
          return;
        }

        if (this.states.isGhostDeadStarting &&
            this.showBonusAnimation() &&
            this.states.isGamePaused) {
          this.parent();
          return;
        }

        if (this.states.isGameOver &&
            this.showGameIsOver() &&
            this.states.isGamePaused) {
          this.parent();
          return;
        }

        this.checkGameIsOver();
        this.checkLevelCompletion();
        this.addExtraLife();

        // Update all entities and backgroundMaps
        this.parent();
      },

      draw: function () {
        // draw all entities and backgroundMaps
        this.parent();

        this.showMessages();
        this.showHUD();
        this.showScores();
        this.showPlayersScores();
        if (this.states.showPacmanPos) {
          this.showPacmanPosition();
        }
      },

      showMazeBlinkingAnimation: function () {
        if (!this.states.isMazeBlinkTimerStarted) {
          this.timer = new ig.Timer();
          this.states.isMazeBlinkTimerStarted = true;
          return true;
        }

        if (this.states.isMazeBlinkTimerStarted &&
            this.timer.delta() < this.delayMazeWorldPaused) {
          return true;
        }

        if (this.states.isMazeBlinkTimerStarted &&
            !this.states.isMazeBlinkCreated) {
          this.players.player1.last.x = this.players.player1.pacman.pos.x;
          this.players.player1.last.y = this.players.player1.pacman.pos.y;
          this.finishLevel();

          ig.game.spawnEntity(EntityMazeBlink, 0, 24);
          ig.game.spawnEntity(EntityPacman, this.players.player1.last.x, this.players.player1.last.y);
          this.states.isMazeBlinkCreated = true;

          return true;
        }

        if (this.states.isMazeBlinkTimerStarted &&
            this.states.isMazeBlinkCreated &&
            this.timer.delta() < this.delayMaze) {
          return true;
        }

        this.timer.reset();
        this.timer.pause();

        var maze = ig.game.getEntitiesByType(EntityMazeBlink);
        if (maze) {
          maze[0].kill();
        }
        var pacmans = ig.game.getEntitiesByType(EntityPacman);
        if (pacmans) {
          pacmans[0].kill();
        }

        this.states.isMazeBlinkTimerStarted = false;
        this.states.isMazeBlinkStarting = false;
        this.states.isMazeBlinkCreated = false;

        this.states.isLevelStarting = true;
        this.states.isLevelCompleted = false;
        this.states.isLevelStartingTimerStarted = false;
        this.states.isGamePaused = true;

        this.startLevel();

        return false;
      },

      showBonusAnimation: function () {
        if (!this.states.isGhostDeadStartingTimerStarted) {
          this.timer = new ig.Timer();
          this.states.isGhostDeadStartingTimerStarted = true;
          this.players.player1.pacman.setStatusHidden();
          return true;
        }

        if (this.states.isGhostDeadStartingTimerStarted &&
            this.timer.delta() < this.delayEated) {
          return true;
        }

        this.timer.reset();
        this.timer.pause();

        var ghost = ig.game.states.ghostsToUpdate.pop();
        ghost.isInEyeMode = true;
        ghost.isInBonusMode = false;
        ghost.adjustAnimationAndSpeed();

        var pacman = this.players.player1.pacman;
        pacman.isPacmanHidden = false;
        pacman.adjustAnimationAndSpeed();

        this.states.isGhostDeadStartingTimerStarted = false;
        this.states.isGhostDeadStarting = false;
        this.states.isGamePaused = false;

        return false;
      },

      showStartingLevelAnimation: function () {
        if (!this.states.isLevelStartingTimerStarted) {
          this.timer = new ig.Timer();
          this.states.isLevelStartingTimerStarted = true;
          this.delayTmp = (this.states.showPlayerOneMessage) ? this.delayStartingGame : 0;
          if (this.states.isGameStarting) {
            this.addBigDotsToMaze();
          }

          return true;
        }

        if (this.states.isLevelStartingTimerStarted &&
            this.states.showPlayerOneMessage &&
            this.timer.delta() < this.delayStartingGame) {
          return true;
        }

        if (!this.states.areGhostsAdded) {
          this.addGhostsToMaze();
          this.states.areGhostsAdded = true;
        }

        if (this.states.isGameStarting) {
          this.startLevel(false);
          this.players.player1.pacman.setStatusClose();
          this.states.showPlayerOneMessage = false; // TODO: this should be in true again in a new game
          this.states.isGameStarting = false;
          this.states.isExtraLifeAdded = false;
        }

        if (this.states.isLevelStartingTimerStarted &&
            this.timer.delta() < this.delayTmp + this.delayStartingLevel) {
          return true;
        }

        this.timer.reset();
        this.timer.pause();

        this.states.isLevelStarting = false;
        this.states.isLevelStartingTimerStarted = false;
        this.states.isGamePaused = false;
        this.players.player1.pacman.setStatusReady();
        this.states.areGhostsAdded = false;

        return false;
      },

      checkGameIsOver: function () {
        if (this.players.player1.lifes === 0) {
          this.states.isGameOver = true;
          this.states.isGamePaused = true;
          this.states.isLevelStarting = false;
          GameSettings.settings.score1Up = this.players.player1.score;
          this.players.player1.pacman.kill();
        }
      },

      showGameIsOver: function () {
        if (!this.states.isGameOverTimerStarted) {
          this.timer = new ig.Timer();
          this.states.isGameOverTimerStarted = true;
          return true;
        }

        if (this.states.isGameOverTimerStarted &&
            this.timer.delta() < this.delayGameOver) {
          return true;
        }

        ig.system.setGameNow(DemoScreen, null);
        // TODO: hide the maze before to load it. Looks bad
        this.addDotsToMaze();
      },

      checkLevelCompletion: function () {
        if (this.status.eatenDots === this.status.totalDots) {
          this.states.isMazeBlinkStarting = true;
          this.states.isGamePaused = true;
          this.states.isLevelCompleted = true;

          var pacman1 = this.players.player1.pacman;
          pacman1.setStatusClose();

          // if pacman eats 16 ghosts in the level get extra 12k points
          if (this.players.player1.eatenGhosts === 16) {
            this.players.player1.score += 12000;
          }
        } else if (this.status.eatenDots === 170 || this.status.eatenDots === 70) {
          ig.game.spawnEntity(EntityFruit);
          ig.game.sortEntitiesDeferred();
        }
      },

      startLevel: function (addBigDots) {
        this.status.currentLevel += 1;

        this.addPacmansToMaze();
        this.addDotsToMaze();
        //this.addGhostsToMaze();
        if (addBigDots === undefined || addBigDots) {
          this.addBigDotsToMaze();
        }
        this.status.eatenDots = 0;
        this.maze.mapDots = [];

        this.sortEntitiesDeferred();
      },

      finishLevel: function () {
        var i, entities = this.entities;
        for (i = 0; i < entities.length; i++) {
          if (entities[i] instanceof EntityPacman ||
              entities[i] instanceof EntityGhost ||
              entities[i] instanceof EntityBigdot ||
              entities[i] instanceof EntityFruit) {
            entities[i].kill();
          }
        }
      },

      showHUD: function () {
        var i, j, fruitIdx, k = 1, ini = 1;
        var pacmans = this.getEntitiesByType(EntityPacman);
        var lifes, currentLevel;

        if (this.states.isGameStarting) {
          lifes = GameSettings.settings.numberOfInitialLifes;
          currentLevel = 1;
        } else {
          lifes = this.players.player1.lifes - 1;
          currentLevel = this.status.currentLevel;
        }

        var x = 16;
        for (i = 0; i < lifes; i++, x += 16) {
          this.lifeSprite.draw(x, ig.system.height - 16);
        }
        // display fruits according to the level...never more than 8 fruits
        if (this.status.currentLevel > 9) {
          ini = this.status.currentLevel - 9 + 1;
        }
        var levels = GameSettings.levels;
        for (i = ini; i <= currentLevel; i++) {
          fruitIdx = (i > 21) ? 21 : i;
          if (levels) {
            var fruit = levels['level' + fruitIdx].fruit;
            this.fruitsSprite.drawTile(ig.system.width - 16 * (k++ + 0.5), ig.system.height - 16, fruit, 16);
          } else {
            console.log('lelvels: ', levels);
          }
        }
      },

      showPacmanPosition: function () {
        var pacmans = this.getEntitiesByType(EntityPacman);
        if (pacmans.length > 0) {
          var pacman = pacmans[0];
          this.fontWhite.draw('X: ' + pacman.pos.x.toFixed(2), 0, 12);
          this.fontWhite.draw('Y: ' + pacman.pos.y.toFixed(2), 100, 12);

          this.fontWhite.draw('dY: ' + (pacman.pos.y - pacman.last.y), 300, 10);

          var blinky = ig.game.getEntityByName('blinky');
          if (blinky) {
            this.fontWhite.draw('X: ' + blinky.pos.x.toFixed(2), 0, 32);
            this.fontWhite.draw('Y: ' + blinky.pos.y.toFixed(2), 100, 32);
          }

          this.fontWhite.draw('dY: ' + (pacman.pos.y - pacman.last.y), 200, 10);
        }
      },

      showPlayersScores: function () {
        if (this.timerFont.delta() < this.delayFont1) {
          return;
        }
        if (this.timerFont.delta() < this.delayFont2) {
          this.fontWhite.draw('1UP', 26, 0, ig.Font.ALIGN.LEFT);
          // this.fontWhite.draw('2UP', 178, 0, ig.Font.ALIGN.LEFT);
        } else {
          this.timerFont.reset();
        }
      },

      showMessages: function () {
        var x, y;
        if (this.states.isLevelStarting &&
            this.states.isGamePaused) {
          x = ig.system.width / 2;
          y = ig.system.height / 2 + 15;
          this.fontYellow.letterSpacing = 0.5;
          this.fontYellow.draw('READY!', x, y, ig.Font.ALIGN.CENTER);

          if (this.states.showPlayerOneMessage) {
            y = ig.system.height / 2 - 33;
            this.fontBlue.letterSpacing = 0.5;
            this.fontBlue.draw('PLAYER ONE', x, y, ig.Font.ALIGN.CENTER);
          }
        }
        if (this.states.isGameOver &&
            this.states.isGamePaused) {
          x = ig.system.width / 2;
          y = ig.system.height / 2 + 15;
          this.fontRed.letterSpacing = 0.5;
          this.fontRed.draw('GAME  OVER', x, y, ig.Font.ALIGN.CENTER);
        }
      },

      showScores: function () {
        var x = ig.system.width / 2;
        var y = 0;

        var score = this.players.player1.score;
        if (GameSettings.settings.highScore < score) {
          GameSettings.settings.highScore = score;
        }
        this.fontWhite.draw('HIGH SCORE', x, y, ig.Font.ALIGN.CENTER);
        this.fontWhite.draw(GameSettings.settings.highScore.toString(), x, 9, ig.Font.ALIGN.CENTER);

        score = this.players.player1.score;
        if (score === 0) {
          score = '00';
        }
        this.fontWhite.draw(score, 62, 9, ig.Font.ALIGN.RIGHT);

        // score = this.players.player2.score.toString();
        // if (score === '0') {
        //   score = '00';
        // }
        // this.fontWhite.draw(score, 214, 9, ig.Font.ALIGN.RIGHT);
      },

      addDotsToMaze: function () {
        // populate the tiles with 114=dot
        var i, x, y, len = this.maze.mapDots.length;
        for (i = 0; i < len; i++) {
          x = this.maze.mapDots[i].x;
          y = this.maze.mapDots[i].y;
          this.backgroundMaps[0].setTile(x, y, 114);
        }
      },

      addBigDotsToMaze: function () {
        ig.game.spawnEntity(EntityBigdot, 8, 48);
        ig.game.spawnEntity(EntityBigdot, 8, 208);
        ig.game.spawnEntity(EntityBigdot, 208, 48);
        ig.game.spawnEntity(EntityBigdot, 208, 208);
      },

      addGhostsToMaze: function () {
        ig.game.spawnEntity(EntityGhostBlinky);
        ig.game.spawnEntity(EntityGhostClyde);
        ig.game.spawnEntity(EntityGhostInky);
        ig.game.spawnEntity(EntityGhostPinky);
      },

      addPacmansToMaze: function () {
        this.players.player1.pacman = ig.game.spawnEntity(EntityPacman);
        if (this.states.isGameStarting) {
          this.players.player1.lifes = GameSettings.settings.numberOfInitialLifes;
        }
        this.players.pacmans.push(this.players.player1);
      },

      addExtraLife: function () {
        if (!this.states.isExtraLifeAdded) {
          if (this.players.player1.score >= 50000) {
            this.players.player1.lifes += 1;
            this.states.isExtraLifeAdded = true;
          }
        }
      }
    });
  });