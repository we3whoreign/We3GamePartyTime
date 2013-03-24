( function () {
	var canvas = document.getElementById("gameCanvas");
	canvas.width = 800;
	canvas.height = 600;
	var	context = canvas.getContext('2d');
	
	function BoundingRectangle (height, width, centerPoint) {
		this.center = centerPoint;
		this.height = height;
		this.width = width;
		//Define just a basic rectangle, evently spaced about the center point
		
		var x,
			y;
			
		// Lower left corner
		x = centerPoint.x - 0.5*width;
		y = centerPoint.y - 0.5*height;
		var lowerLeft = new Point(x,y);
		
		// Lower right corner
		x += width;
		var lowerRight = new Point(x,y);
		
		// Upper right corner
		y += height;
		var upperRight = new Point(x,y);
		
		// Upper left corner
		x -= width;
		var upperLeft = new Point(x,y);
		
		this.addLine(new Line(upperRight, upperLeft));
		this.addLine(new Line(upperRight, lowerRight));
		this.addLine(new Line(lowerRight, lowerLeft));
		this.addLine(new Line(upperLeft, lowerLeft));
	};
	
	BoundingRectangle.prototype.width = 0;
	BoundingRectangle.prototype.height = 0;
	
	BoundingRectangle.prototype = new BoundingShape();
	
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