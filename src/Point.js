function Point (x,y){
	this._x = x;
	this._y = y;
}

Object.defineProperty(Point.prototype, "x", {
	get: function () { return this._x },
	set: function (x) {
		this.notifyListeners(x-this._x , 0);
		this._x = x;
	}
});

Object.defineProperty(Point.prototype, "y", {
	get: function() { return this._y },
	set: function (y) {
		this.notifyListeners(0, y - this._y);
	}
});

Object.defineProperty(Point.prototype, "listeners", {
	enumerable: true,
	get: function() { 
		if (! Boolean(this._listeners)){
			this._listeners = [];
		}
		
		return this._listeners;
	},
	set: function(listeners) {
		this._listeners = listeners;
	}
});

Point.prototype.notifyListeners = function (dx, dy){
	if( dx === 0 && dy === 0 ){
		return;
	}
	
	for( i in this.listeners ){
		this.listeners[i](dx,dy);
	}
}

Point.prototype.addListener = function (func) {
	// Takes in a function to be called when this point changes positions.
	// will notify with dx,dy arguments passed to the function
	this.listeners.push(func);
}

Point.prototype.moveTo = function (point) {
	if(this.equals(point)){
		return;
	}
	
	// use the private accessor in order to not trigger the listeners twice
	console.log("Move " + this.toString()+ " to " + point.toString());
	this.notifyListeners(point.x - this.x, point.y - this.y);
	this._x = point.x;
	this._y = point.y;
}

Point.prototype.moveBy = function (dx, dy) {
	this.notifyListeners(dx, dy);
	this._x += dx;
	this._y += dy;
}
Point.prototype.minus = function (point2) {
	return new Point(this.x - point2.x, this.y - point2.y);
}

Point.prototype.add = function (point2) {
	return new Point(this.x + point2.x, this.y + point2.y);
}

Point.prototype.dotProduct = function(point2) {
	return this.x*point2.x + this.y*point2.y;
}

Point.prototype.equals = function(point){
	return this.x === point.x && this.y === point.y;
}

Point.prototype.toString = function () {
	return "("+this.x+", "+this.y+")";
}
