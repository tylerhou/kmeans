/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Point = function () {
	  function Point(x, y) {
	    _classCallCheck(this, Point);

	    this.x = x;
	    this.y = y;
	  }

	  _createClass(Point, [{
	    key: 'distance',
	    value: function distance(second) {
	      return Math.pow(this.x - second.x, 2) + Math.pow(this.y - second.y, 2);
	    }
	  }]);

	  return Point;
	}();

	var Circle = function () {
	  function Circle(x, y) {
	    _classCallCheck(this, Circle);

	    // Point constructor
	    if (x && y) {
	      x = new Point(x, y);
	    }
	    this.point = x;
	  }

	  _createClass(Circle, [{
	    key: 'render',
	    value: function render(context) {
	      context.arc(this.point.x, this.point.y, 4, 0, 2 * Math.PI);
	    }
	  }]);

	  return Circle;
	}();

	var canvas = document.getElementById('canvas'),
	    canvasLeft = void 0,
	    canvasTop = void 0,
	    context = canvas.getContext('2d');

	var resizeCanvas = function resizeCanvas() {
	  canvasLeft = canvas.offsetLeft;
	  canvasTop = canvas.offsetTop;
	  canvas.width = window.innerWidth;
	  canvas.height = window.innerHeight;
	  canvas.style.width = window.innerWidth + 'px';
	  canvas.style.height = window.innerHeight + 'px';
	  context.scale(2, 2);
	};
	window.addEventListener('resize', resizeCanvas);

	// Code "borrowed" from https://bost.ocks.org/mike/shuffle/
	function shuffle(array) {
	  var m = array.length,
	      t,
	      i;
	  // While there remain elements to shuffle…
	  while (m) {
	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);
	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }
	  return array;
	}

	var colors = ['#0000FF', '#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#FF8080', '#808080', '#800000', '#FF8000'];
	var elements = [],
	    centroids = [];
	var max_centroids = 2;
	var render = function render() {
	  if (elements && (!centroids || centroids.length < max_centroids)) {
	    centroids = shuffle(elements).slice(0, Math.min(elements.length, max_centroids)).map(function (element) {
	      return element.point;
	    });
	  }
	  if (centroids && centroids.length > max_centroids) {
	    centroids.length = max_centroids;
	  }
	  if (max_centroids > elements.length) {
	    max_centroids = elements.length === 0 ? 1 : elements.length;
	  }

	  var _kmeans = kmeans(centroids, elements);

	  var new_centroids = _kmeans.new_centroids;
	  var groups = _kmeans.groups;

	  centroids = new_centroids;
	  context.clearRect(0, 0, canvas.width, canvas.height);
	  for (var i = 0; i < groups.length; i++) {
	    context.strokeStyle = colors[i];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = groups[i][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var element = _step.value;

	        context.beginPath();
	        element.render(context);
	        context.moveTo(element.point.x, element.point.y);
	        context.lineTo(centroids[i].x, centroids[i].y);
	        context.stroke();
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }

	    if (centroids[i]) {
	      context.fillStyle = colors[i];
	      context.beginPath();
	      var centroid_circle = new Circle(centroids[i]);
	      centroid_circle.render(context);
	      context.fill();
	    }
	  }
	};

	var kmeans = function kmeans(centroids, elements) {
	  if (!centroids) {
	    return [[], elements];
	  }

	  var groups = [];
	  for (var c in centroids) {
	    groups.push([]);
	  }

	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;

	  try {
	    var _loop = function _loop() {
	      var element = _step2.value;

	      var minimum_distance = Infinity,
	          minimum_element = -1;
	      centroids.forEach(function (centroid, i) {
	        if (centroid.distance(element.point) < minimum_distance) {
	          minimum_element = i;
	          minimum_distance = centroid.distance(element.point);
	        }
	      });
	      groups[minimum_element].push(element);
	    };

	    for (var _iterator2 = elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      _loop();
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }

	  var new_centroids = centroids.map(function (c, i) {
	    var sum = groups[i].reduce(function (a, b) {
	      return new Point(a.x + b.point.x, a.y + b.point.y);
	    }, new Point(0, 0));
	    var centroid = new Point(sum.x / groups[i].length, sum.y / groups[i].length);
	    return centroid;
	  });
	  return { new_centroids: new_centroids, groups: groups };
	};

	// Add event listener for `click` events.
	canvas.addEventListener('click', function (event) {
	  var x = event.pageX / 2 - canvasLeft,
	      y = event.pageY / 2 - canvasTop;
	  var p = new Point(x, y);

	  if (!event.shiftKey) {
	    elements.push(new Circle(p));
	  } else {
	    elements = elements.filter(function (element) {
	      return element.point.distance(p) > Math.pow(4, 2);
	    });
	  }
	}, false);

	window.addEventListener('keypress', function (event) {
	  if (event.keyCode === 45 && max_centroids > 1) {
	    --max_centroids;
	  }
	  if (event.keyCode === 61 && max_centroids < colors.length) {
	    ++max_centroids;
	  }
	  if (event.keyCode === 32) {
	    event.preventDefault();
	    var spawn_number = event.shiftKey ? 25 : 5;
	    for (var i = 0; i < spawn_number; ++i) {
	      elements.push(new Circle(Math.random() * canvas.width / 2, Math.random() * canvas.height / 2));
	    }
	  }
	});

	window.setInterval(render, 0);
	resizeCanvas();

/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }
/******/ ]);