class Snake {
    constructor() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    move() {
        this.direction = this.nextDirection;
        const head = { ...this.body[0] };

        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        this.body.unshift(head);
        this.body.pop();
    }

    grow() {
        const tail = { ...this.body[this.body.length - 1] };
        this.body.push(tail);
    }

    checkCollision(gridSize) {
        const head = this.body[0];
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true;
        }
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileSize = this.canvas.width / this.gridSize;
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.gameLoop = null;
        this.isGameOver = false;
        this.isPaused = false;

        this.bindControls();
        this.bindTouchControls();
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('pauseButton').addEventListener('click', () => this.togglePause());

        // 保存最高分到本地存储
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
        this.updateHighScore();
    }

    bindControls() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (!this.isGameOver) {
                    this.togglePause();
                }
                return;
            }
            if (this.isPaused) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (this.snake.direction !== 'down') this.snake.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.snake.direction !== 'up') this.snake.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.snake.direction !== 'right') this.snake.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.snake.direction !== 'left') this.snake.nextDirection = 'right';
                    break;
            }
        });
    }

    bindTouchControls() {
        const upButton = document.getElementById('upButton');
        const downButton = document.getElementById('downButton');
        const leftButton = document.getElementById('leftButton');
        const rightButton = document.getElementById('rightButton');

        const handleDirection = (direction) => {
            if (this.isPaused || this.isGameOver) return;
            switch (direction) {
                case 'up':
                    if (this.snake.direction !== 'down') this.snake.nextDirection = 'up';
                    break;
                case 'down':
                    if (this.snake.direction !== 'up') this.snake.nextDirection = 'down';
                    break;
                case 'left':
                    if (this.snake.direction !== 'right') this.snake.nextDirection = 'left';
                    break;
                case 'right':
                    if (this.snake.direction !== 'left') this.snake.nextDirection = 'right';
                    break;
            }
        };

        upButton.addEventListener('click', () => handleDirection('up'));
        downButton.addEventListener('click', () => handleDirection('down'));
        leftButton.addEventListener('click', () => handleDirection('left'));
        rightButton.addEventListener('click', () => handleDirection('right'));
    }

    togglePause() {
        if (!this.isGameOver) {
            this.isPaused = !this.isPaused;
            document.getElementById('pauseButton').textContent = this.isPaused ? '继续' : '暂停';
            this.draw();
        }
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.body.some(segment => 
            segment.x === food.x && segment.y === food.y));
        return food;
    }

    update() {
        if (this.isGameOver || this.isPaused) return;

        this.snake.move();

        // 检查是否吃到食物
        if (this.snake.body[0].x === this.food.x && this.snake.body[0].y === this.food.y) {
            this.snake.grow();
            this.food = this.generateFood();
            this.score += 10;
            this.updateScore();
        }

        // 检查碰撞
        if (this.snake.checkCollision(this.gridSize)) {
            this.gameOver();
        }
    }

    updateScore() {
        document.getElementById('score').textContent = `分数: ${this.score}`;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
            this.updateHighScore();
        }
    }

    updateHighScore() {
        const scoreElement = document.getElementById('score');
        scoreElement.textContent = `分数: ${this.score} | 最高分: ${this.highScore}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制食物
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            this.food.x * this.tileSize,
            this.food.y * this.tileSize,
            this.tileSize,
            this.tileSize
        );

        // 绘制蛇
        this.snake.body.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize,
                this.tileSize
            );
            
            // 在前三个蛇身上写字
            if (index < 3) {
                const characters = ['一', '次', '幸'];
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = `${this.tileSize * 0.8}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(
                    characters[index],
                    (segment.x * this.tileSize) + (this.tileSize / 2),
                    (segment.y * this.tileSize) + (this.tileSize / 2)
                );
            }
        });

        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2);
        } else if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('已暂停', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '20px Arial';
            this.ctx.fillText('按空格键继续', this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    loop() {
        this.update();
        this.draw();
    }

    startGame() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;
        document.getElementById('pauseButton').textContent = '暂停';
        this.updateScore();
        this.gameLoop = setInterval(() => this.loop(), 150);
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        this.draw();
    }
}

// 初始化游戏
const game = new Game();