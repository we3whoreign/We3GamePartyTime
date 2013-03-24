( function () {
	var canvas = document.getElementById("gameCanvas");
	canvas.width = 800;
	canvas.height = 600;
	var	context = canvas.getContext('2d');
	
	var leftPaddle = new Entity(),
		rightPaddle = new Entity();
	
	leftPaddle._createBoundingShape = function () {
		return new BoundingRectangle(20 /* height */,10 /* width */, this.center);
	};
	
	rightPaddle._createBoundingShape = function () {
		return new BoundingRectangle(20 /* height */,10 /* width */, this.center);
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
	
	leftPaddle.draw();
	rightPaddle.draw();

})();