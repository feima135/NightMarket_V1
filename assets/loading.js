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
    this.load.image('AudioButton', 'assets/AudioBtn.png');

    // Food Store
    this.load.image('FoodStoreBG', 'assets/FoodStoreScene/FoodStoreBG.png');
    this.load.image('CrossX', 'assets/FoodStoreScene/CrossX.png');
    this.load.spritesheet('FoodItems', 'assets/FoodStoreScene/FoodItems.png',{ frameWidth: 100, frameHeight: 100 });
    this.load.image('FoodCustomerIdle', 'assets/FoodStoreScene/FoodCustomerIdle.png');
    this.load.image('FoodCustomerOpen', 'assets/FoodStoreScene/FoodCustomerOpen.png');
    this.load.spritesheet('FoodItemsWord', 'assets/FoodStoreScene/FoodItemsWord.png', { frameWidth: 180, frameHeight: 144 });

    this.load.image('ChatBubble', 'assets/FoodStoreScene/ChatBubble.png');
    this.load.image('TimerBar', 'assets/TimerBar.png');
    this.load.image('TimerBarContent', 'assets/TimerBarContent.png');

    // Carnival Games
    this.load.image('CarnivalGamesStore', 'assets/CarnivalGames/CarnivalGamesStore.png');
    this.load.image('ShootBalloonWord', 'assets/CarnivalGames/ShootBalloonWord.png');
    this.load.image('RingTossWord', 'assets/CarnivalGames/RingTossWord.png');
    this.load.image('TossBottleStatic', 'assets/CarnivalGames/TossBottleStatic.png');
    this.load.spritesheet('BalloonSprites', 'assets/CarnivalGames/BalloonSprites.png', { frameWidth: 96, frameHeight: 96 });
    this.load.spritesheet('TossRings', 'assets/CarnivalGames/TossRings.png', { frameWidth: 36, frameHeight: 128 });

    // audio
    this.load.audio('LevelComplete_SFX', 'assets/Audio/LevelComplete.mp3');
    this.load.audio('Correct_SFX', 'assets/Audio/Correct.wav');
    this.load.audio('Wrong_SFX', 'assets/Audio/Wrong.wav');
    this.load.audio('Eat_SFX', 'assets/Audio/Eat.wav');
    this.load.audio('Drink_SFX', 'assets/Audio/DrinkStraw.wav');
    this.load.audio('CollectStar_SFX', 'assets/Audio/CollectStar.mp3');
    this.load.audio('ButtonClick_SFX', 'assets/Audio/ButtonClick.wav');
    this.load.audio('BalloonPop_SFX', 'assets/Audio/BalloonPop.wav');
    this.load.audio('RingTossBottle_SFX', 'assets/Audio/RingTossBottle.wav');
    this.load.audio('Eat_Sausage_SFX', 'assets/Audio/Eat_Sausage.mp3');
    this.load.audio('Eat_Popcorn_SFX', 'assets/Audio/Eat_Popcorn.mp3');
    this.load.audio('Eat_Drink_SFX', 'assets/Audio/Eat_Drink.mp3');
    this.load.audio('Eat_CandyFloss_SFX', 'assets/Audio/Eat_CandyFloss.mp3');
    this.load.audio('Eat_ChickenWing_SFX', 'assets/Audio/Eat_ChickenWing.mp3');
    this.load.audio('Eat_SkeweredMeat_SFX', 'assets/Audio/Eat_SkeweredMeat.mp3');
    this.load.audio('ShootBalloonWord_SFX', 'assets/Audio/ShootBalloonWord.mp3');
    this.load.audio('RingTossGameWord_SFX', 'assets/Audio/RingTossGameWord.mp3');
  }
}