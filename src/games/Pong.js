( function () {
	// Canvas setup
	var canvas = document.getElementById("gameCanvas");
	canvas.width = 800;
	canvas.height = 600;
	var	context = canvas.getContext('2d'),
		fps = 30,
		elements = [];
	
	function init() {
		var leftPaddle = new Entity(),
		rightPaddle = new Entity();
	
		leftPaddle._createBoundingShape = function () {
			return new BoundingRectangle(30 /* height */,60 /* width */, this.center);
		};
		
		rightPaddle._createBoundingShape = function () {
			return new BoundingRectangle(30 /* height */,60 /* width */, this.center);
		};
		
		leftPaddle.draw = function () {
			var bs = this.getBoundingShape();
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y + bs.height*0.5;
			context.drawImage(this.image, topLeftX, topLeftY, bs.width, bs.height);
		};
		
		rightPaddle.draw = function () {
			var bs = this.getBoundingShape();
			var topLeftX = this.center.x - bs.width*0.5,
				topLeftY = this.center.y + bs.height*0.5;
			context.drawImage(this.image, topLeftX, topLeftY, bs.width, bs.height);
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
		elements["rightPaddle"] = rightPaddle;
	}
	
	function update(){
		var paddle = elements["leftPaddle"],
			speed = 2;
		if(paddle.keysPressed.Left){
			paddle.center.x -= speed;
		} 
		
		if(paddle.keysPressed.Right){
			paddle.center.x += speed;
		}
		
		if(paddle.keysPressed.Up){
			paddle.center.y -= speed;
		} 
		
		if(paddle.keysPressed.Down){
			paddle.center.y += speed;
		}
	}
	
	function draw() {
		// repaint the canvas to clear it
		context.fillStyle = "#000000";
		context.fillRect(0,0,canvas.width, canvas.height);
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