// global score
var g_Score = 0;
var g_LevelTime = 50000; // how long for each level in ms

/////////////////
// HOME PAGE
/////////////////
class HomePage extends Phaser.Scene {
  constructor() {
    super('HomePage')
  }

  create() {
    this.add.image(config.width / 2, config.height / 2, "HomePageBG");

    this.FoodStoreBtn = this.add.image(130, 250, "FoodStore");
    this.FoodStoreBtn.alpha = 0.5;

    this.CarnivalGamesBtn = this.add.image(450, 250, "CarnivalGames");
    this.CarnivalGamesBtn.alpha = 0.5;

    this.RidesBtn = this.add.image(600, 250, "Rides");
    this.RidesBtn.alpha = 0.5;

    // navigate to the food store scene
    if (!this.scene.get("FoodStoreScene").visited) {
      this.FoodStoreBtn.alpha = 1.0;
      this.FoodStoreBtn.setInteractive();
      this.FoodStoreBtn.once('pointerdown', this.buttonAnimEffect.bind(this, this.FoodStoreBtn, () => this.scene.start('FoodStoreScene')));
    }

    if (!this.scene.get("CarnivalGamesScene").visited) {
      this.CarnivalGamesBtn.alpha = 1.0;
      this.CarnivalGamesBtn.setInteractive();
      this.CarnivalGamesBtn.once('pointerdown', this.buttonAnimEffect.bind(this, this.CarnivalGamesBtn, () => this.scene.start('CarnivalGamesScene')));

      this.RidesBtn.setInteractive();
      this.RidesBtn.once('pointerdown', this.buttonAnimEffect.bind(this, this.RidesBtn, () => this.scene.start('RidesScene')));
    }

    if (!this.scene.get("RidesScene").visited) {
      this.RidesBtn.alpha = 1.0;
      this.RidesBtn.setInteractive();
      this.RidesBtn.once('pointerdown', this.buttonAnimEffect.bind(this, this.RidesBtn, () => this.scene.start('RidesScene')));
    }

    this.starIcons = this.createGameProgressUI(this);
    this.updateGameProgressUI(this.starIcons);
  }

  /***************************/
  // Generic Btn Click Effect
  /***************************/
  buttonAnimEffect(img, callback) {
    this.tweens.add({
      targets: img,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 40,
      onComplete: callback,
      yoyo: true
    });
  }

  /************************************/
  // used by scenes to update new score
  /************************************/
  increaseGlobalScore(ownerScene)
  {
    ++g_Score;
    this.updateGameProgressUI(ownerScene.starIcons, ownerScene);
  }

  /*******************************************/
  // Create the stars used by multiple scenes
  /*******************************************/
  createGameProgressUI(target) {
    let starIcons = [];
    var maxStars = 10;
    var widthSpace = 70;
    var xStartOffset = 80;
    var yStartOffset = 50;

    for (var index = 0; index < maxStars; ++index) {
      var texName = 'StarIconBase';

      // create the highlighted stars
      if (index < g_Score) {
        texName = 'StarIcon';
      }

      let newStarIcon = target.add.image(xStartOffset + widthSpace * index, yStartOffset, texName);
      newStarIcon.setScale(0.8, 0.8);
      starIcons.push(newStarIcon);
    }

    return starIcons;
  }

  /*******************************************/
  // update star progress generic
  /*******************************************/
  updateGameProgressUI(starIcons, ownerScene) {

    // set the star icons according to score
    for (var index = 0; index < starIcons.length; ++index) {
      if (index == g_Score - 1) {
        let targetStarIcon = starIcons[index];
        targetStarIcon.setTexture('StarIcon');

        // optional for children scenes to show scale pulse
        if (ownerScene) {
          // Scale Pulse Effect
          ownerScene.add.tween({
            targets: targetStarIcon,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true
          });
        }
      }
    }
  }

  /*******************************************/
  // Create Home Btn, timer bar, game over splash etc
  /*******************************************/
  createSceneEssentials(ownerScene) {
    // populate stars
    ownerScene.starIcons = this.createGameProgressUI(ownerScene);

    // create timer bar
    var timerBarBase = ownerScene.add.image(config.width / 2 - 100, 150, "TimerBar").setOrigin(0, 0.5);
    ownerScene.timerBarContent = ownerScene.add.image(timerBarBase.x + 53, timerBarBase.y, "TimerBarContent").setOrigin(0, 0.5);
    ownerScene.gameTimer = ownerScene.time.delayedCall(g_LevelTime, ownerScene.onTimerExpired, [], ownerScene);
    
    // create mask white box
    ownerScene.maskUnderlay = ownerScene.add.image(config.width / 2, config.height / 2, "WhiteBox").setScale(config.width, config.height);
    ownerScene.maskUnderlay.tint = 0x000000;
    ownerScene.maskUnderlay.alpha = 0.0;
    ownerScene.maskUnderlay.visible = false;
    ownerScene.maskUnderlay.setInteractive();

    // GameoverSplash
    ownerScene.gameOverSplash = ownerScene.add.image(config.width / 2, -300, "GameOverSplash");

    // home btn over splash screen
    ownerScene.homeBtn = ownerScene.add.image(config.width/2, config.height/2, "HomeBtn");
    ownerScene.homeBtn.alpha = 0.0;
    ownerScene.homeBtn.once('pointerup', () => ownerScene.scene.start('HomePage'));

    // mark this scene as visited
    ownerScene.visited = true;
  }

  /*******************************************/
  // Generic behavior to deal with game over
  /*******************************************/
  gameOver(ownerScene) {

    ownerScene.maskUnderlay.visible = true;

    // fade in the mask underlay
    ownerScene.add.tween({
      targets: ownerScene.maskUnderlay,
      alpha: 0.8,
      duration: 200
    });

    // drop down tween anim
    ownerScene.add.tween({
       targets: ownerScene.gameOverSplash,
       y: config.height / 2,
       ease : "Quad.easeInOut",
       onComplete : function()
       {
         // stop timer 
         ownerScene.gameTimer.paused = true;

        ownerScene.homeBtn.alpha = 1;
        ownerScene.homeBtn.setInteractive();    
       },
       duration: 1000
     });
  }

  /*******************************************/
  // Common update stuff for all scenes
  /*******************************************/
  genericGameSceneUpdate(ownerScene)
  {
    ownerScene.timerBarContent.setScale(1 - ownerScene.gameTimer.getOverallProgress(), 1);
  }
}

var config =
{
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: 0x000000,
  scene: [LoadingScene, HomePage, FoodStoreScene, RidesScene, CarnivalGamesScene]
}

var game = new Phaser.Game(config);
game.scene.start('LoadingScene');
