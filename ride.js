
/////////////////
// RidesScene
/////////////////

class RidesScene extends Phaser.Scene {
    constructor() {
      super('RidesScene')
    }
  
    preload() {
    }
  
    create() {
      //create home btn
      this.HomeBtn = this.add.image(config.width, config.height, "HomeBtn").setOrigin(1, 1);
      this.HomeBtn.setInteractive();
      this.HomeBtn.once('pointerup', () => this.scene.start('HomePage'));
    }
  }
  