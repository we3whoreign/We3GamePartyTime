function Line (point1, point2,name)	{
	this.startPoint = point1;
	this.endPoint = point2;
	this.name = name;
}

Line.prototype.intersects = function (line2) {
	// can probably optimize later, but here's the base idea
	// source: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
	// shameless copying of variable names to follow
	var E = new Point(this.startPoint.x - this.endPoint.x, this.startPoint.y - this.endPoint.y),
		F = new Point(line2.startPoint.x - line2.endPoint.x, line2.startPoint.y - line2.endPoint.y),
		P = new Line(-1*E.y, E.x);
		
	if ( P === 0 ){
		return this.containsAssumingParallel(line2.startPoint) || this.containsAssumingParallel(line2.endPoint);
	} else {
		var h = this.endPoint.minus(line2.endPoint).dotProduct(P)/(F.dotProduct(P));
		if( h >= 0 && h <= 1 ){
			return true;
		} else {
			return false;
		}
	}
}

Line.prototype.containsAssumingParallel = function (point) {
	var sp = this.startPoint,
		ep = this.endPoint,
		containsx = false,
		containsy = false;
		
	if (sp.x < ep.x) {
		containsx = point.x >= sp.x && point.x <= ep.x;
	} else {
		containsx = point.x >= ep.x && point.x <= sp.x;
	}
	
	if (sp.y < ep.y) {
		containsy = point.y >= sp.y && point.y <= ep.y;
	} else {
		containsy = point.y >= ep.y && point.y <= sp.y;
	}
	
	return containsx && containsy;
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