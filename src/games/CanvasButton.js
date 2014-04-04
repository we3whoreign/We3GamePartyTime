function CanvasButton(height, width, x, y) {
	this._createBoundingShape = function() {
		return new BoundingRectangle(height, width, new Point(x,y));
	};
	
	this.center = new Point(x,y);
}

CanvasButton.prototype = new Entity();

CanvasButton.prototype._mouseEnterListeners = [];
CanvasButton.prototype._mouseLeaveListeners = [];
CanvasButton.prototype._mouseClickListeners = [];

CanvasButton.prototype._mouseInside = false;

CanvasButton.prototype.updateMouseStatus = function (x,y, click) {
	if (this.boundingShape.isPointInside(new Point(x,y))) {
		if (click) {
			this.onMouseClick();
		} else if(!this._mouseInside){
			this._mouseInside = true;
			this.onMouseEnter();
		}
	} else if (this._mouseInside) {
		this._mouseInside = false;
		this.onMouseLeave();
	}
};

CanvasButton.prototype.addEventHandler = function(type, fnc) {
	switch(type) {
		case "click":
			this._mouseClickListeners.push(fnc);
			break;
		case "enter":
			this._mouseEnterListeners.push(fnc);
			break;
		case "leave":
			this._mouseLeaveListeners.push(fnc);
			break;
	}
};

CanvasButton.prototype.onMouseEnter = function(x,y) {
	for(var i in this._mouseEnterListeners) {
		this._mouseEnterListeners[i]();
	}
};

CanvasButton.prototype.onMouseLeave = function() {
	for(var i in this._mouseLeaveListeners) {
		this._mouseLeaveListeners[i]();
	}
};

CanvasButton.prototype.onMouseClick = function() {
	for(var i in this._mouseClickListeners) {
		this._mouseClickListeners[i]();
	}
};