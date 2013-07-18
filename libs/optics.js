﻿
// a point is a unspecified data of a data-set
function Point() {
	this.processed = false;
	this.reachabilityDistance = undefined;
	this.attribute = null;
	this.id = null;
	this.color = null
}

// priority queue that stores points according to their attribute-values, first element is the most important element that must be handled next
function Queue() {}

(function () {

	var _queue = [];
	var insertAt = function (ele, index) {

		if (_queue.length === index) {
			_queue.push(ele);
			return;
		} else {
			var currentElement = _queue[index];

			if (_queue[index] === undefined)
				return false;

			_queue[index] = ele;

			var length = _queue.length + 1;
			for (var pos = index + 1; pos < length; pos++) {
				var lastElement = _queue[pos];
				_queue[pos] = currentElement;
				currentElement = lastElement;
			}
		}

	};

	Queue.prototype.remove = function (ele) {

		var length = _queue.length;

		for (var index = 0; index < length; index++) {

			var otherEle = _queue[index];

			if (ele.id === otherEle.id) {

				var firstQueuePart = _queue.slice(0, index);
				var secondQueuePart = _queue.slice(index + 1, _queue.length);

				_queue = firstQueuePart.concat(secondQueuePart);
				break;
			}
		}

		return this;
	};

	Queue.prototype.insert = function (ele) {
		var indexToInsert = _queue.length;
		for (var index = _queue.length - 1; index >= 0; index--) {

			if (ele.reachabilityDistance < _queue[index].reachabilityDistance) {
				indexToInsert = index;
			}

		}

		insertAt(ele, indexToInsert);
	};

	Queue.prototype.forEach = function (func) {
		_queue.forEach(func);
	};

	Queue.prototype.getElements = function () {
		return _queue;
	};

})();

// the optics clustering algo that combines the most important methods for processing data into clusters
// dataset should lok like this: [ { id: 'identifier', a: Number, b: Number ... OR  x: Number, y: Number ... }, {...} ]
function OPTICS(dataset) { this.dataset = dataset; }

(function () {

	var unsortedList = null;
	var sortedList = null;
	var priorityQueue = null;
	var coreDistance = 0;

	var that = null;
	var tmpColor = null;

	// public methods

	OPTICS.prototype.start = function (epsilon, minPts) { // actual OPTICS - clustering - Algo

		unsortedList = [];

		init.call(this, this.dataset);

		sortedList = [];

		unsortedList.forEach(function (point, index) {

			if (!point.processed) {

				var neighbors = getNeighbors(point, epsilon);
				point.processed = true;

				var cluster_color = getRandomColor();
				point.color = cluster_color;

				sortedList.push(point);

				priorityQueue = new Queue();

				if (calculateCoreDistance(point, epsilon, minPts) !== undefined) {

					updateQueue(neighbors, point, priorityQueue, epsilon, minPts);

					var call = function () {

						for (var p = 0; p < priorityQueue.getElements().length; p++) {

							var queued_point = priorityQueue.getElements()[p];

							if (!queued_point.processed) {

								var neighbors = getNeighbors(queued_point, epsilon);
								queued_point.processed = true;
								queued_point.color = cluster_color;

								sortedList.push(queued_point);

								if (calculateCoreDistance(queued_point, epsilon, minPts) !== undefined) {
									updateQueue(neighbors, queued_point, priorityQueue, epsilon, minPts);
									call();
								}

							}
						}

					};
					call();

				}

			}

		});

		return sortedList;

	};

	// dataset should be autput of start-methode
	OPTICS.prototype.drawBarChartPlot = function (dataset, epsilon, minPts, width, height) {

		var output = document.createElement('canvas');

		output.height = height;
		output.width = width;

		var ctx = output.getContext('2d');

		ctx.fillStyle = '#C3C3C3';
		//ctx.fillRect ( 0 , 0 , output.width, output.height );
		ctx.fill();

		ctx.beginPath();
		ctx.fillStyle = '#0000ff';
		ctx.strokeStyle = '#ffff00';

		ctx.font = '15pt Arial';
		ctx.lineWidth = 8;

		ctx.save();
		ctx.translate(90, 20);
		ctx.rotate((Math.PI / 180) * 90);
		ctx.fillText(('Epsilon: ' + epsilon), 10, 25);
		ctx.fillText(('MinPts: ' + minPts), 10, 50);
		ctx.restore();

		ctx.font = '6pt Arial';

		var xStartPoint = 120,
		yStartPoint = Number(output.height) - 80;

		dataset.forEach(function (point, index) {

			ctx.beginPath();
			ctx.moveTo(xStartPoint, yStartPoint);
			ctx.strokeStyle = point.color;

			if (point.reachabilityDistance)
				ctx.lineTo(xStartPoint, (yStartPoint - (point.reachabilityDistance * (output.height / 100))));
			else
				ctx.lineTo(xStartPoint, 0);

			ctx.save();
			ctx.translate(xStartPoint, (Number(output.height) - 5));
			ctx.rotate((Math.PI / 180) * -90);
			ctx.fillText(point.id.toString(), 0, 3);
			ctx.restore();

			ctx.stroke();
			ctx.closePath();

			xStartPoint += 10;

		});

		ctx.fill();
		ctx.stroke();
		ctx.closePath();

		drawAxes(ctx, 115, yStartPoint, Number(output.width), Number(output.height), this.dataset.length, 100);

		var visual = convertToImg(output);

		return visual;
	};

	// dataset should be autput of start-methode
	OPTICS.prototype.draw2DPlot = function (dataset, width, height) {

		var output = document.createElement('canvas');

		output.height = height;
		output.width = width;

		var ctx = output.getContext('2d');

		ctx.lineWidth = 8;
		ctx.font = '6pt Arial';

		var moveSteps = {};
		moveSteps.x = dataset.length > 100 ? ((width / dataset.length) / 3.5) : (width / dataset.length);
		moveSteps.y = dataset.length > 100 ? ((height / dataset.length) / 3.5) : (height / dataset.length);

		dataset.forEach(function (point, index) {

			ctx.beginPath();

			ctx.moveTo(point.x * moveSteps.x, point.y * moveSteps.y);

			ctx.strokeStyle = point.color;
			ctx.fillStyle = point.color;

			ctx.fillText(point.id.toString(), point.attribute.x * moveSteps.x, ((point.attribute.y * moveSteps.y) - 5));
			ctx.arc(point.attribute.x * moveSteps.x, point.attribute.y * moveSteps.y, 1, 0, Math.PI * 2, true);

			ctx.stroke();
			ctx.fill();

			ctx.closePath();

		});

		var visual = convertToImg(output);

		return visual;
	};

	// private methods

	OPTICS.prototype.dist = function (pointA, pointB) { // pytharoras
		return Math.sqrt((pointA.x - pointB.x) * (pointA.x - pointB.x) + (pointA.y - pointB.y) * (pointA.y - pointB.y));
	};

	var getNeighbors = function (point, epsilon) {

		var neughbors = [];
		unsortedList.forEach(function (otherPoint, index) {
			if (point !== otherPoint && that.dist(point.attribute, otherPoint.attribute) < epsilon) {
				neughbors.push(otherPoint);
			}
		});
		return neughbors;

	};

	var updateQueue = function (neighbors, point, queue, epsilon, minPts) {

		coreDistance = calculateCoreDistance(point, epsilon, minPts);

		neighbors.forEach(function (otherPoint, index) {

			if (!otherPoint.processed) {

				var new_reachable_distance = Math.max(coreDistance, that.dist(point.attribute, otherPoint.attribute));

				if (otherPoint.reachabilityDistance === undefined) {
					otherPoint.reachabilityDistance = new_reachable_distance;
					queue.insert(otherPoint);
				} else {
					if (new_reachable_distance < otherPoint.reachabilityDistance) {
						otherPoint.reachabilityDistance = new_reachable_distance;
						queue.remove({
							id : otherPoint.id
						});
						queue.insert(otherPoint);
					}
				}

			}
		});

	};

	var calculateCoreDistance = function (point, epsilon, minPts) {

		var neighbors = getNeighbors(point, epsilon);
		var minDistance = undefined;
		// core-point should have got at least minPts-Points
		if (neighbors.length >= minPts) {

			var minDistance = epsilon;

			neighbors.forEach(function (otherPoint, index) {
				if (that.dist(point.attribute, otherPoint.attribute) < minDistance) {
					minDistance = that.dist(point.attribute, otherPoint.attribute);
				}
			});

		}
		return minDistance;

	};

	var getRandomColor = function () {

		var color = '#' + Math.floor(Math.random() * 255).toString(16) + Math.floor(Math.random() * 255).toString(16) + Math.floor(Math.random() * 255).toString(16);
		if (color.length === 7 && tmpColor !== color) {

			tmpColor = color;
			return color;
		} else
			return getRandomColor();

	};

	var drawAxes = function (ctx, start_x, start_y, x_axis_width, y_axis_height, x_units, y_units) {

		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.fillStyle = '#000000';
		ctx.strokeStyle = '#000000';

		ctx.moveTo(start_x, start_y);
		ctx.lineTo(start_x + x_axis_width, start_y);

		var nextPosX = start_x;

		for (var u = 0; u < x_units; u++) {

			ctx.moveTo(nextPosX, start_y + 5);
			ctx.lineTo(nextPosX, start_y - 5);
			ctx.fillText(u.toString(), nextPosX - 3, (start_y + 10));

			nextPosX = start_x + (10 * (u + 1));
		}

		ctx.moveTo(start_x, start_y);
		ctx.lineTo(start_x, 0);

		var nextPosY = start_y;

		for (var u = 0; u < y_units; u++) {

			ctx.moveTo(start_x - 5, nextPosY);
			ctx.lineTo(start_x + 5, nextPosY);
			ctx.fillText(u.toString(), start_x - 15, nextPosY);

			nextPosY = start_y - ((y_axis_height / y_units) * (u + 1));
		}

		ctx.fill();
		ctx.stroke();
		ctx.closePath();

	};

	var convertToImg = function (canvas) {
		var img = document.createElement('img');
		img.width = canvas.width;
		img.height = canvas.height;
		img.src = canvas.toDataURL();
		return img;
	};

	var init = function (dataset) {

		that = this;

		if (dataset.constructor !== Array) {
			console.log('dataset must be of type array: ', typeof dataset, dataset);
			return;
		}

		for (var p = 0; p < dataset.length; p++) {

			var point = new Point();
			point.attribute = {
				x : dataset[p].x,
				y : dataset[p].y
			};
			point.id = dataset[p].id ? dataset[p].id : 'undefined';

			unsortedList.push(point);
		}

	};

})();
