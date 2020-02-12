class Draggable {
	constructor(container, target) {
		this.container = container;
		this.target = target;
		this.initializeListeners();
		this.mousedown = false;
		this.dragging = false;
		this.start = null;
		this.xPos = 0;
		this.max = (window.innerWidth - (window.innerWidth * .6)) - this.target.clientWidth;
		this.moving = false;
		this.moveFrame = null;
		this.handleScroll();
		console.log(this.max)
	}
	initializeListeners = () => {
		this.container.style.userSelect = 'none';
		this.container.addEventListener('mousedown', this.handleMouseDown);
		this.container.addEventListener('touchstart', this.handleMouseDown);
		this.container.addEventListener('mouseup', this.handleMouseUp);
		this.container.addEventListener('touchend', this.handleMouseUp);
		this.container.addEventListener('mousemove', this.handleMouseMove);
		this.container.addEventListener('touchmove', this.handleMouseMove);
		this.container.addEventListener('mouseleave', this.handleMouseLeave);
		this.container.addEventListener('mouseenter', this.handleMouseEnter);
		window.addEventListener('scroll', this.handleScroll)
	}
	handleScroll = e => {
		const inView = isElementInView(this.container);
		if (inView && !this.moving) this.startMoving()
		else if (!inView && this.moving) this.stopMoving();
	}
	startMoving = () => {
		this.moving = true;
		this.moveFrame = requestAnimationFrame(this.move);
	}
	stopMoving = () => {
		this.moving = false;
		cancelAnimationFrame(this.moveFrame);
		this.moveFrame = null;
	}
	move = () => {
    if (!this.dragging) this.dragging = true;
		if (this.atEnd) this.stopMoving()
		else {
			this.handlePosition(-.5);
			this.moveFrame = requestAnimationFrame(this.move);
		}
	}
	handleMouseMove = e => {
		if (this.mousedown) {
			const clientX = e.touches ? e.touches[0].clientX : e.clientX;
			const distance = clientX - this.start;
			this.handlePosition(distance);
			this.start = clientX;
		}
	}
	handleMouseDown = e => {
		this.mousedown = true;
		this.start = e.touches ? e.touches[0].clientX : e.clientX;
		if (this.moving) this.stopMoving();
	}
	handleMouseUp = e => {
		this.mousedown = false;
		this.start = null;
    this.dragging = false;
	}
  handleMouseEnter = e => this.moving ? this.stopMoving() : null;
  handleMouseLeave = e => {
    if (!this.moving) this.startMoving();
    this.mousedown = false;
    this.dragging = false;
  }
	handlePosition = distance => {
		let update = this.xPos + distance;
		// at start check
		if (distance >= 0 && this.xPos >= 0) update = 0;
		// at end check
		if (distance < 0 && this.xPos <= this.max) update = this.max;
		if (update !== this.xPos) this.handleRender(update);
	}
	handleRender = (update) => {
		this.xPos = update;
		requestAnimationFrame(() => {
			this.target.style.transform = 'translate(' + this.xPos + 'px, -50%)';
		})
	}
}
