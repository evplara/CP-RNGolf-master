class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200                       
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1700
    }                       
    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0);

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup');
        this.cup.body.setCircle(this.cup.width / 4);
        this.cup.body.setOffset(this.cup.width / 4);
        this.cup.body.setImmovable(true);

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball');
        this.ball.body.setCircle(this.ball.width / 2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall');
        wallA.setX(Phaser.Math.Between(wallA.width / 2, width - wallA.width / 2));
        wallA.body.setImmovable(true);

        let wallB = this.physics.add.sprite(0, height / 2, 'wall');
        wallB.setX(Phaser.Math.Between(wallB.width / 2, width - wallB.width / 2));
        wallB.body.setImmovable(true);

        this.walls = this.add.group([wallA, wallB]);

        // add moving obstacle
        this.movingWall = this.physics.add.sprite(width / 2, height / 3, 'wall');
        this.movingWall.body.setImmovable(true);
        this.movingWall.body.setVelocityX(200);

        // add one-way platform
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway');
        this.oneWay.setX(Phaser.Math.Between(this.oneWay.width / 2, width - this.oneWay.width / 2));
        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;

        // add shot counter and score UI
        this.shotCount = 0;
        this.score = 0;
        this.successfulShots = 0;

        this.shotText = this.add.text(20, 20, 'Shots: 0', { fontSize: '24px', fill: '#fff' });
        this.scoreText = this.add.text(20, 50, 'Score: 0', { fontSize: '24px', fill: '#fff' });
        this.percentText = this.add.text(20, 80, 'Accuracy: 0%', { fontSize: '24px', fill: '#fff' });

        // add pointer input for shooting
        this.input.on('pointerdown', (pointer) => {
            this.shootBall(pointer);
        });

        // ball and cup collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            this.resetBall();
        });

        // ball and walls collision
        this.physics.add.collider(this.ball, this.walls);
        this.physics.add.collider(this.ball, this.movingWall);

        // ball and one-way platform collision
        this.physics.add.collider(this.ball, this.oneWay);
    }

    update() {
        if (this.movingWall.body.velocity.x > 0 && this.movingWall.x >= width - this.movingWall.width / 2) {
            this.movingWall.setVelocityX(-200); //move left
        } else if (this.movingWall.body.velocity.x < 0 && this.movingWall.x <= this.movingWall.width / 2) {
            this.movingWall.setVelocityX(200); //move right
        }
    }
    
    shootBall(pointer) {
        //increment shot counter
        this.shotCount++;
        this.shotText.setText(`Shots: ${this.shotCount}`);

        //calculate direction based on pointer's relative x-position
        let shotDirection = pointer.y <= this.ball.y ? 1 : -1;
        let xDirection = (pointer.x - this.ball.x) / (width / 2); // Normalize x direction

        this.ball.body.setVelocityX(xDirection * this.SHOT_VELOCITY_X);
        this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection);
    }

    resetBall() {
        //reset ball position
        this.ball.setPosition(width / 2, height - height / 10);
        this.ball.setVelocity(0, 0);

        //update score and accuracy
        this.score++;
        this.successfulShots++;
        this.scoreText.setText(`Score: ${this.score}`);

        let accuracy = ((this.successfulShots / this.shotCount) * 100).toFixed(1);
        this.percentText.setText(`Accuracy: ${accuracy}%`);
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[X] Create and display shot counter, score, and successful shot percentage
*/