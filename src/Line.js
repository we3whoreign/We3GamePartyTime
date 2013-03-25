function Line (point1, point2,name)	{
	this.startPoint = point1;
	this.endPoint = point2;
	this.name = name;
}

/* Line.prototype.intersectsDetailed = function (line2) {
	if (line2.slope === this.slope){
		if (this.containsAssumingParallel(line2.startPoint) || this.containsAssumingParallel(line2.endPoint)){
			this.status = { status: "parallel intersecting" };
		} else {
			this.status = { status: "parallel" };
		}
	} 
	
	if (this.equals(line2)){
		// if the line segments have the same points, obviously they intersect
		this.status = { status: "same" };
	}
	
	var s1 = new Point(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y),
		s2 = new Point(line2.endPoint.x - line2.startPoint.x, line2.endPoint.y - line2.startPoint.y);
	
	var s = (-1 * s1.y * (this.startPoint.x - line2.startPoint.x) + s1.x * ( this.startPoint.y - line2.startPoint.y))/(-1 * s2.x * s1.y + s1.x * s2.y),
		t = (s2.x * (this.startPoint.y - line2.startPoint.y) - s2.y * (this.startPoint.x - line2.startPoint.x))/(-1 * s2.x * s1.y + s1.x * s2.y);
	
	if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
		var x = this.startPoint.x + (t * s1.x),
			y = this.startPoint.y + (t * s1.y);
		
		this.status =  { status: "collision",
				 point: new Point(x,y) };
    }

    this.status =  { status: "no collision" };
	
	return this.status;
} */

Line.prototype.intersects = function (line){
	if (line.slope === this.slope){
		if (this.containsAssumingParallel(line.startPoint) || this.containsAssumingParallel(line.endPoint)){
			this.status = { status: "parallel intersecting",
							otherLine: line};
			return true;
		} else {
			this.status = { status: "parallel" };
			return false;
		}
	} 
	
	// If not parallel, then we can find out if the two points are on opposite sides of the line using determinants
	// the idea being that this.determinant(line.startPoint) gives us a relative indication of the side to which 
	// the point is on. That means that this.determinant(line.endPoint) must be a different sign in order to indicate
	// that they are on opposite sides of the line segment. This must also be true for the line we're comparing to
	// and our own start and end poitns.
	var det1 = this.determinant(line.startPoint),
		det2 = this.determinant(line.endPoint),
		det3 = line.determinant(this.startPoint),
		det4 = line.determinant(this.endPoint);
	//console.log(det1 + " : " +det2);
	
	if((det1 * det2 < 0) && (det3*det4 < 0)){
		this.status = { status: "intersect" };
		return true;
	} else {
		this.status = { status: "not intersecting"};
		return false;
	}
}

Line.prototype.equals = function (line){
	return ((this.startPoint.equals(line.startPoint)) && (this.endPoint.equals(line.endPoint))) 
		|| ((this.startPoint.equals(line.endPoint)) && (this.endPoint.equals(line.startPoint)));
}

Line.prototype.containsAssumingParallel = function (point) {
	var l1 = new Line(this.startPoint, point),
		l2 = new Line(this.endPoint, point);
	
	// if the slope of these lines is the same and the lengths add up to our length, the point is on the line
	return (l1.slope === this.slope && l2.slope === this.slope) && (this.length === (l1.length + l2.length));
}

Line.prototype.determinant = function (point) {
	// Computs the deteminant of
	// | sp.x     sp.y     1 |
	// | ep.x     ep.y     1 |
	// | point.x  point.y  1 |
	var sp = this.startPoint,
		ep = this.endPoint;
	return sp.x * (ep.y - point.y) - sp.y * (ep.x - point.x) + 1 * (ep.x*point.y - point.x * ep.y);
}

Line.prototype.toString = function () {
	return this.name + ": (" +this.startPoint.x + ", " + this.startPoint.y + ") > (" + this.endPoint.x + ", "+ this.endPoint.y + ")";
}

Line.prototype.move = function (dx, dy){
	console("Moving "+this.name + dx + " : " + dy);
	this.startPoint.moveTo(new Point(this.startPoint.x + dx, this.startPoint.y + dy));
	this.endPoint.moveTo(new Point(this.endPoint.x + dx, this.endPoint.y + dy));
}

Object.defineProperty(Line.prototype, "length", {
	get: function () {
		if (!Boolean(this._length)) {
			this._length = Math.sqrt(Math.pow(this.startPoint.x - this.endPoint.x, 2) + Math.pow(this.startPoint.y - this.endPoint.y,2));
		}
		
		return this._length;
	},
	set: function(length) {
		this._length = length;
	}
});

Object.defineProperty(Line.prototype, "slope", {
	get: function () {
		if (!Boolean(this._slope)) {
			var y1 = this.startPoint.y,
				y2 = this.endPoint.y,
				x1 = this.startPoint.x,
				x2 = this.endPoint.x;
			if ( (x2 - x1) === 0 ){
				this._slope = "undefined";
			} else {
				this._slope = (y2-y1)/(x2-x1);
			}
		}
		
		return this._slope;
	},
	set: function (slop) {
		this._slope = slope;
	}
});

Object.defineProperty(Line.prototype, "name", {
	enumerable: true,
	get: function() {return this._name; },
	set: function(name) { this._name = name; }
});