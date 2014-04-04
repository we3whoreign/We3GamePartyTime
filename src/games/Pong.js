( function () {
	// Canvas setup
	var canvas = document.getElementById("gameCanvas");
	canvas.width = 800;
	canvas.height = 600;
	var	context = canvas.getContext('2d'),
		fps = 120,
		elements = [],
		collidables = [];
	
	function init() {
		var leftPaddle = new Entity(),
			rightPaddle = new Entity(),
			stage = new Entity(),
			ball = new Entity();
			wallOfJustice = new Entity();
		
		ball.velocity = new Point(-1,0);
		
	
		leftPaddle._createBoundingShape = function () {
			return new BoundingRectangle(30 /* height */,60 /* width */, new Point(40, canvas.height/2 - 15));
		};
		
		rightPaddle._createBoundingShape = function () {
			return new BoundingRectangle(30 /* height */,60 /* width */, new Point(canvas.width - 40, canvas.height/2  - 15));
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
		}
		
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
	}
	
	
	function update(){
		var paddle = elements["leftPaddle"],
			prinny = elements["rightPaddle"],
            stage = elements["stage"],
			ball = elements["ball"],
			wall = elements["wall"],
			npc = [stage.boundingShape, ball.boundingShape, wall.boundingShape],
			speed = 3;            
         
		var dP = new Point(0,0);
					
		if(paddle.keysPressed.Left) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point(-speed, 0 ))) {
                dP.x -= speed;
            }
		}
		if(paddle.keysPressed.Right) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point(speed, 0 ))) {
                dP.x += speed;
            }
		}
		if(paddle.keysPressed.Up) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point( 0, -speed ))) {
                dP.y -= speed;
            }
		}
		if(paddle.keysPressed.Down) {
            if (!paddle.boundingShape.preemptiveCollidesWith( npc, new Point( 0, speed ))) {
                dP.y += speed;
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
				if (findLineInCollisions(collisions, lines.TOP)) {
					ball.velocity.y = 1;
				} else if (findLineInCollisions(collisions, lines.BOTTOM)) {
					ball.velocity.y = -1;
				}
				
				if (findLineInCollisions(collisions, lines.LEFT)) {
					ball.velocity.x = 1;
				} else if (findLineInCollisions(collisions, lines.RIGHT)) {
					ball.velocity.x = -1;
				}
			} else {
				lines = preemptiveCollisions.object.lines;
				if (findLineInCollisions(collisions, lines.RIGHT)) {
					ball.velocity.x = 1;
				} else if (findLineInCollisions(collisions, lines.LEFT)) {
					ball.velocity.x = -1;
				}
				ball.velocity.y = (ball.center.y > preemptiveCollisions.object.center.y) ? 1 : -1;
			}
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
	
	function gameLoop() {
		update();
		draw();
	}
	
	init();
	window.setInterval(gameLoop, 1000/fps);
})();