////////////////////
// Food Store Scene
////////////////////
class FoodStoreScene extends Phaser.Scene {
    constructor() {
      super('FoodStoreScene')
    }

    create() {  
      // create array of choices
      this.choices = ['ChickenWingWord', 'CandyFlossWord'];
      this.choicesIndices = [0, 1];

      // Create food Store BG
      var BG = this.add.image(config.width / 2, config.height / 2, "FoodStoreBG");
      let scaleX = this.cameras.main.width / BG.width;
      let scaleY = this.cameras.main.height / BG.height;
      let scale = Math.max(scaleX * 0.7, scaleY * 0.7);
      BG.setScale(scale);
  
      // load customer first
      this.FoodCustomer = this.add.image(300, config.height - 100, "FoodCustomerIdle");
      this.FoodCustomer.setInteractive();
  
      // chat bubble
      this.add.image(this.FoodCustomer.x + 200, this.FoodCustomer.y - 50, "ChatBubble").setScale(3, 2);
  
      // load customer request array
      this.setupNextRound();
      this.customerRequest = this.add.image(500, config.height - 150, this.choices[this.choiceIndex]);
  
      // //  A drop zone for customer
      var zone = this.add.zone(this.FoodCustomer.x, this.FoodCustomer.y, 450, 300).setRectangleDropZone(300, 250);
      // DEBUG
      //  Just a visual display of the drop zone
      var graphics = this.add.graphics();
      graphics.lineStyle(2, 0xffff00);
      graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
  
      ////////////////////
      // Set up drag stuff
      ////////////////////
      this.input.on('dragstart', this.onDragStart, this);
      this.input.on('drag', this.onItemDragged);
      this.input.on('dragend', this.onItemDragRelease);
      this.input.on('drop', this.onItemDroppedInZone, this);
      this.input.on('dragenter', this.onItemDropZoneEnter, this);
      this.input.on('dragleave', this.onItemDropZoneLeave, this);
  
      /////////////////
      // Creating Food
      ////////////////
  
      // Chicken Wing
      var ChickenWingBtn = this.add.sprite(130, 250, 'ChickenWing').setInteractive();
      ChickenWingBtn.itemIndex = 0;
      ChickenWingBtn.eatenAnimName = 'ChickenWingEaten';
      this.input.setDraggable(ChickenWingBtn)
      this.anims.create({
        key: ChickenWingBtn.eatenAnimName,
        frames: this.anims.generateFrameNumbers('ChickenWing'),
        frameRate: 5
      });
      ChickenWingBtn.on('animationcomplete', this.animComplete.bind(this, ChickenWingBtn));
  
      // Candy Floss
      var candyFlossBtn = this.add.sprite(280, 250, 'CandyFloss').setInteractive();
      candyFlossBtn.itemIndex = 1;
      candyFlossBtn.eatenAnimName = 'CandyFlossEaten';
      this.input.setDraggable(candyFlossBtn)
      this.anims.create({
        key: candyFlossBtn.eatenAnimName,
        frames: this.anims.generateFrameNumbers('CandyFloss'),
        frameRate: 5
      });
      candyFlossBtn.on('animationcomplete', this.animComplete.bind(this, candyFlossBtn));

      //create common scene essentials
      this.scene.get('HomePage').createSceneEssentials(this);
    }

    // game timer expired
    onTimerExpired() {
      this.scene.get("HomePage").gameOver(this);
    }
  
    setupNextRound() {
      // done with everything
      if(this.choicesIndices.length == 0)
      {
        this.scene.get("HomePage").gameOver(this);
      }
      else
      {
        this.choiceIndex = Phaser.Utils.Array.RemoveRandomElement(this.choicesIndices);
      }
    }
  
    // customer has eaten an item
    animComplete(gameObject) {
      gameObject.visible = false;
      this.FoodCustomer.setTexture('FoodCustomerIdle');
      this.setupNextRound();
      this.customerRequest.setTexture(this.choices[this.choiceIndex]);
    }
  
    // Drag snap back
    onItemDragRelease(pointer, gameObject, dropped) {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
      }
    }
  
    onDragStart(pointer, gameObject) {
      this.children.bringToTop(gameObject);
    }
  
    // follow drag
    onItemDragged(pointer, gameObject, dragX, dragY) {
      gameObject.x = pointer.x;
      gameObject.y = pointer.y;
    }
  
    // dropping item in zone
    onItemDroppedInZone(pointer, gameObject, dropZone) {
      if (gameObject.itemIndex == this.choiceIndex) {
        gameObject.play(gameObject.eatenAnimName);
        gameObject.disableInteractive();

        this.scene.get("HomePage").increaseGlobalScore(this);        
      }
      else {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        this.FoodCustomer.setTexture('FoodCustomerIdle');
      }
    }
  
    // drop zone hover
    onItemDropZoneEnter(pointer, gameObject, dropZone) {
      this.FoodCustomer.setTexture('FoodCustomerOpen');
    }
  
    // drop zone leave
    onItemDropZoneLeave(pointer, gameObject, dropZone) {
      this.FoodCustomer.setTexture('FoodCustomerIdle');
    }
  
    update() {
      this.scene.get("HomePage").genericGameSceneUpdate(this);
    }
  }
  