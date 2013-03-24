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