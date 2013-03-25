function BoundingRectangle (height, width, centerPoint) {
	this.center = centerPoint;
	this.height = height;
	this.width = width;
	//Define just a basic rectangle, evently spaced about the center point
	
	var x,
		y;
	
	//console.log("Making bounding rectangle with center "+centerPoint.toString());
	// Lower left corner
	x = centerPoint.x - 0.5*width;
	y = centerPoint.y - 0.5*height;
	var lowerLeft = new Point(x,y);
	//console.log("lower left = "+lowerLeft.toString());
	// Lower right corner
	x += width;
	var lowerRight = new Point(x,y);
	//console.log("lower right = "+lowerRight.toString());
	// Upper right corner
	y += height;
	var upperRight = new Point(x,y);
	//console.log("upper right = "+upperRight.toString());
	// Upper left corner
	x -= width;
	var upperLeft = new Point(x,y);
	//console.log("upper left = "+upperLeft.toString());
	
	this.addLine(new Line(upperRight, upperLeft, BoundingRectangle.TOP));
	this.addLine(new Line(upperRight, lowerRight, BoundingRectangle.RIGHT));
	this.addLine(new Line(lowerRight, lowerLeft, BoundingRectangle.BOTTOM));
	this.addLine(new Line(upperLeft, lowerLeft, BoundingRectangle.LEFT));
};
BoundingRectangle.prototype = new BoundingShape();

BoundingRectangle.prototype.draw = function (context, color) {
	if(!Boolean(context)){
		throw "BoundingRectangle.draw requires a context to be passed in";
	}
	
	if(!Boolean(color)){
		// default to white
		color = "#FFFFFF";
	}
	
	var lines = this.lines;
	context.save();
	context.strokeStyle = color;
	context.beginPath();
	for(i in lines){
		var line = lines[i];
		context.moveTo(line.startPoint.x, line.startPoint.y);
		context.lineTo(line.endPoint.x, line.endPoint.y);
	}
	context.closePath();
	context.stroke();
	context.restore();
}

BoundingRectangle.prototype.toString = function () {
	var string = "";
	for( i in this.lines){
		string += this.lines[i].toString() + "\n";
	}
	
	return string;
}

Object.defineProperty(BoundingRectangle.prototype, "width", {
	get: function () { return this._width; },
	set: function (width) { this._width = width; }
});

Object.defineProperty(BoundingRectangle.prototype, "height", {
	get: function () { return this._height; },
	set: function (height) { this._height = height; }
});

BoundingRectangle.TOP = "TOP";
BoundingRectangle.BOTTOM = "BOTTOM";
BoundingRectangle.LEFT = "LEFT";
BoundingRectangle.RIGHT = "RIGHT";