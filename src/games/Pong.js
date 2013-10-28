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
		//console.log("Adding to elements: \n"+leftPaddle.toString());
		elements["rightPaddle"] = rightPaddle;
		elements["stage"] = stage;
        
		// NPC List of collidable objects
		npc.push(rightPaddle.boundingShape);
		npc.push(stage.boundingShape);
		//console.log("Adding to elements: \n"+rightPaddle.toString());
	}
	
	
	function update(){
		var paddle = elements["leftPaddle"],
			prinny = elements["rightPaddle"],
            stage = elements["stage"],
			speed = 3;
			//collision = paddle.boundingShape.collidesWith(prinny.boundingShape);
            
         
         // Move the prinny first
         if(!prinny.speed) {
            prinny.speed = 1;
         }
         
         if(prinny.boundingShape.preemptiveCollidesWith( [stage.boundingShape, paddle.boundingShape], new Point(prinny.speed, 0))) {
            prinny.speed = -1 * prinny.speed;
            if(prinny.boundingShape.preemptiveCollidesWith( [stage.boundingShape, paddle.boundingShape], new Point(prinny.speed, 0))) {
                prinny.speed = 0;
            }
         }

         prinny.center.moveBy(prinny.speed, 0);
         
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
	
	function waggleBall() {
		var ball = elements["ball"],
			player = elements["leftPaddle"],
			npcPaddle = elements["rightPaddle"],
			edge = elements["stage"],
			paddles = [],
			temp;
			
		paddles.push(player);
		paddles.push(npcPaddle);
		
		
		temp = ball.boundingShape.preemptiveCollidesWith([player.boundingShape,edge.boundingShape, npcPaddle.boundingShape],ball.velocity);
		
		if(!temp){
			console.log("FRICKIMINGLES");
			ball.center = ball.center.add(ball.velocity);
		}else{
			console.log("PICKADINGLES?");
			ball.velocity.x = -1 * ball.velocity.x;
			ball.velocity.y = (ball.center.y > temp.center.y) ? -1 : 1;
			//ball.velocity = new Point(ball.velocity.x*-1,0);
		}
		
		temp = ball.boundingShape.preemptiveCollidesWith([player.boundingShape], ball.velocity);
		//console.log(temp + ball.boundingShape.center + player.boundingShape.center);
		/* if(temp) {
			console.log("PUSSY BADGER Inc.");
			var collisionLine = new Line(ball.center, temp.center);
			ball.velocity = new Point(collisionLine.startPoint.x - collisionLine.endPoint.x, collisionLine.startPoint.y - collisionLine.endPoint.y);
		} else if((temp = ball.boundingShape.collidesWith(edge)).status === "colliding") {
			if (temp.otherLine.name === BoundingRectangle.TOP || temp.otherLine.name === BoundingRectangle.BOTTOM) {
				ball.velocity = new Point(ball.velocity.x, -1 * ball.velocity.y);
			} else if (temp.otherLine.name === BoundingRectangle.LEFT) {
				// DO SHITGIRL
			} else {
				// DO SHITBOY
			}
		} */
		//console.log(ball.boundingShape.center + ball.velocity.x + ball.velocity.y + " I never liked your spinach puffs");
		//TODO: Rock the cock
		//ball.center.x += ball.velocity.x
	}
	
	function draw() {
		//var liney = new Line(elements["leftPaddle"].center, elements["rightPaddle"].center);
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