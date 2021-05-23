var cursors, knight, crates, coinTimer, scoreText, timeLeftText, timeLeftTimer, startText;
var score = 0;
var secondsLeft = 60;
var gameOver = false;
var coinsToTime = 0;

var config = {
    width: 810,
    height: 600,
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload: gamePreload,
        create: gameCreate,
        update: gameUpdate
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            checkCollision: {
                up: false,
                down: false,
            },
            // debug: true
        }
    }
}

function gamePreload() {
    // Loading assets
    this.load.image('knight', 'assets/knight.png');
    this.load.image('crate', 'assets/crate.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('bitcoin', 'assets/bitcoin.png');

    // Load run animation frames
    this.load.image('run_frame_1', 'assets/knight/run/Run (1).png');
    this.load.image('run_frame_2', 'assets/knight/run/Run (2).png');
    this.load.image('run_frame_3', 'assets/knight/run/Run (3).png');
    this.load.image('run_frame_4', 'assets/knight/run/Run (4).png');
    this.load.image('run_frame_5', 'assets/knight/run/Run (5).png');
    this.load.image('run_frame_6', 'assets/knight/run/Run (6).png');
    this.load.image('run_frame_7', 'assets/knight/run/Run (7).png');
    this.load.image('run_frame_8', 'assets/knight/run/Run (8).png');
    this.load.image('run_frame_9', 'assets/knight/run/Run (9).png');
    this.load.image('run_frame_10', 'assets/knight/run/Run (10).png');

    // Load idle animation frames
    this.load.image('idle_frame_1', 'assets/knight/idle/Idle (1).png');
    this.load.image('idle_frame_2', 'assets/knight/idle/Idle (2).png');
    this.load.image('idle_frame_3', 'assets/knight/idle/Idle (3).png');
    this.load.image('idle_frame_4', 'assets/knight/idle/Idle (4).png');
    this.load.image('idle_frame_5', 'assets/knight/idle/Idle (5).png');
    this.load.image('idle_frame_6', 'assets/knight/idle/Idle (6).png');
    this.load.image('idle_frame_7', 'assets/knight/idle/Idle (7).png');
    this.load.image('idle_frame_8', 'assets/knight/idle/Idle (8).png');
    this.load.image('idle_frame_9', 'assets/knight/idle/Idle (9).png');
    this.load.image('idle_frame_10', 'assets/knight/idle/Idle (10).png');
}

function gameCreate() {
    // background
    this.add.image(390, 330, 'background');

    //knight main character
    knight = this.physics.add.sprite(40, 480, 'knight');
    knight.body.setSize(420, 600, 100, 100);
    knight.scaleX = 0.15;
    knight.scaleY = knight.scaleX;
    knight.body.collideWorldBounds = true;

    //crates floor
    var mapBottom = 562;
    var crateSize = 82;
    crates = this.physics.add.staticGroup();
    for (var i = 0; i < 3; i++) {
        i !== 1 && crates.create(38 + i * crateSize, mapBottom, 'crate');
    }

    //crates air
    crates.create(4 * crateSize, mapBottom - (1.5 * crateSize), 'crate');
    crates.create(2 * crateSize, mapBottom - (3.5 * crateSize), 'crate');
    crates.create(5 * crateSize, mapBottom - (2.5 * crateSize), 'crate');
    crates.create(7 * crateSize, mapBottom - (4 * crateSize), 'crate');
    crates.create(7 * crateSize, mapBottom - (1 * crateSize), 'crate');
    crates.create(9 * crateSize, mapBottom - (5.5 * crateSize), 'crate');
    crates.create(8 * crateSize, mapBottom, 'crate');
    crates.create(10 * crateSize, mapBottom, 'crate');

    //create animations
    this.anims.create({
        key: "knight_run",
        frames: [
            { key: 'run_frame_1' },
            { key: 'run_frame_2' },
            { key: 'run_frame_3' },
            { key: 'run_frame_4' },
            { key: 'run_frame_5' },
            { key: 'run_frame_6' },
            { key: 'run_frame_7' },
            { key: 'run_frame_8' },
            { key: 'run_frame_9' },
            { key: 'run_frame_10' },
        ],
        frameRate: 10,
        repeat: 1,
    });

    this.anims.create({
        key: "knight_idle",
        frames: [
            { key: 'idle_frame_1' },
            { key: 'idle_frame_2' },
            { key: 'idle_frame_3' },
            { key: 'idle_frame_4' },
            { key: 'idle_frame_5' },
            { key: 'idle_frame_6' },
            { key: 'idle_frame_7' },
            { key: 'idle_frame_8' },
            { key: 'idle_frame_9' },
            { key: 'idle_frame_10' },
        ],
        frameRate: 10,
        repeat: 1,
    });

    // collision detection
    this.physics.add.collider(knight, crates);

    // cursors/keyboard init
    cursors = this.input.keyboard.createCursorKeys();

    // coin timer
    coinTimer = this.time.addEvent({
        delay: Phaser.Math.Between(3000, 9000),
        callback: generateCoins,
        callbackScope: this,
        repeat: -1
    });

    // timeLeftTimer
    timeLeftTimer = this.time.addEvent({
        delay: 1000,
        callback: updateTimeLeft,
        callbackScope: this,
        repeat: -1
    });

    // texts
    scoreText = this.add.text(16, 16, "Bitcoin Bag: 0", { fontSize: "32px", fill: "#000" })
    timeLeftText = this.add.text(16, 66, `${secondsLeft} seconds left`, { fontSize: "32px", fill: "#f00" });
    startText = this.add.text(16, 66, 'click to START', { fontSize: "32px", fill: "#FFC300" });
    startText.setInteractive();
    startText.alpha = 0;

    startText.on('pointerdown', function () {
        score = 0;
        secondsLeft = 60;
        gameOver = false;
        coinsToTime = 0;
        scoreText.setText('Bitcoin Bag: 0');
        knight.setPosition(40, 480);
    })
}

function updateTimeLeft() {
    timeLeftText.setText(`${secondsLeft - 1} seconds left`);
    secondsLeft -= 1;
    startText.setText('');

    if (secondsLeft <= 0 || gameOver) {
        startText.alpha = 1;
        gameOver = true;
        this.physics.pause();
        scoreText.setText('GAME OVER');
        timeLeftText.setText('');
        startText.setText('click to START');
    }
}

function generateCoins() {
    if (gameOver) return;

    // create coins
    var coins = this.physics.add.group({
        key: "bitcoin",
        repeat: Phaser.Math.Between(1, 12),
        setXY: {
            x: Phaser.Math.Between(0, 800),
            y: - 100,
            stepX: Phaser.Math.Between(30, 100)
        }
    })

    coins.children.iterate(function (coin) {
        coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.9));
    })

    // collision detection
    this.physics.add.collider(coins, crates);
    this.physics.add.overlap(knight, coins, collectCoin, null, this);
}

function collectCoin(knight, coin) {
    coin.disableBody(true, true);
    score++;
    coinsToTime++;

    if (coinsToTime >= 10) {
        coinsToTime = 0;
        secondsLeft += 30;
    }
    scoreText.setText(`Bitcoin Bag: ${score}`);
}

function gameUpdate() {
    var horizontalMove = 100;

    if (knight.y > 560) {
        gameOver = true;
        startText.alpha = 1;
    }

    if (!gameOver) this.physics.resume();

    if (cursors.left.isDown && !gameOver) {
        knight.setVelocityX(-horizontalMove);
        knight.play('knight_run', true);
        knight.flipX = true;
    } else if (cursors.right.isDown && !gameOver) {
        knight.setVelocityX(horizontalMove);
        knight.play('knight_run', true);
        knight.flipX = false;
    } else {
        knight.setVelocityX(0);
        knight.play('knight_idle', true);
    }

    if (cursors.up.isDown && knight.body.touching.down) {
        knight.setVelocityY(-300);
    }
}

var game = new Phaser.Game(config);