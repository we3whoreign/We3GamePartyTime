var Entity = function (shape) {
	//boundingShape is the prototype of some polygon
	this.shape = shape;
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
	return this.boundingShape.toString();
};

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
			return this.boundingShape.center;
		} else {
			return this._center;
		}
	},
	set: function(center) {
		if (Boolean(this._boundingShape)){
			this.boundingShape.center.moveTo(center);
		} else {
			this._center = center;
		}
	}
});

Entity.prototype.visible = false;