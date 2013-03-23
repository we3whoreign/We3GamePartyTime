// Bounding Shape

// a bounding shape is defined by the outer lines of a polygon (unless it's a circle)
// TODO: circles
function BoundingShape () { 
	// define nothing here?
}

BoundingShape.prototype.collidesWith = function (boundingShape2){
	var george = this.getLines(),
		cody = boundingShape2.getLines();
	
	// Check if the bounding lines collide,
	// and return which lines collide if so
	for( var i = 0; i < george.length; i++){
		for ( var j = 0; j < cody.length; j++){
			if(george[i].intersects(cody[j])){
				return { 
					myLine: george[i], 
					otherLine: cody[j],
					status: "colliding"
				};
			}
		}
	}
	
	// Check 
	var romance = new Line(this.getCenter(), boundingShape2.getCenter());
	
	var isInside = true;
	for( var i = 0; i < george.length; i++) {
		if(romance.intersects(george[i])){
			isInside = false;
			break;
		}
	}
	
	if ( isInside ){
		return { status: "inside" };
	}
	
	return { status: "apart"};
};

BoundingShape.prototype.getLines = function () {
	return this._lines;
}

BoundingShape.prototype.addLine = function (line){
	this._lines.push(line);
}
