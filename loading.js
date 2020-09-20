////////////////
// LOADING 
////////////////

class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  preload() {
    this.graphics = this.add.graphics();
    this.newGraphics = this.add.graphics();
    var progressBar = new Phaser.Geom.Rectangle(200, 200, 400, 50);
    var progressBarFill = new Phaser.Geom.Rectangle(205, 205, 290, 40);

    this.graphics.fillStyle(0xffffff, 1);
    this.graphics.fillRectShape(progressBar);

    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(progressBarFill);

    var loadingTextVar = this.add.text(250, 260, "Loading: ", { fontSize: '32px', fill: '#FFF' });

    this.preloadAssets();

    this.load.on('progress', this.updateBar, { newGraphics: this.newGraphics, loadingText: loadingTextVar });
    this.load.on('complete', this.loadCompleted, this);
  }

  updateBar(percentage) {
    this.newGraphics.clear();
    this.newGraphics.fillStyle(0x3587e2, 1);
    this.newGraphics.fillRectShape(new Phaser.Geom.Rectangle(205, 205, percentage * 390, 40));

    percentage = percentage * 100;
    this.loadingText.setText("Loading: " + percentage.toFixed(2) + "%");
    console.log("P:" + percentage);
  }

  // when load completes
  loadCompleted() {
    console.log('complete');

    // go to home page
    this.scene.start('HomePage');
  }

  preloadAssets() {
    this.load.image('HomePageBG', 'assets/HomePage/HomePageBG.png');
    this.load.image('FoodStore', 'assets/HomePage/FoodStore.png');
    this.load.image('CarnivalGames', 'assets/HomePage/CarnivalGames.png');
    this.load.image('Rides', 'assets/HomePage/Rides.png');

    this.load.image('GameOverSplash', 'assets/GameOverSplash.png');
    this.load.image('WhiteBox', 'assets/WhiteBox.png');

    this.load.image('HomeBtn', 'assets/HomeBtn.png');
    this.load.image('StarIcon', 'assets/StarIcon.png');
    this.load.image('StarIconBase', 'assets/StarIconEmptyBase.png');

    // Food Store
    this.load.image('FoodStoreBG', 'assets/FoodStoreScene/FoodStoreBG.png');
    this.load.spritesheet('ChickenWing', 'assets/FoodStoreScene/ChickenWing.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('CandyFloss', 'assets/FoodStoreScene/CandyFloss.png', { frameWidth: 64, frameHeight: 121 });
    this.load.image('FoodCustomerIdle', 'assets/FoodStoreScene/FoodCustomerIdle.png');
    this.load.image('FoodCustomerOpen', 'assets/FoodStoreScene/FoodCustomerOpen.png');
    this.load.image('CandyFlossWord', 'assets/FoodStoreScene/CandyFloss_Word.png');
    this.load.image('ChickenWingWord', 'assets/FoodStoreScene/ChickenWing_Word.png');
    this.load.image('ChatBubble', 'assets/FoodStoreScene/ChatBubble.png');
    this.load.image('TimerBar', 'assets/TimerBar.png');
    this.load.image('TimerBarContent', 'assets/TimerBarContent.png');

    // Carnival Games
    this.load.image('CarnivalGamesStore', 'assets/CarnivalGames/CarnivalGamesStore.png');
    this.load.spritesheet('BalloonSprites', 'assets/CarnivalGames/BalloonSprites.png', { frameWidth: 32, frameHeight: 128 });
    this.load.spritesheet('TossBottleSprites', 'assets/CarnivalGames/TossBottle.png', { frameWidth: 100, frameHeight: 300 });

  }
}
