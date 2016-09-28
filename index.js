import './styles.css';

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distance(second) {
    return Math.pow((this.x - second.x),2) + Math.pow((this.y - second.y),2);
  }
}

class Circle {
  constructor(x, y) {
    // Point constructor
    if (x && y) {
      x = new Point(x, y);
    }
    this.point = x;
  }

  render(context) {
    context.arc(this.point.x, this.point.y, 4, 0, 2*Math.PI);
  }
}

let canvas = document.getElementById('canvas'),
    canvasLeft, canvasTop,
    context = canvas.getContext('2d');

let resizeCanvas = () => {
  canvasLeft = canvas.offsetLeft;
  canvasTop = canvas.offsetTop;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  context.scale(2, 2);
}
window.addEventListener('resize', resizeCanvas);

// Code "borrowed" from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;
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


let colors = ['#0000FF', '#FF0000','#00FF00','#FFFF00','#FF00FF','#FF8080','#808080','#800000','#FF8000']
let elements = [], centroids = [];
let max_centroids = 2;
let render = () => {
  if (elements && (!centroids || centroids.length < max_centroids)) {
    centroids = shuffle(elements).slice(0, Math.min(elements.length, max_centroids)).map(
      (element) => element.point
    );
  }
  if (centroids && centroids.length > max_centroids) {
    centroids.length = max_centroids;
  }
  if (max_centroids > elements.length) {
    max_centroids = elements.length === 0 ? 1 : elements.length;
  }
  let { new_centroids, groups } = kmeans(centroids, elements);
  centroids = new_centroids;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < groups.length; i++) {
    context.strokeStyle = colors[i];
    for (let element of groups[i]) {
      context.beginPath();
      element.render(context);
      context.moveTo(element.point.x, element.point.y);
      context.lineTo(centroids[i].x, centroids[i].y);
      context.stroke();
    }
    if (centroids[i]) {
      context.fillStyle = colors[i];
      context.beginPath();
      let centroid_circle = new Circle(centroids[i]);
      centroid_circle.render(context)
      context.fill();
    }
  }
}

let kmeans = (centroids, elements) => {
  if (!centroids) {
    return [[], elements];
  }

  let groups = [];
  for (let c in centroids) {
    groups.push([]);
  }

  for (let element of elements) {
    let minimum_distance = Infinity,
        minimum_element = -1;
    centroids.forEach((centroid, i) => {
      if (centroid.distance(element.point) < minimum_distance) {
        minimum_element = i;
        minimum_distance = centroid.distance(element.point);
      }
    });
    groups[minimum_element].push(element);
  }

  let new_centroids = centroids.map((c, i) => {
    let sum = groups[i].reduce((a, b) => new Point(a.x+b.point.x, a.y+b.point.y), new Point(0, 0));
    let centroid = new Point(sum.x / groups[i].length, sum.y / groups[i].length);
    return centroid;
  });
  return { new_centroids, groups };
}

// Add event listener for `click` events.
canvas.addEventListener('click', event => {
  let x = event.pageX/2 - canvasLeft,
      y = event.pageY/2 - canvasTop;
  let p = new Point(x, y);

  if (!event.shiftKey) {
    elements.push(new Circle(p));
  }
  else {
    elements = elements.filter((element) => {
      return element.point.distance(p) > Math.pow(4, 2);
    });
  }
}, false);

window.addEventListener('keypress', event => {
  if (event.keyCode === 45 && max_centroids > 1) {
    --max_centroids;
  }
  if (event.keyCode === 61 && max_centroids < colors.length) {
    ++max_centroids;
  }
  if (event.keyCode === 32) {
    event.preventDefault();
    let spawn_number = event.shiftKey ? 25 : 5;
    for (let i = 0; i < spawn_number; ++i) {
      elements.push(new Circle(Math.random() * canvas.width/2,
                               Math.random() * canvas.height/2));
    }
  }
});

window.setInterval(render, 0);
resizeCanvas();
