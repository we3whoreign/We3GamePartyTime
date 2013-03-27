( function () {
	// Canvas setup
	var canvas = document.getElementById("gameCanvas");
	canvas.width = 800;
	canvas.height = 600;
	var	context = canvas.getContext('2d'),
		fps = 120,
		elements = [];
	
	function init() {
		var leftPaddle = new Entity(),
			rightPaddle = new Entity();
		
	
		leftPaddle._createBoundingShape = function () {
			console.log("Creating boundingRectangle");
			return new BoundingRectangle(30 /* height */,60 /* width */, this.center);
		};
		
		rightPaddle._createBoundingShape = function () {
			return new BoundingRectangle(30 /* height */,60 /* width */, this.center);
		};
		
		leftPaddle.draw = function () {
			var bs = this.boundingShape;
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y + bs.height*0.5;
			//context.drawImage(this.image, topLeftX, topLeftY, bs.width, bs.height);
			bs.draw(context);
		};
		
		rightPaddle.draw = function () {
			var bs = this.boundingShape;
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y + bs.height*0.5;
			//context.drawImage(this.image, topLeftX, topLeftY, bs.width, bs.height);
			bs.draw(context);
		};
		
		leftPaddle.image = new Image();
		leftPaddle.image.src = "../lib/images/leftpaddle.png";
		rightPaddle.image = new Image();
		rightPaddle.image.src = "../lib/images/rightpaddle.png";
		
		leftPaddle.center = new Point(50,50);
		rightPaddle.center = new Point(100,100);
		
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
		//console.log("Adding to elements: \n"+rightPaddle.toString());
	}
	
	function update(){
		var paddle = elements["leftPaddle"],
			prinny = elements["rightPaddle"],
			speed = 2,
			collision = paddle.boundingShape.collidesWith(prinny.boundingShape);


		var dP = paddle.center;

		if (collision.status === "apart" || collision.status === "inside"){
			//var dP = new Point(paddle.center.x,paddle.center.y);
			if(paddle.keysPressed.Left){
				dP.x -= speed;
			} 
			
			if(paddle.keysPressed.Right){
				dP.x += speed;
			}
			
			if(paddle.keysPressed.Up){
				dP.y -= speed;
			} 
			
			if(paddle.keysPressed.Down){
				dP.y += speed;
			}
		} else if(collision.status === "colliding"){
			var boom = "";
			
			for(var i = 0; i < collision.collisions.length; i++){
				boom += collision.collisions[i].myLine + " ";
			}
			
			if(paddle.keysPressed.Left){
				if(boom.indexOf("LEFT") == -1){
					dP.x -= speed;
				}
			}
			
			if(paddle.keysPressed.Right){
				if(boom.indexOf("RIGHT") == -1){
					dP.x += speed;
				}
			}
			
			if(paddle.keysPressed.Up){
				if(boom.indexOf("TOP") == -1){
					dP.y -= speed;
				}
			} 
			
			if(paddle.keysPressed.Down){
				if(boom.indexOf("BOTTOM") == -1){
					dP.y += speed;
				}
			}

		}
	}
	
	function draw() {
		var liney = new Line(elements["leftPaddle"].center, elements["rightPaddle"].center);
		// repaint the canvas to clear it
		context.fillStyle = "#000000";
		context.fillRect(0,0,canvas.width, canvas.height);
		liney.draw(context);
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