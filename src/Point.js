function Point (x,y){
	this.x = x;
	this.y = y;
}

Point.prototype.minus (point2) {
	return new Point(this.x - point2.x, this.y - point2.y);
}

Point.prototype.add (point2) {
	return new Point(this.x + point2.x, this.y + point2.y);
}

Point.prototype.dotProduct (point2) {
	return this.x*point2.x + this.y*point2.y;
}
