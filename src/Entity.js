var Entity = function (shape) {
	//boundingShape is the prototype of some polygon
	this.shape = shape;
	
	// Declare private member variables before use
	this._boundingShape = null;
	this._center = null;
	this._collidables = null;
};

Entity.prototype.octogonalDirections = {
	NORTH: 0,
	SOUTH: 0,
	EAST: 0,
	WEST: 0,
	NE: 0,
	SE: 0,
	SW: 0,
	NW: 0
};

Entity.prototype._createBoundingShape = function () {
	// Override 
};

Entity.prototype.toString = function () {
	if(this._boundingShape) {
		return this._boundingShape.toString();
	} else {
		return "";
	}
};

// Would be nice to have collidable groups
Entity.prototype.collidables = [];

Object.defineProperty(Entity.prototype, "boundingShape", {
	get: function() { 
		if (! Boolean(this._boundingShape)){
			this._boundingShape = this._createBoundingShape();
		}
		
		return this._boundingShape;
	},
	set: function(boundingShape) {
		this._boundingShape = boundingShape;
	}
});

Object.defineProperty(Entity.prototype, "center", {
	get: function() {
		if(Boolean(this._boundingShape)){
			return this._boundingShape.center;
		} else {
			return this._center;
		}
	},
	set: function(center) {
		if (Boolean(this._boundingShape)){
			this._boundingShape.center.moveTo(center);
		} else {
			this._center = center;
		}
	}
});

Entity.prototype.visible = false;
Entity.prototype.shape = null;