var Entity = function (shape) {
	//boundingShape is the prototype of some polygon
	this.shape = shape;
};

Entity.prototype.center = {
	x: 0,
	y: 0
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


Entity.prototype.getBoundingShape = function () {
	if(!this._boundingShape){
		this._boundingShape = this._createBoundingShape();
	}
	
	return this.boundingShape;
};

Entity.prototype._createBoundingShape = function () {
	// Override 
};

alert("Test");

Entity.prototype._boundingShape = null;
Entity.prototype.visible = false;