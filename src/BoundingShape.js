// Bounding Shape

// a bounding shape is defined by the outer lines of a polygon (unless it's a circle)
// TODO: circles
function BoundingShape (x,y) { 
	
}

Object.defineProperty(BoundingShape.prototype, "center", {
	get: function () {
		//Default all centers to (0,0)
		if(! Boolean(this._center) ){
			this._center = new Point(0,0);
		}
		
		return this._center;
	},
	set: function (center) {
		if(Boolean(this._center)){
			console.log("moving center by "+center.toString())
			this._center.moveTo(center);
		} else {
			this._center = center;
			// Have to bind to this in order to make sure that the function
			// has all of the properties of the bounding shape. 
			// Basically, without the binding, in the function call
			// of this.lines would return undefined because the "this"
			// refers to the function, not the BoundingShape object that 
			// has this center.
			this._center.addListener(this.moveCenter.bind(this));
		}
	},
	enumerable: true
});

Object.defineProperty(BoundingShape.prototype, "lines", {
	get: function() {
		if(!Boolean(this._lines)){
			this._lines = {};
		}
		return this._lines;
	},
	set: function(lines){
		this._lines = lines;
	}
});

BoundingShape.prototype.collidesWith = function (boundingShape2){
	var george = this.lines,
		cody = boundingShape2.lines,
		god = [];
	
	//console.log("Comparing this shape: \n"+this.toString() + " and the passed in shape \n"+boundingShape2.toString());
	// Check if the bounding lines collide,
	// and return which lines collide if so
	for( i in george){
		for ( j in cody){
			//console.log("Comparing our "+george[i].toString() +" and their "+cody[j].toString());
			if(george[i].intersects(cody[j])){
				//console.log(george[i].toString() + " : " + cody[j].toString());
				god.push({ 
					myLine: george[i].name, 
					otherLine: cody[j].name,
				});
			}
		}
	}
	
	if(god.length > 0){
		return {
		status: "colliding",
		collisions: god
		};
	}
	
	// Check 
	var romance = new Line(this.center, boundingShape2.center);
	
	var isInside = true;
	for( i in george) {
		//console.log("Comparing our "+ george[i].toString() + " and " + romance.toString());
		if(romance.intersects(george[i])){
			isInside = false;
			break;
		}
		//console.log(romance.status.status);
	}
	
	if ( isInside ){
		return { status: "inside" };
	}
	
	return { status: "apart"};
};

BoundingShape.prototype.preemptiveCollidesWith = function (boundingShapes, delta){
	//Create clone of shape which accounts for shapes next movement
	var george = this.newClone(new Point(this.center.x+delta.x, this.center.y+delta.y)),
	status = false;
	
	//Loop through given list
	boundingShapes.forEach(function (cody) {
		//Check if it collides with cody's hot body
		if(george.collidesWith(cody).status === "colliding"){
			//If it does, return true
			status = true;
		}
	});

	//No collisions, return false
	return status;
};

BoundingShape.prototype.addLine = function (line){
	this.lines[line.name] = line;
}

BoundingShape.prototype.draw = function () { };

BoundingShape.prototype.toString = function () {
	return "The toString function needs to be overriden for this object";
}

BoundingShape.prototype.moveCenter = function (dx, dy){
	for(i in this.lines){
		this.lines[i].move(dx, dy);
	}
}