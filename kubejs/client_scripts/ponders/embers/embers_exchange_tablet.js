Ponder.registry(event => {			
	event.create([
			'embers:alchemy_tablet',
			'embers:alchemy_pedestal',
			'embers:beam_cannon',
			'embers:copper_cell',
			'embers:ember_dial',
			'embers:mnemonic_inscriber',
			'embers:entropic_enumerator'			
		])
		.scene("embers_exchange_tablet", "Trial and Error using the Exchange Tablet", "kubejs:embers_exchange_tablet",
			(scene, util) => {

				//START
				scene.world.showSection([0, 0, 0, 10, 0, 10], Facing.UP)
				scene.world.showSection([5, 1, 5], Facing.UP)
				scene.idle(10);
				scene.text(80, "The Exchange Tablet allows you to construct complicated items with the power of Alchemy", [5.5, 1.5, 5.5])
					.placeNearTarget();
				scene.idle(100);
				scene.text(80, "It involves taking risks like loosing ingredients", [5.5, 1.5, 5.5])
					.colored(PonderPalette.RED)
					.placeNearTarget();
				scene.idle(100);
				scene.world.showSection([3, 1, 4, 3, 2, 4], Facing.DOWN)
				scene.idle(3);
				scene.world.showSection([3, 1, 6, 3, 2, 6], Facing.DOWN)
				scene.idle(3);
				scene.world.showSection([5, 1, 3, 5, 2, 3], Facing.DOWN)
				scene.idle(3);
				scene.world.showSection([5, 1, 7, 5, 2, 7], Facing.DOWN)
				scene.idle(3);
				scene.world.showSection([7, 1, 4, 7, 2, 4], Facing.DOWN)
				scene.idle(3);
				scene.world.showSection([7, 1, 6, 7, 2, 6], Facing.DOWN)
				scene.idle(9);
				scene.text(60, "Parts of this construct include multiple Alchemy Pedestals", [3.5, 1.5, 4.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(80);
				scene.world.showSection([1, 1, 5, 2, 2, 5], Facing.DOWN)
				scene.text(60, "As well as a Beam Cannon", [2.5, 1.5, 5.5])
					.placeNearTarget()
				scene.idle(80);
			});
});