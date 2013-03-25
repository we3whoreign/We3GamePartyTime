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
			this._center.addListener(this.moveCenter);
		}
	},
	enumerable: true
});

Object.defineProperty(BoundingShape.prototype, "lines", {
	get: function() {
		if(!Boolean(this._lines)){
			this._lines = [];
		}
		return this._lines;
	},
	set: function(lines){
		this._lines = lines;
	}
});

BoundingShape.prototype.collidesWith = function (boundingShape2){
	var george = this.lines,
		cody = boundingShape2.lines;
	
	//console.log("Comparing this shape: \n"+this.toString() + " and the passed in shape \n"+boundingShape2.toString());
	// Check if the bounding lines collide,
	// and return which lines collide if so
	for( var i = 0; i < george.length; i++){
		for ( var j = 0; j < cody.length; j++){
			//console.log("Comparing our "+george[i].toString() +" and their "+cody[j].toString());
			if(george[i].intersects(cody[j])){
				//console.log(george[i].toString() + " : " + cody[j].toString());
				return { 
					myLine: george[i], 
					otherLine: cody[j],
					status: "colliding"
				};
			}
		}
	}
	
	// Check 
	var romance = new Line(this.center, boundingShape2.center);
	
	var isInside = true;
	for( var i = 0; i < george.length; i++) {
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

BoundingShape.prototype.addLine = function (line){
	this.lines.push(line);
}

BoundingShape.prototype.draw = function () { };

BoundingShape.prototype.toString = function () {
	return "The toString function needs to be overriden for this object";
}

BoundingShape.prototype.moveCenter = function (dx, dy){
	console.log(this.lines);
	console.log("CENTER MOVED " + dx + " : " + dy);
	console.log(this._lines);
	console.log(this._center);
	for(i in this.lines){
		this.lines[i].move(center.x - this.center.x, center.y - this.center.y);
	}
}