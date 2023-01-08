
let myRequest;
let isStopFire = false;
function createCloseButton() {
	let clolseButton = document.createElement("button");
	clolseButton.className = "close-fire-button";
	clolseButton.textContent = "关闭烟火";
	clolseButton.addEventListener("click", function (e) {
		isStopFire = true;
		window.cancelAnimationFrame(myRequest);
		let canvas = document.getElementsByTagName("canvas");
		for (let index = 0; index < canvas.length; index++) {
			const element = canvas[index];
			element.remove();
		}
		e.target.remove();
	});

	document.body.appendChild(clolseButton);
}

function startFire() {
	isStopFire = false;
	let textCanvas = document.createElement("canvas");
	textCanvas.width = 500;
	textCanvas.height = 300;
	let textctx = textCanvas.getContext("2d");
	textctx.fillStyle = "#000000";
	textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

	let canvas = document.createElement("canvas");
	document.body.appendChild(canvas);
	createCloseButton();
	canvas.style.position = "fixed";
	canvas.style.left = "0";
	canvas.style.top = "0";
	canvas.style.zIndex = -1;

	let context = canvas.getContext("2d");

	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		clearCanvas();
	}

	function clearCanvas() {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	resizeCanvas();

	window.addEventListener("resize", resizeCanvas);


	function mouseDownHandler(e) {
		let x = e.clientX;
		let y = e.clientY;

		createFireworks(x, y, randomText());
	}
	document.addEventListener("mousedown", mouseDownHandler);

	let particles = [];

	function createFireworks(x, y, text = "") {

		let hue = Math.random() * 360;
		let hueVariance = 30;

		function setupColors(p) {
			p.hue = Math.floor(Math.random() * ((hue + hueVariance) - (hue - hueVariance))) + (hue - hueVariance);
			p.brightness = Math.floor(Math.random() * 21) + 50;
			p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
		}

		if (text != "") {

			let gap = 6;
			let fontSize = 120;

			textctx.font = fontSize + "px Verdana";
			textctx.fillStyle = "#ffffff";

			let textWidth = textctx.measureText(text).width;
			let textHeight = fontSize;

			textctx.fillText(text, 0, textHeight);
			let imgData = textctx.getImageData(0, 0, textWidth, textHeight * 1.2);

			textctx.fillStyle = "#000000";
			textctx.fillRect(0, 0, textCanvas.width, textCanvas.height);

			for (let h = 0; h < textHeight * 1.2; h += gap) {
				for (let w = 0; w < textWidth; w += gap) {
					let position = (textWidth * h + w) * 4;
					let r = imgData.data[position], g = imgData.data[position + 1], b = imgData.data[position + 2], a = imgData.data[position + 3];

					if (r + g + b == 0) continue;

					let p = {};

					p.x = x;
					p.y = y;

					p.fx = x + w - textWidth / 2;
					p.fy = y + h - textHeight / 2;

					p.size = Math.floor(Math.random() * 2) + 1;
					p.speed = 1;

					setupColors(p);

					particles.push(p);
				}
			}
		} else {
			let count = 100;
			for (let i = 0; i < count; i++) {
				//角度
				let angle = 360 / count * i;
				//弧度
				let radians = angle * Math.PI / 180;

				let p = {};

				p.x = x;
				p.y = y;
				p.radians = radians;

				//大小
				p.size = Math.random() * 2 + 1;

				//速度
				p.speed = Math.random() * 5 + .4;

				//半径
				p.radius = Math.random() * 81 + 50;

				p.fx = x + Math.cos(radians) * p.radius;
				p.fy = y + Math.sin(radians) * p.radius;

				setupColors(p);

				particles.push(p);
			}
		}
	}
	function drawFireworks() {
		clearCanvas();

		for (let i = 0; i < particles.length; i++) {
			let p = particles[i];

			p.x += (p.fx - p.x) / 10;
			p.y += (p.fy - p.y) / 10 - (p.alpha - 1) * p.speed;

			p.alpha -= 0.006;

			if (p.alpha <= 0) {
				particles.splice(i, 1);
				continue;
			}

			context.beginPath();
			context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
			context.closePath();

			context.fillStyle = 'hsla(' + p.hue + ',100%,' + p.brightness + '%,' + p.alpha + ')';
			context.fill();
		}
	}
	function randomText() {
		return ["", "完美", "", "最棒", "", "大神", "", "", ""][Math.floor(Math.random() * 9)];
	}
	//requestAnimationFrame
	let lastStamp = 0;
	function tick(opt = 0) {
		if (isStopFire) {
			return;
		}
		if (opt - lastStamp > 2000) {
			lastStamp = opt;
			createFireworks(Math.random() * canvas.width, Math.random() * canvas.height,
				randomText());
		}

		context.globalCompositeOperation = 'destination-out';
		context.fillStyle = 'rgba(0,0,0,' + 10 / 100 + ')';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.globalCompositeOperation = 'lighter';

		drawFireworks();

		myRequest = requestAnimationFrame(tick);
	}
	tick();
};