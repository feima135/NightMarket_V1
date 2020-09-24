
/////////////////
// RidesScene
/////////////////

class RidesScene extends Phaser.Scene {
  constructor() {
    super('RidesScene')
    this.ferrisWheelRotSpeed = 0.005;

  }

  create() {
    this.add.image(config.width / 2, config.height / 2, "HomePageBG");

    this.createBumperCar();

    this.createTrain();

    this.createFerrisWheel();

    this.scene.get('HomePage').createSceneEssentials(this);
  }
  
  createBumperCar()
  {
    this.add.image(600, config.height / 2, "BumperCar_A");
    this.add.image(400, config.height / 2, "BumperCar_B");

  }

  createTrain() {

    this.trainGroup = this.add.group();

    let train = this.trainGroup.create(-200, config.height / 2 - 50, "Train").setScale(1.2);
    this.trainGroup.create(train.x, train.y + 30, "TrainWheels").setScale(1.2);

    // add the word tag
    let trainWord = this.trainGroup.create(train.x, train.y - 50, "TrainWord");
    // offset the origin so it follows train nicely
    trainWord.setOrigin(1.2, 0.6);

    let currAudioBtn = this.trainGroup.create(trainWord.x, trainWord.y, "AudioButton").setScale(0.6, 0.6).setInteractive();
    currAudioBtn.on('pointerdown', this.scene.get('HomePage').buttonAnimEffect.bind(this, currAudioBtn, () => this.sound.play('TrainWord_SFX')));
    currAudioBtn.setOrigin(2.0, 0.6);

    // add star icon last
    let starIcon = this.trainGroup.create(train.x, train.y - 50, "StarIcon").setInteractive();

    // starIcon pulse
    let trainStarIconTween = this.add.tween({
      targets: starIcon,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 300,
      yoyo: true,
      repeat: -1
    });

    // star on click
    starIcon.once('pointerup',
    ()=> {
      // stop the idle pulse
      trainStarIconTween.stop();
      this.sound.play('Correct_SFX');
      this.sound.play('TrainWord_SFX');
      this.scene.get("HomePage").attainStar(starIcon.x, starIcon.y, starIcon, this, false);
    });

    // train drive from left to right
    this.add.tween({
      targets: this.trainGroup.getChildren(),
      x: config.width + 200,
      duration: 30000,
      repeat: -1,
      repeatDelay: 1000
    });

    // move up down train effect
    this.add.tween({
      targets: train,
      y: '-=5',
      duration: 200,
      yoyo: true,
      repeat: -1
    });
  }

  //Create ferris wheel and it's carriages
  createFerrisWheel() {
    let ferrisWheelBase = this.add.image(150, 320, "FerrisWheel_Base");

    // adding wheel and spinning it      
    this.ferrisWheel = this.add.image(ferrisWheelBase.x, ferrisWheelBase.y - 100, "FerrisWheel_Wheel");
    this.ferrisWheelRotCenter = new Phaser.Math.Vector2(this.ferrisWheel.x, this.ferrisWheel.y + 30);

    var maxCarriageCount = 5;
    let angleSpacing = 360 / maxCarriageCount;

    this.carriageGroup = this.add.group();

    // adding ferris wheel word and audio btn
    let wordTag = this.add.image(150, 420, "FerrisWheelWord");
    let currAudioBtn = this.add.image(wordTag.x + 60, wordTag.y, "AudioButton").setScale(0.6, 0.6).setInteractive();
    currAudioBtn.on('pointerdown', this.scene.get('HomePage').buttonAnimEffect.bind(this, currAudioBtn, () => this.sound.play('FerrisWheelWord_SFX')));

    for (var index = 0; index < maxCarriageCount; ++index) {
      let radius = 0.1;

      // rotate dir along circle to create the carriages
      var offsetDir = new Phaser.Math.Vector2(radius, 0);
      let rotAngle = index * angleSpacing * Math.PI / 180;
      offsetDir.rotate(rotAngle);

      let carriagePos = new Phaser.Math.Vector2(this.ferrisWheel.x, this.ferrisWheel.y + 30);

      offsetDir.scale(radius);
      carriagePos = carriagePos.add(offsetDir);

      // preparing a group for carriages
      this.carriageGroup.create(carriagePos.x, carriagePos.y, 'FerrisWheel_Carriage').setScale(0.7);

      // add hidden star
      if (index == 0) {
        this.ferrisWheelStarIcon = this.carriageGroup.create(carriagePos.x, carriagePos.y, "StarIcon").setInteractive().setScale(0.7);
        this.ferrisWheelStarIcon.once('pointerup',
        ()=> {
          this.carriageGroup.remove(this.ferrisWheelStarIcon);

          // stop the idle pulse
          this.starIconTween.stop();
          this.sound.play('Correct_SFX');
          this.sound.play('FerrisWheelWord_SFX');
          this.scene.get("HomePage").attainStar(this.ferrisWheelStarIcon.x, this.ferrisWheelStarIcon.y, this.ferrisWheelStarIcon, this, false);
        });

        // pulse
        this.starIconTween = this.add.tween({
          targets: this.ferrisWheelStarIcon,
          scaleX: this.ferrisWheelStarIcon.scaleX * 1.1,
          scaleY: this.ferrisWheelStarIcon.scaleY * 1.1,
          duration: 300,
          yoyo: true,
          repeat: -1
        });
      }
    }
  }

  update() {

    this.scene.get("HomePage").genericGameSceneUpdate(this);

    // rotate the ferris wheel
    Phaser.Actions.RotateAroundDistance(this.carriageGroup.getChildren(), this.ferrisWheelRotCenter, this.ferrisWheelRotSpeed, 122);
    this.ferrisWheel.angle += this.ferrisWheelRotSpeed * 50;
  }

  // game timer expired
  onTimerExpired() {
    this.scene.get("HomePage").gameOver(this);
  }
}
