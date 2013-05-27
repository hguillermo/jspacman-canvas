ig.module(
  'game.settings.general'
)
  .requires(
  )
  .defines(function () {

    GameSettings = {
      levels: {
        level1: {fruit: 0, value: 100, blueTime: 6, pacmanSpeed: 0.8, pacmanSpeedDots: 0.71, pacmanFright: 0.90, pacmanFrightDots: 0.79, ghostSpeed: 0.75, ghostTunnelSpeed: 0.40, ghostFrightened: 0.50},
        level2: {fruit: 1, value: 300, blueTime: 5, pacmanSpeed: 0.9, pacmanSpeedDots: 0.79, pacmanFright: 0.95, pacmanFrightDots: 0.83, ghostSpeed: 0.85, ghostTunnelSpeed: 0.45, ghostFrightened: 0.55},
        level3: {fruit: 2, value: 500, blueTime: 4, pacmanSpeed: 0.9, pacmanSpeedDots: 0.79, pacmanFright: 0.95, pacmanFrightDots: 0.83, ghostSpeed: 0.85, ghostTunnelSpeed: 0.45, ghostFrightened: 0.55},
        level4: {fruit: 2, value: 500, blueTime: 3, pacmanSpeed: 0.9, pacmanSpeedDots: 0.79, pacmanFright: 0.95, pacmanFrightDots: 0.83, ghostSpeed: 0.85, ghostTunnelSpeed: 0.45, ghostFrightened: 0.55},
        level5: {fruit: 3, value: 700, blueTime: 2, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level6: {fruit: 3, value: 700, blueTime: 5, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level7: {fruit: 4, value: 1000, blueTime: 2, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level8: {fruit: 4, value: 1000, blueTime: 2, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level9: {fruit: 5, value: 2000, blueTime: 1, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level10: {fruit: 5, value: 2000, blueTime: 5, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level11: {fruit: 6, value: 3000, blueTime: 2, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level12: {fruit: 6, value: 3000, blueTime: 1, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level13: {fruit: 7, value: 5000, blueTime: 1, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level14: {fruit: 7, value: 5000, blueTime: 3, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level15: {fruit: 7, value: 5000, blueTime: 1, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level16: {fruit: 7, value: 5000, blueTime: 1, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level17: {fruit: 7, value: 5000, blueTime: 0, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level18: {fruit: 7, value: 5000, blueTime: 1, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level19: {fruit: 7, value: 5000, blueTime: 0, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level20: {fruit: 7, value: 5000, blueTime: 0, pacmanSpeed: 1.0, pacmanSpeedDots: 0.87, pacmanFright: 1.00, pacmanFrightDots: 0.87, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.60},
        level21: {fruit: 7, value: 5000, blueTime: 0, pacmanSpeed: 0.9, pacmanSpeedDots: 0.79, pacmanFright: 0.90, pacmanFrightDots: 0.79, ghostSpeed: 0.95, ghostTunnelSpeed: 0.50, ghostFrightened: 0.95}
      },
      settings: {
        numberOfInitialLifes: 3,
        maximumNumberOfLifes: 4,
        multiplier: 2,
        currentMultiplier: 1,
        pointsPerDot: 10,
        pointsPerBigDot: 50,
        pacmanMaxSpeed: 80,
        ghostsMaxSpeed: 80,
        highScore: 0,
        score1Up: 0,
        score2Up: 0,
        credits: 0
      },

      levelSettings: function () {
        var c = '1';
        if (ig.game.status) {
          c = (ig.game.status.currentLevel > 21) ? 21 : ig.game.status.currentLevel;
        }
        // TODO: FIX THIS CRAP!!!!
        if (c === 0) {
          c = 1; // TODO: Temp patch. Move all the settings to the settings class
        }
        var s = this.levels;
        return s['level' + c];
      }
    };
  });