( function () {

	// Game States
	var GameState = {
		Menu: 1,
		Play: 2,
		Pause: 3,
		PlayAgain: 4
	};
	
	// Canvas setup
	var canvas = document.getElementById("gameCanvas");
	canvas.width = Settings.canvasWidth;
	canvas.height = Settings.canvasHeight;
	var	context = canvas.getContext('2d'),
		fps = Settings.fps,
		elements = [],
		prinScore = 0,
		blazeScore = 0,
		gameState = GameState.Play,
		click = false,
		buttons = [];
	
	function init() {
		playinit();
		
		// Menu must go last, because it's the first gamestate
		menuinit();
	}
	
	function playinit() {
		var leftPaddle = new Entity(),
			rightPaddle = new Entity(),
			stage = new Entity(),
			ball = new Entity(),
			wallOfJustice = new Entity(),
			prinScoreText = function () {},
			blazeScoreText = function () {};
		
		ball.velocity = new Point(Settings.ballSpeed,0);
		
	
		leftPaddle._createBoundingShape = function () {
			return new BoundingRectangle(60 /* height */,30 /* width */, new Point(40, canvas.height/2 - 15));
		};
		
		rightPaddle._createBoundingShape = function () {
			return new BoundingRectangle(60 /* height */,30 /* width */, new Point(canvas.width - 40, canvas.height/2  - 15));
		};
		
		stage._createBoundingShape = function () {
			return new BoundingRectangle(canvas.height, canvas.width, this.center);
		};
		
		ball._createBoundingShape = function () {
			return new BoundingRectangle(15,15, this.center);
		};
		
		wallOfJustice._createBoundingShape = function() {
			return new BoundingRectangle(canvas.height, 5, this.center);
		}
		
		leftPaddle.draw = function () {
			var bs = this.boundingShape;
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y - bs.height*0.5;
			context.drawImage(this.image, topLeftX, topLeftY, bs.width, bs.height);
			//bs.draw(context);
		};
		
		rightPaddle.draw = function () {
			var bs = this.boundingShape;
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y - bs.height*0.5;
			context.drawImage(this.image, topLeftX, topLeftY, bs.width, bs.height);
			//bs.draw(context);
		};
		
		stage.draw = function () { };
		
		ball.draw = function () {
			var bs = this.boundingShape;
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y - bs.height*0.5;
				
			context.fillStyle = '#ffffff';
			context.fillRect(topLeftX, topLeftY, bs.width, bs.height);
		};
		
		wallOfJustice.draw = function(){
			var bs = this.boundingShape;
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y - bs.height*0.5;
				
			context.fillStyle = '#ffffff';
			context.fillRect(topLeftX, topLeftY, bs.width, bs.height);
		};
		
		prinScoreText.draw = function() {
			context.strokeStyle = "#ffffff";
			context.strokeText(prinScore, canvas.width - 25, 25);
		};
		
		blazeScoreText.draw = function() {
			context.strokeStyle= "#ffffff";
			context.strokeText(blazeScore, 25, 25);
		};
		
		
		
		leftPaddle.image = new Image();
		leftPaddle.image.src = "../lib/images/leftpaddle.png";
		rightPaddle.image = new Image();
		rightPaddle.image.src = "../lib/images/rightpaddle.png";
		
		leftPaddle.center = new Point(50,50);
		rightPaddle.center = new Point(100,100);
		stage.center = new Point(canvas.width/2, canvas.height/2);
		ball.center = new Point(stage.center.x, stage.center.y);
		wallOfJustice.center = new Point(stage.center.x, stage.center.y);
		
		leftPaddle.keysPressed = {
			Left: false,
			Right: false,
			Up: false,
			Down: false
		};
		
		window.addEventListener('keyup', function(event) {
			if (event.keyCode){
				switch(event.keyCode){
					case 37:
						leftPaddle.keysPressed.Left = false;
						break;
					case 38:
						leftPaddle.keysPressed.Up = false;
						break;
					case 39:
						leftPaddle.keysPressed.Right = false;
						break;
					case 40:
						leftPaddle.keysPressed.Down = false;
				}
			}
		});
		
		window.addEventListener('keydown', function(event) {
			if (event.keyCode){
				switch(event.keyCode){
					case 37:
						leftPaddle.keysPressed.Left = true;
						break;
					case 38:
						leftPaddle.keysPressed.Up = true;
						break;
					case 39:
						leftPaddle.keysPressed.Right = true;
						break;
					case 40:
						leftPaddle.keysPressed.Down = true;
				}
			}
		});
		
		elements["leftPaddle"] = leftPaddle;
		elements["rightPaddle"] = rightPaddle;
		elements["stage"] = stage;
		elements["ball"] = ball;
		elements["wall"] = wallOfJustice;
		elements["blazeScore"] = blazeScoreText;
		elements["prinScore"] = prinScoreText;
		
		this._playElements = elements;
		// elements = [];
	}
	
	function menuinit() {
	
	}
	
	function menu() {
		//TODO: Add menu buttons
		canvas.onmousedown = function(e) {
			click = true;
		};
		
		canvas.onmouseup = function(e) {
			click = false;
		};
		
		canvas.onmousemove = function(e) {
			var x = e.clientX;
			var y = e.clientY;
			
			x -= canvas.offsetLeft;
			y -= canvas.offsetTop;
			
			for(i in buttons) {
				buttons[i].updateMouseStatus(x,y,click);
			}
		};
	}
	
	function play() {
		var paddle = elements["leftPaddle"],
			prinny = elements["rightPaddle"],
            stage = elements["stage"],
			ball = elements["ball"],
			wall = elements["wall"],
			npc = [stage.boundingShape, ball.boundingShape, wall.boundingShape];        
         
		var dP = new Point(0,0);
					
		if(paddle.keysPressed.Left) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point(-Settings.paddleSpeed, 0 ))) {
                dP.x -= Settings.paddleSpeed;
            }
		}
		if(paddle.keysPressed.Right) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point(Settings.paddleSpeed, 0 ))) {
                dP.x += Settings.paddleSpeed;
            }
		}
		if(paddle.keysPressed.Up) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point( 0, -Settings.paddleSpeed ))) {
                dP.y -= Settings.paddleSpeed;
            }
		}
		if(paddle.keysPressed.Down) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point( 0, Settings.paddleSpeed ))) {
                dP.y += Settings.paddleSpeed;
            }
		}
        
        paddle.center.moveByVector(dP);
		
		waggleBall();
	}
	
	function findLineInCollisions(collisions, line) {
			for(var i = 0; i < collisions.length; i++) {
				var collision = collisions[i];
				if(collision.otherLine === line.name){
					return true;
				}
			}
			
			return false;
	}
	
	function waggleBall() {
		var ball = elements["ball"],
			player = elements["leftPaddle"],
			npcPaddle = elements["rightPaddle"],
			edge = elements["stage"],
			preemptiveCollision;
		
		preemptiveCollisions = ball.boundingShape.preemptiveCollidesWith([player.boundingShape,edge.boundingShape, npcPaddle.boundingShape],ball.velocity);
		
		if(!preemptiveCollisions){
			// If the ball is not colliding, go ahead and move it by the velocity
			ball.center.moveByVector(ball.velocity);
		}else{
			preemptiveCollisions = preemptiveCollisions[0];
			
			var collisions = preemptiveCollisions.collisions,
				lines = [];
				
			if (preemptiveCollisions.object == edge.boundingShape) {
				lines = edge.boundingShape.lines;
				if (findLineInCollisions(collisions, lines.TOP) || (findLineInCollisions(collisions, lines.BOTTOM))) {
					ball.velocity.y = -ball.velocity.y;
				}
				
				if (findLineInCollisions(collisions, lines.LEFT)) {
					scoreForPrin();
					return;
				} else if (findLineInCollisions(collisions, lines.RIGHT)) {
					scoreForBlaze();
					return;
				}
			} else {
				lines = preemptiveCollisions.object.lines;
				if (findLineInCollisions(collisions, lines.RIGHT)) {
					ball.velocity.x = Settings.ballSpeed;
				} else if (findLineInCollisions(collisions, lines.LEFT)) {
					ball.velocity.x = -Settings.ballSpeed;
				}
				
				ratio = (ball.center.y - preemptiveCollisions.object.center.y)/(preemptiveCollisions.object.height/2);
				ball.velocity.y = ratio * Settings.ballSpeed;
			}
		}
	}
	
	function scoreForPrin(){
		prinScore++;
		resetBall(-Settings.ballSpeed);
	}
	
	function scoreForBlaze(){
		blazeScore++;	
		resetBall(Settings.ballSpeed);			
	}
	
	function resetBall(direction) {
		stage = elements["stage"];
		ball = elements["ball"];
		
		ball.center = new Point(stage.center.x, stage.center.y);
		ball.velocity = new Point(direction,0);
	}
	
	function gameLoop() {
		update();
		draw();
	}
	
	function update(){
		switch(gameState) {
			case GameState.Menu:
				menu();
				break;
			case GameState.Play:
				play();
				break;
			default:
				wtfboom();
				break; //no, really
		}
	}
		
	function draw() {
		// repaint the canvas to clear it
		context.fillStyle = "#000000";
		context.fillRect(0,0,canvas.width, canvas.height);
		//liney.draw(context);
		for(i in elements){
			elements[i].draw();
		}
	}
	
	init();
	window.setInterval(gameLoop, 1000/fps);
})();