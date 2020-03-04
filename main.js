class Draggable {
	constructor(container, target) {
		this.container = container;
		this.target = target;
		this.mousedown = false;
		this.dragging = false;
		this.start = null;
		this.xPos = 0;
		this.max = (window.innerWidth - (window.innerWidth * .6)) - this.target.clientWidth;
		this.moving = false;
		this.moveFrame = null;
		this.container.style.userSelect = 'none';
		window.addEventListener('scroll', this.handleScroll.bind(this), {passive: true});
    ['handleScroll', 'startMoving', 'stopMoving', 'move']
    .forEach(fName =>  this[fName].bind(this) );
		this.container.addEventListener('mousedown', this.handleMouseDown.bind(this), {passive: true});
		this.container.addEventListener('touchstart', this.handleMouseDown.bind(this), {passive: true});
		this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
		this.container.addEventListener('touchend', this.handleMouseUp.bind(this));
		this.container.addEventListener('mousemove', this.handleMouseMove.bind(this), {passive: true});
		this.container.addEventListener('touchmove', this.handleMouseMove.bind(this), {passive: true});
		this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
		this.container.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
		this.handleScroll();
	}
	handleScroll(e) {
		const inView = isElementInView(this.container);
		if (inView && !this.moving) this.startMoving()
		else if (!inView && this.moving) this.stopMoving();
	}
	startMoving() {
		this.moving = true;
		this.moveFrame = requestAnimationFrame(() => this.move(this));
	}
	stopMoving() {
		this.moving = false;
		cancelAnimationFrame(this.moveFrame);
		this.moveFrame = null;
	}
	move(thisRef) {
    if (!thisRef.dragging) { thisRef.dragging = true; }
		if (thisRef.atEnd) { thisRef.stopMoving() }
		else {
			thisRef.handlePosition(-.5);
			thisRef.moveFrame = requestAnimationFrame(() => thisRef.move(thisRef));
		}
	}
	handleMouseMove(e) {
		if (this.mousedown) {
			const clientX = e.touches ? e.touches[0].clientX : e.clientX;
			const distance = clientX - this.start;
			this.handlePosition(distance);
			this.start = clientX;
		}
	}
	handleMouseDown(e) {
		this.mousedown = true;
		this.start = e.touches ? e.touches[0].clientX : e.clientX;
		if (this.moving) this.stopMoving();
	}
	handleMouseUp(e) {
		this.mousedown = false;
		this.start = null;
    this.dragging = false;
	}
  handleMouseEnter(e) {
		if (this.moving) this.stopMoving();
	}
  handleMouseLeave(e) {
    if (!this.moving) this.startMoving();
    this.mousedown = false;
    this.dragging = false;
  }
	handlePosition(distance) {
		let update = this.xPos + distance;
		// at start check
		if (distance >= 0 && this.xPos >= 0) update = 0;
		// at end check
		if (distance < 0 && this.xPos <= this.max) update = this.max;
		if (update !== this.xPos) this.handleRender(update);
	}
	handleRender(update) {
		this.xPos = update;
		requestAnimationFrame(() => {
			this.target.style.transform = 'translate(' + this.xPos + 'px, -50%)';
		})
	}
}
