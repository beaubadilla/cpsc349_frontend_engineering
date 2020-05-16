// Links:
// This talks about dividing up scenes:
// https://phaser.io/phaser3/devlog/121
// Add Scene from Another Scene:
// https://labs.phaser.io/edit.html?src=src\scenes\add%20scene%20from%20another%20scene.js

// console.log(dictionary[Math.floor(dictionary.length * Math.random())].word);
let acceptableKeys = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G,', 'H', 'I,', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
let getRandomWord = () => {
  randomIndex = Math.floor(dictionary.length * Math.random());
  return dictionary[randomIndex].word;
};

class startScene extends Phaser.Scene {
  constructor () {
    // super({ key: 'start', active: true });
    super({ key: 'start' });
  }

  preload () {
    // Background:
    this.load.image('sky', 'assets/sky.png');

    // Character:
    this.load.image('character', 'assets/images/Player/p3_front.png');

    // Music:
    this.load.audio('seinfeld', 'assets/sound/Seinfeld.mp3');
  }

  create () {
    this.add.image(400, 300, 'sky');
    let char = this.add.image(400, 550, 'character');

    let music = this.sound.add('seinfeld', true); // true = loop for Phaser 3?
    music.play();

    let titleText = this.add.text(200, 200, 'Typing Jumper', { fontFamily: '"Roboto Condensed"', fontSize: '64px' });
    let startButton = this.add.text(300, 300, 'Press Start!', { fontFamily: '"Roboto Condensed"', fontSize: '32px' }).setInteractive();
    startButton.on('pointerdown', (pointer) => {
      console.log(pointer);
      this.scene.start('game');
    });
  }
}

var character; var jumpingAnimation; var platformOneLeft; var platformOneMid; var platformOneRight;
var platformTwoLeft; var platformTwoMid; var platformTwoRight;
var platformThreeLeft; var platformThreeMid; var platformThreeRight;
var kb; var randomwordArr = [];
var currentRandomWord;
var currentInput = '';
var currentCharIndex = 0;
var totalPoints = 0;

class gameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'game' });
  }
  preload () {
    // Hearts:
    this.load.image('fullHeart', 'assets/images/HUD/hud_heartFULL.png');
    this.load.image('halfHeart', 'assets/images/HUD/hud_heartHalf.png');
    this.load.image('emptyHeart', 'assets/images/HUD/hud_heartEmpty.png');

    // Music:
    this.load.audio('robot', 'assets/sound/Robot_Boogie.mp3');

    // Platforms:
    this.load.image('platformLeft', 'assets/images/Tiles/stoneHalfLeft.png');
    this.load.image('platformCenter', 'assets/images/Tiles/stoneHalfMid.png');
    this.load.image('platformRight', 'assets/images/Tiles/stoneHalfRight.png');

    // Sprite:
    this.load.image('character', 'assets/images/Player/p3_front.png');
    this.load.image('charJump', 'assets/images/Player/p3_jump.png');
    this.load.image('charHurt', 'assets/images/Player/p3_hurt.png');
  }

  create () {
    this.add.image(400, 300, 'sky');
    // Music:
    let music = this.sound.play('robot', true);

    // Character:
    this.anims.create({
      key: 'jump',
      frames: [
        { key: 'charJump' },
        { key: 'character' }
      ],
      duration: 100
    });
    this.anims.create({
      key: 'hurt',
      frames: [
        { key: 'charHurt' },
        { key: 'character' }
      ],
      duration: 2000
    });
    character = this.add.sprite(400, 550, 'character');
    character.depth = 1; // brings sprite to front of all objects

    platformOneLeft = this.add.image(350, 360, 'platformLeft');
    platformOneMid = this.add.image(400, 360, 'platformCenter');
    platformOneRight = this.add.image(450, 360, 'platformRight');
    platformTwoLeft = this.add.image(350, 85, 'platformLeft');
    platformTwoMid = this.add.image(400, 85, 'platformCenter');
    platformTwoRight = this.add.image(450, 85, 'platformRight');
    platformThreeLeft = this.add.image(350, -190, 'platformLeft');
    platformThreeMid = this.add.image(400, -190, 'platformCenter');
    platformThreeRight = this.add.image(450, -190, 'platformRight');

    // Health:
    var heart1 = this.add.image(50, 50, 'fullHeart');
    var heart2 = this.add.image(100, 50, 'fullHeart');
    var heart3 = this.add.image(150, 50, 'fullHeart');
    var hearts = [ heart1, heart2, heart3 ];
    var health = hearts.length;

    var style = {
      fontFamily: 'Roboto Condensed',
      fontSize: '32px'
    };

    // Score:
    // Updating Score: https://phaser.io/tutorials/making-your-first-phaser-3-game/part9
    this.add.text(550, 25, 'Score: ', style);

    let score = this.add.text(650, 25, totalPoints.toString(), style);

    // Words:
    let wordStyle = {
      fontFamily: 'Roboto Condensed',
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#4858AE'
    };

    // Display Word
    var randomWord = getRandomWord();
    while (randomWord.indexOf(' ') >= 0 || randomWord.indexOf("'") >= 0 || randomWord.indexOf('-') >= 0) {
      console.log('Is an invalid word!');
      randomWord = getRandomWord();
    }

    var position = 400 - randomWord.length * 7;
    let text = this.add.text(position, 300, randomWord, style);

    // Keyboard combo input.
    kb = this.input.keyboard;
    // kb.createCombo(randomWord);

    //
    let forgive = false;

    this.input.keyboard.on('keydown', function (event) {
      console.log('testing= ' + event.key);
      let currentInputChar = event.key;
      // checkLetter, outputs green/red
      if (currentInputChar === 'Backspace') {
        currentInput = currentInput.slice(0, currentInput.length - 1);
        if (currentCharIndex > 0) {
          currentCharIndex--;
        }
      } else {
        if (acceptableKeys.includes(currentInputChar)) { // user did not type anything weird e.g. shift
          if (currentInputChar === randomWord[currentCharIndex]) { // user typed correct letter
            currentInput += currentInputChar;
            currentCharIndex++;
          } else { // user typed wrong letter, so reset word
            character.play('hurt');
            currentInput = '';
            currentCharIndex = 0;
            // randomWord = getRandomWord();

            // while (randomWord.indexOf(' ') >= 0 || randomWord.indexOf("'") >= 0 || randomWord.indexOf("-") >= 0) {
            //   console.log("Is an invalid word!");
            //   randomWord = getRandomWord();
            // }

            // text.setText(randomWord);
            // position = 400 - randomWord.length * 7;
            // text.setX(position);
            if (!forgive) {
              if (health > 0) {
                hearts[--health].setVisible(false);
              }
              else {
                console.log('test');
                // debugger;
                this.game.scene.start('over');
              }
              forgive = true;
            }
          }
        }
      }

      // Matched word, get new word
      if (currentInput === randomWord) {
        jumpingAnimation = true;
        // removeTilesForWord();
        currentInput = '';
        currentCharIndex = 0;
        // get new word
        randomWord = getRandomWord();
        while (randomWord.indexOf(' ') >= 0 || randomWord.indexOf("'") >= 0 || randomWord.indexOf('-') >= 0) {
          console.log('Is an invalid word!');
          randomWord = getRandomWord();
        }
        forgive = false;

        text.setText(randomWord);
        position = 400 - randomWord.length * 7;
        text.setX(position);
        // currentInput = '';

        totalPoints += 50; // Base score per word
        totalPoints += randomWord.length * 10; // Improves score based on number of characters.
        score.setText(totalPoints.toString());
      }
      // console.log('currentInput=' + currentInput);
      // console.log('currentCharIndex=' + currentCharIndex);
    });
  }

  update () {
    if (jumpingAnimation && character.y >= 285) {
      character.y -= 5;
      character.play('jump');
    } else if (character.y <= 550) {
      jumpingAnimation = false;
      platformOneLeft.y += 5;
      platformOneMid.y += 5;
      platformOneRight.y += 5;
      platformTwoLeft.y += 5;
      platformTwoMid.y += 5;
      platformTwoRight.y += 5;
      platformThreeLeft.y += 5;
      platformThreeMid.y += 5;
      platformThreeRight.y += 5;
      character.y += 5;
    }
    if (platformOneLeft.y > 600) {
      platformOneLeft.y = -215;
      platformOneMid.y = -215;
      platformOneRight.y = -215;
    } else if (platformTwoLeft.y > 600) {
      platformTwoLeft.y = -215;
      platformTwoMid.y = -215;
      platformTwoRight.y = -215;
    } else if (platformThreeLeft.y > 600) {
      platformThreeLeft.y = -215;
      platformThreeMid.y = -215;
      platformThreeRight.y = -215;
    }
  }
}

class gameOverScene extends Phaser.Scene {
  constructor () {
    super({ key: 'over' });
  }
  preload () {
    // Background:
    this.load.image('sky', 'assets/sky.png');

    // Character:
    this.load.image('character', 'assets/images/Player/p3_front.png');

    // Music:
    this.load.audio('seinfeld', 'assets/sound/Seinfeld.mp3');
  }
  create () {
    this.add.image(400, 300, 'sky');
    let char = this.add.image(400, 550, 'character');

    let music = this.sound.add('seinfeld', true); // true = loop for Phaser 3?
    music.play();

    let endText = this.add.text(200, 200, 'THE END', { fontFamily: '"Roboto Condensed"', fontSize: '64px' });
    let tryAgainButton = this.add.text(300, 300, 'Try again?', { fontFamily: '"Roboto Condensed"', fontSize: '32px' }).setInteractive();
    submit_score(totalPoints);
    tryAgainButton.on('pointerdown', (pointer) => {
      this.scene.start('start');
      // this.manager.game.scene.start('start');
      // this.scene.manager.scenes[1].start('start');
      // this.scene.manager.start('start');
      console.log('clicked');
    });
  }
}

let phaserconfig = {
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: true
    }
  },
  scene: [startScene, gameScene, gameOverScene],
  scale: {
    parent: 'phaser',
    mode: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  }
};

let game = new Phaser.Game(phaserconfig);
this.scene.add('start', startScene, false, { x: 400, y: 300 });
this.scene.add('game', gameScene, false, { x: 400, y: 300 });
this.scene.add('over', gameOverScene, false, { x: 400, y: 300 });
