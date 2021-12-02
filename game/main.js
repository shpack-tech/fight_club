document.addEventListener('DOMContentLoaded', function (event) {
	'use strict';

	const level_PREFIX = 'game/level';
	const level_SUFFIX = '.json';

	const AssetsManager = function () {
		this.tile_set_image = undefined;
	};

	AssetsManager.prototype = {
		constructor: Game.AssetsManager,

		requestJSON: function (url, callback) {
			let request = new XMLHttpRequest();

			request.addEventListener(
				'load',
				function (event) {
					callback(JSON.parse(this.responseText));
				},
				{ once: true }
			);

			request.open('GET', url);
			request.send();
		},

		requestImage: function (url, callback) {
			let image = new Image();

			image.addEventListener(
				'load',
				function (event) {
					callback(image);
				},
				{ once: true }
			);

			image.src = url;
		},
	};

	var keyDownUp = function (event) {
		controller.keyDownUp(event.type, event.keyCode);
	};

	var resize = function (event) {
		display.resize(document.documentElement.clientWidth, document.documentElement.clientHeight, game.world.height / game.world.width);
		display.render();

		var rectangle = display.context.canvas.getBoundingClientRect();

		p.style.left = rectangle.left + 'px';
		p.style.top = rectangle.top + 'px';
		p.style.fontSize = (game.world.tile_set.tile_size * rectangle.height) / game.world.height + 'px';
	};

	var render = function () {
		var frame = undefined;

		display.drawMap(
			assets_manager.tile_set_image,
			game.world.tile_set.columns,
			game.world.graphical_map,
			game.world.columns,
			game.world.tile_set.tile_size
		);

		for (let index = game.world.coffee.length - 1; index > -1; --index) {
			let coffee_ = game.world.coffee[index];

			frame = game.world.tile_set.frames[coffee_.frame_value];

			display.drawObject(
				assets_manager.tile_set_image,
				frame.x,
				frame.y,
				coffee_.x + Math.floor(coffee_.width * 0.5 - frame.width * 0.5) + frame.offset_x,
				coffee_.y + frame.offset_y,
				frame.width,
				frame.height
			);
		}

		frame = game.world.tile_set.frames[game.world.player.frame_value];

		display.drawObject(
			assets_manager.tile_set_image,
			frame.x,
			frame.y,
			game.world.player.x + Math.floor(game.world.player.width * 0.5 - frame.width * 0.5) + frame.offset_x,
			game.world.player.y + frame.offset_y,
			frame.width,
			frame.height
		);

		for (let index = game.world.grass.length - 1; index > -1; --index) {
			let grass = game.world.grass[index];

			frame = game.world.tile_set.frames[grass.frame_value];

			display.drawObject(assets_manager.tile_set_image, frame.x, frame.y, grass.x + frame.offset_x, grass.y + frame.offset_y, frame.width, frame.height);
		}

		if (game.world.coffee__count >= 10) {
			window.location.href = 'levels.html';
		}

		display.render();
	};

	var update = function () {
		if (controller.left.active) {
			game.world.player.moveLeft();
		}
		if (controller.right.active) {
			game.world.player.moveRight();
		}
		if (controller.up.active) {
			game.world.player.jump();
			controller.up.active = false;
		}

		game.update();

		if (game.world.door) {
			engine.stop();

			assets_manager.requestJSON(level_PREFIX + game.world.door.destination_level + level_SUFFIX, (level) => {
				game.world.setup(level);

				engine.start();
			});

			return;
		}
	};

	var assets_manager = new AssetsManager();
	var controller = new Controller();
	var display = new Display(document.querySelector('canvas'));
	var game = new Game();
	var engine = new Engine(1000 / 30, render, update);

	var p = document.createElement('p');
	document.body.appendChild(p);

	display.buffer.canvas.height = game.world.height;
	display.buffer.canvas.width = game.world.width;
	display.buffer.imageSmoothingEnabled = false;

	assets_manager.requestJSON(level_PREFIX + game.world.level_id + level_SUFFIX, (level) => {
		game.world.setup(level);

		assets_manager.requestImage('assets.png', (image) => {
			assets_manager.tile_set_image = image;

			resize();
			engine.start();
		});
	});

	window.addEventListener('keydown', keyDownUp);
	window.addEventListener('keyup', keyDownUp);
	window.addEventListener('resize', resize);
});
