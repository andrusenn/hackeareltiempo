/*

Hackear el tiempo / Hack the time

¿Si con un solo boton pudiéramos recorrer el tiempo de otra manera?

Cada generación está atada al tiempo (timestamp),
y es siempre la misma dado el mismo tiempo.
Las primeras 12 hs del día, determinan el tono del fondo: blanco o negro.
Cada hora hay una generación nueva.

o puedes presionar "h" para desvincular la generación del tiempo.


Keys:
[h] -> controls generations tied ti time.

Andrés Senn 07/2022

#1of1 tezos

*/
let ps = [];
let cv;
let seed;
let counter = 0;
let cutIndex = 0;
let hack = false;
let rest = 1000 * 60 * 60;
let ROT = 0;
function setup() {
	cv = createCanvas(2160, 2160);
	cv.parent("cv");
	pixelDensity(1);
	init();

	document.title = `Hackear el tiempo | Andr\u00e9s Senn | 2022`;
	console.log(
		`%cHackear el tiempo / #1of1 tezos / 07-2022 \u007e / Andr\u00e9s Senn`,
		"background: #000; color: #ccc;padding:5px;font-size:15px",
	);
}
function draw() {
	noSmooth();
	push();
	translate(width / 2, height / 2);
	rotate(ROT);
	translate(-width / 2, -height / 2);
	if (counter > 1000) {
		let to = setTimeout(() => {
			init();
			clearTimeout(to);
		}, rest);
		noLoop();
	}
	for (let i = 0; i < ps.length; i++) {
		//Conex
		if (counter % 5 == 0) {
			for (let j = 0; j < ps.length; j++) {
				if (ps[i] != ps[j]) {
					let d = dist(
						ps[i].pos.x,
						ps[i].pos.y,
						ps[j].pos.x,
						ps[j].pos.y,
					);
					if ((d > 60) & (d < 64)) {
						stroke(random(255), 200);
						strokeWeight(1);
						line(
							ps[i].pos.x,
							ps[i].pos.y,
							ps[j].pos.x,
							ps[j].pos.y,
						);
					}
				}
			}
		}
		noStroke();
		ps[i].update();
		fill(0, 10);
		let ds = map(sin(counter * 0.03), -1, 1, 1, 4);
		circle(ps[i].pos.x + 5, ps[i].pos.y + 5, ds + 2);

		fill(map(sin(counter * 0.01), -1, 1, 0, 255), 200);
		if (i > ps.length - 20) {
			fill(random(255), random(255), random(255), 200);
		}
		circle(ps[i].pos.x, ps[i].pos.y, ds);
		if (
			(i === cutIndex || i === cutIndex + 2 || i === cutIndex + 3) &&
			counter % 5 == 0
		) {
			cut(ps[i].pos.x, ps[i].pos.y);
			// WNoises & RColors
			noisemix(ps[i].pos.x, ps[i].pos.y, random(5, 40), random(5, 40));
			noisecolor(ps[i].pos.x, ps[i].pos.y, random(5, 20), random(5, 100));
		}
	}
	pop();
	if (counter % 100 === 0) {
		cutIndex = int(random(10));
	}
	counter++;
}
function init() {
	clear();
	// IE8
	if (!Date.now) {
		Date.now = function () {
			return new Date().getTime();
		};
	}
	let d = new Date();
	let hour = d.getHours();
	let hackthefuture = int(Date.now() / 1000 / 60 / 60 / 24);
	rest = 1000 * 60 * 60;
	//if (hack) {
		hour = int(random(24));
		hackthefuture = int(random(100000000000));
		rest = 10000;
	//}

	seed = hackthefuture;
	noiseSeed(seed);
	randomSeed(seed);
	
	// Rotation content
	ROT = (int(random(8)) * PI) / 4;

	// Background
	let body = document.querySelector("body");
	if (hour <= 12) {
		background(255);
		body.style.backgroundColor = "#ffffff";
	} else {
		background(0);
		body.style.backgroundColor = "#000000";
	}

	// Particles
	ps = [];
	let ap = random(15, 18);
	let ns = random(0.001, 0.005);
	for (let i = 0; i < 500; i++) {
		let diam1 = random(200, 600);
		let diam2 = random(200, 600);
		let a = random(TWO_PI);
		let x = width / 2 + cos(a) * diam1;
		let y = height / 2 + sin(a) * diam2;
		let p = new P(x, y, random(1, 5), ap, ns);
		ps.push(p);
	}

	counter = 0;
	loop();
}
function noisemix(_x, _y, _w, _h) {
	push();
	let s = random(2, 5);
	let c = random(0, 255);
	let w = _w;
	let h = _h;
	for (let x = _x; x < _x + w; x += s) {
		for (let y = _y; y < _y + h; y += s) {
			s = random(2, 5);
			c = 255;
			if (random(1) > 0.5) {
				c = 0;
			}
			noStroke();
			fill(c);
			rect(x, y, s + random(1, 50), s);
		}
	}
	pop();
}
function noisecolor(_x, _y, _w, _h) {
	push();
	let s = random(1, 8);
	let w = _w;
	let h = _h;
	for (let x = _x; x < _x + w; x += s) {
		for (let y = _y; y < _y + h; y += s) {
			s = random(1, 8);
			noStroke();
			fill(random(255), random(255), random(255));
			rect(x, y, s + random(1, 50), s);
		}
	}
	pop();
}

function cut(_x, _y) {
	push();
	noFill();
	noSmooth();
	let w = random(40, 200);
	let h = random(40, 200);
	let im = get(_x, _y, w, h);
	let nx = map(noise(_x * 0.01, _y * 0.01), 0, 1, -100, 100) * cos(_x);
	let ny = map(noise(_x * 0.01, _y * 0.02), 0, 1, -100, 100) * sin(_x);
	image(im, _x + nx, _y + ny);
	stroke(random(255));
	rect(_x + nx, _y + ny, im.width, im.height);
	pop();
}
class P {
	constructor(_x, _y, _v, _p, _ns) {
		this.pos = createVector(_x, _y);
		this.vel = createVector(0, 0);
		this.ve = _v;
		this.initpos = createVector(_x, _y);
		this.a = PI * _p; //int(random(700,750));//720
		this.b = 0;
		this.offset = random(0, 0.2);
		this.noise_size = _ns; //0.008
		this.counter = 0;
		this.n = 0;
	}
	update() {
		this.n = noise(
			this.pos.x * this.noise_size,
			this.pos.y * this.noise_size,
			0,
		);
		this.vel.x = this.ve * this.n * cos(this.a * this.n);
		this.vel.y = this.ve * this.n * sin(this.a * this.n);
		this.vel.mult(2);
		this.pos.add(this.vel);
		this.offset += 0.0001;
		this.counter++;
	}
}

function grabImage() {
	let date =
		year() +
		"" +
		month() +
		"" +
		day() +
		"" +
		hour() +
		"" +
		minute() +
		"" +
		second() +
		"" +
		".png";
	console.log(
		`%c SAVING ${
			String.fromCodePoint(0x1f5a4) + String.fromCodePoint(0x1f90d)
		}`,
		"background: #000; color: #ccc;padding:5px;font-size:15px",
	);
	saveCanvas("het_" + date);
}
function keyReleased() {
	if (key == "s" || key == "S") {
		grabImage();
	}
	// Hack the time
	if (key == "h" || key == "H") {
		hack = !hack;
		init();
	}
}
