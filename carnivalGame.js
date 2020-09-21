//////////////////////
// Carnival Game Scene
//////////////////////
class CarnivalGamesScene extends Phaser.Scene {
  constructor() {
    super('CarnivalGamesScene')
  }

  preload() {
  }

  create() {
    this.balloonExploded = 0;
    this.ringTossed = 0;

    // store BG
    //this.add.image(180, config.height - 220, "CarnivalGamesStore");
    //this.add.image(620, config.height - 220, "CarnivalGamesStore");

    // prepare rng indices
    let tempBufferBalloonsArray = [];
    let starRNGIndices = [];
    for (var index = 0; index < this.totalBalloons; ++index) {
      tempBufferBalloonsArray.push(index);
    }
    for (var index = 0; index < this.starsToBeAwarded; ++index) {
      let selectedIndex = Phaser.Utils.Array.RemoveRandomElement(tempBufferBalloonsArray);
      starRNGIndices.push(selectedIndex);
    }

    this.createBalloons();

    this.createTossBottles();

    //create common scene essentials
    this.scene.get('HomePage').createSceneEssentials(this);
  }

  createTossBottles() {
    let maxRow = 2;
    let maxCol = 4;
    let starPosX = 480;
    let starPosY = 300;
    let xGap = 80;
    let yGap = 200;
    this.totalTossBottles = maxRow * maxCol;

    // create a grid of ring toss
    for (var row = 0; row < maxRow; ++row) {
      for (var col = 0; col < maxCol; ++col) {

        let currPosX = starPosX + col * xGap;
        let currPosY = starPosY + row * yGap;

        // create hidden star
        var hiddenStar = this.add.image(currPosX, currPosY, "StarIcon");
        hiddenStar.visible = false;

        // adding balloon sprite element
        var tossBottle = this.add.image(currPosX, currPosY,"TossBottleStatic").setInteractive();
        tossBottle.hiddenStar = hiddenStar;

        // attach some toss rings
        var tossRing = this.add.sprite(currPosX, currPosY - 90,"TossRings");
        tossRing.visible = false;
        tossBottle.tossRing = tossRing;

        // create the toss animation
        this.anims.create({
          key: "tossRingToBottle",
          frames: this.anims.generateFrameNumbers('TossRings',
            { start: 0, end:  5}),
          frameRate: 20,
        });

        tossBottle.once('pointerup', this.onTossBottlePressed, { targetSprite: tossBottle, owner: this });
      }
    }
  }

  createBalloons() {

    let maxRow = 2;
    let maxCol = 4;
    let balloonStartPosX = 50;
    let balloonStartPosY = 300;
    let xGap = 90;
    let yGap = 150;
    this.totalBalloons = maxRow * maxCol;

    let maxFrames = 6;
    let startFrameIndex = 0;
    let startFrameIndices = [0, 6, 12];

    // create a grid of balloons
    for (var row = 0; row < maxRow; ++row) {
      for (var col = 0; col < maxCol; ++col) {

        let balloonPosX = balloonStartPosX + col * xGap;
        let balloonPosY = balloonStartPosY + row * yGap;

        // randomly assign balloon color
        startFrameIndex = Phaser.Utils.Array.GetRandom(startFrameIndices);

        // create hidden star
        var hiddenStar = this.add.image(balloonPosX, balloonPosY, "StarIcon");
        hiddenStar.visible = false;

        // adding balloon sprite element
        var balloonSprite = this.add.sprite(balloonPosX, balloonPosY,"BalloonSprites").setInteractive();

        balloonSprite.hiddenStar = hiddenStar;
        balloonSprite.explodeAnim = "BalloonExplode" + startFrameIndex;
        balloonSprite.setFrame(startFrameIndex);

        this.anims.create({
          key: balloonSprite.explodeAnim,
          frames: this.anims.generateFrameNumbers('BalloonSprites',
            { start: startFrameIndex, end: startFrameIndex + maxFrames - 1 }),
          frameRate: 15
        });

        balloonSprite.once('pointerup', this.onBalloonPressed, { targetSprite: balloonSprite, owner: this });
      }
    }
  }

  onTossBottlePressed() {
    this.targetSprite.tossRing.visible = true;
    this.targetSprite.tossRing.play("tossRingToBottle");

    // update counter scores
    ++this.owner.ringTossed;

    // the last click
    if (this.owner.ringTossed == this.owner.totalTossBottles) {
      let targetFlyOverStar = this.targetSprite.hiddenStar;

      targetFlyOverStar.visible = true;
      // pulse
      this.owner.add.tween({
        targets: targetFlyOverStar,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 100,
        delay: 600,
        yoyo: true
      });

      // fly up to star bar, specifically the next star
      this.owner.add.tween({
        targets: targetFlyOverStar,
        duration: 420,
        y: this.owner.starIcons[g_Score].y,
        x: this.owner.starIcons[g_Score].x,
        delay: 920,
        onCompleteScope: this.owner,
        onComplete: function () {
          targetFlyOverStar.destroy();
          this.scene.get("HomePage").increaseGlobalScore(this);
          this.checkGameOverCondition();
        }
      });
    }
  }

  // when balloon is pressed, play explosion 
  onBalloonPressed() {
    this.targetSprite.play(this.targetSprite.explodeAnim);
    this.targetSprite.on('animationcomplete', () => this.targetSprite.destroy());

    // update counter scores
    ++this.owner.balloonExploded;

    // the last click
    if (this.owner.balloonExploded == this.owner.totalBalloons) {
      let targetFlyOverStar = this.targetSprite.hiddenStar;

      targetFlyOverStar.visible = true;
      // pulse
      this.owner.add.tween({
        targets: targetFlyOverStar,
        scaleX: 1.3,
        scaleY: 1.3,
        duration: 100,
        delay: 500,
        yoyo: true
      });

      // fly up to star bar, specifically the next star
      this.owner.add.tween({
        targets: targetFlyOverStar,
        duration: 300,
        y: this.owner.starIcons[g_Score].y,
        x: this.owner.starIcons[g_Score].x,
        delay: 800,
        onCompleteScope: this.owner,
        onComplete: function () {
          targetFlyOverStar.destroy();
          this.scene.get("HomePage").increaseGlobalScore(this);
          this.checkGameOverCondition();
        }
      });
    }
  }

  checkGameOverCondition()
  {
    if (this.balloonExploded >= this.totalBalloons && this.ringTossed >= this.totalTossBottles) {
      this.scene.get("HomePage").gameOver(this);
    }
  }

  // game timer expired
  onTimerExpired() {
    this.scene.get("HomePage").gameOver(this);
  }

  update() {
    this.scene.get("HomePage").genericGameSceneUpdate(this);
  }
}

