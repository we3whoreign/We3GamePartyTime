function Line (point1, point2,name)	{
	this.startPoint = point1;
	this.endPoint = point2;
	this.name = name;
}

/* Line.prototype.intersectsDetailed = function (line2) {
	if (line2.slope === this.slope){
		if (this.contains(line2.startPoint) || this.contains(line2.endPoint)){
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

Line.prototype._basicIntersect = function (line) {
    if (line.slope === this.slope){
		if (this.contains(line.startPoint) || this.contains(line.endPoint)){
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
	// and our own start and end points.
	var det1 = this.determinant(line.startPoint),
		det2 = this.determinant(line.endPoint),
		det3 = line.determinant(this.startPoint),
		det4 = line.determinant(this.endPoint);
	
	if((det1 * det2 < 0) && (det3*det4 < 0)){
		this.status = { status: "intersect" };
		return true;
	} else {
		// check if the line contains any of the endpoints
		if( this.contains(line.startPoint) || this.contains(line.endPoint) || line.contains(this.startPoint) || line.contains(this.endPoint)){
			this.status = { status: "intersect" };
			return true;
		}
		this.status = { status: "not intersecting"};
		return false;
	}

};

Line.prototype._pointIntersect = function (line) {
    var a1 = this.startPoint,
           a2 = this.endPoint,
           b1 = line.startPoint,
           b2 = line.endPoint;
           
    var denom = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * ( a2.y - a1.y);
    
    if (denom == 0) {
        this.status = { status: "not intersecting" };
        return false;
    }
    
    // uA represents what ratio of the line the point is on.
    // The point can be found by startPoint + uA*(endPoint - startPoint)
    var uA = ((b2.x - b1.x) * ( a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x))/denom;
    var uB = ((a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y)*(a1.x - b1.x))/denom;
    
    this.status = { status: "intersect",
                            point: a1.add(a1.minus(a2).multiplyScalar(uA)) };
                            
    line.status = { status: "intersect",
                            point: b1.add(b1.minus(b2).multiplyScalar(uB)) };
                            
    return true;
};

Line.prototype.intersects = function (line){
    if (window.Settings.pointCollision) {
        return this._pointIntersect(line);
    } else {
        return this._basicIntersect(line);
    }
};

Line.prototype.equals = function (line){
	return ((this.startPoint.equals(line.startPoint)) && (this.endPoint.equals(line.endPoint))) 
		|| ((this.startPoint.equals(line.endPoint)) && (this.endPoint.equals(line.startPoint)));
}

Line.prototype.contains = function (point) {
	// max amount of work: 12 subtractions, 3 divisions, 6 square roots, 6 multiplications
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
	
	// uses 4 multiplications, 4 subtractions, and 1 addition
	return sp.x * (ep.y - point.y) - sp.y * (ep.x - point.x) + 1 * (ep.x*point.y - point.x * ep.y);
}

Line.prototype.toString = function () {
	return this.name + ": (" +this.startPoint.x + ", " + this.startPoint.y + ") > (" + this.endPoint.x + ", "+ this.endPoint.y + ")";
}

Line.prototype.move = function (dx, dy){
	this.startPoint.moveBy(dx,dy);
	this.endPoint.moveBy(dx,dy);
}

Line.prototype.draw = function(context, color){
	 if(!Boolean(context)){
		throw "Line.draw requires a context to be passed in";
	 }
	 
	 if(!Boolean(color)){
		// default to white
		color = "#FFFFFF";
	 }
	 
	 context.save();
	 context.strokeStyle = color;
	 context.beginPath();
	 
	 context.moveTo(this.startPoint.x, this.startPoint.y);
	 context.lineTo(this.endPoint.x, this.endPoint.y);
	 
	 context.closePath();
	 context.stroke();
	 context.restore();

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