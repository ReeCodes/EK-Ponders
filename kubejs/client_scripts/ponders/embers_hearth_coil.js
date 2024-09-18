Ponder.registry(event => {
	event.create([
			'embers:hearth_coil',
			'embers:mechanical_core',
			'embers:atmospheric_bellows',
			'embers:char_instiller',
			'embers:heat_insulation'
		])
		.scene("embers_hearth_coil", "Smelting Items with the Hearth Coil", "kubejs:embers_hearth_coil",
			(scene, util) => {

				let emberEmitter = util.grid.at(5, 2, 0);
				let itemsDroppedOf = util.vector.topOf(util.grid.at(4, 2, 4));

				//START
				scene.world.showSection([0, 0, 0, 8, 0, 8], Facing.UP)
				scene.world.showSection([3, 2, 3, 6, 2, 6], Facing.UP)
				scene.idle(10);
				scene.text(60, "The Hearth Coil smelts items using Ember", [4.5, 2, 5.5])
					.placeNearTarget();
				scene.idle(80);
				scene.world.hideSection([3, 2, 3, 6, 2, 6], Facing.UP)
				scene.idle(20);
				scene.world.showSection([4, 1, 4], Facing.DOWN)
				scene.idle(20);
				scene.text(70, "Mechanical Cores are used to extend inventories of blocks", [4.5, 2.5, 4.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.text(70, "They are necessary to operate this type of contraption", [4.5, 1.5, 4.5])
					.colored(PonderPalette.RED)
					.placeNearTarget();
				scene.idle(90);
				scene.world.showSection([3, 1, 3, 5, 1, 3], Facing.DOWN)
				scene.world.showSection([3, 1, 5, 5, 1, 5], Facing.DOWN)
				scene.text(60, "Up to 3 can be attached in a row", [4.5, 1.5, 3.5])
					.placeNearTarget();
				scene.idle(80);
				scene.world.showSection([3, 2, 3, 6, 2, 6], Facing.DOWN)
				scene.idle(20);
				for (let x = 3; x < 6; x++) {
					scene.world.showSection([x, 1, 2], Facing.SOUTH);
					scene.idle(3);
				}
				scene.text(80, "Dials can be attached to view the amount of Ember, Heat and Items inside the Hearth Coil", [5, 0.5, 4])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(100);
				for (let x = 3; x < 5; x++) {
					scene.world.showSection([x, 1, 1], Facing.DOWN);
					scene.idle(3);
				}
				scene.idle(20);
				scene.text(60, "Comparators can be placed for better redstone control", [3.5, 1.5, 1.5])
					.placeNearTarget();
				scene.idle(80);
				scene.text(50, "Ember Receptors are attachable as well", [5.5, 1.5, 2.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(60);
				for (let x = 0; x < 3; x++) {
					let entitySpark = scene.world.createEntity("embers:ember_packet", emberEmitter);
					scene.world.modifyEntity(entitySpark, (e) => {
						e.mergeNbt(`{lifetime:60,Motion:[0.0d,0.5d,0.0d],destX:5,destY:1,destZ:2}`);
					});
					if (x == 1) {
						//ACTIVE HEARTH COIL
						scene.world.modifyBlockEntityNBT([4, 2, 4], (nbt) => {
							nbt.heat = 80
						});
					}
					scene.idle(20)
				}
				
				//BURNING ITEMS
				let item1 = scene.world.createItemEntity(itemsDroppedOf.add(0, 1.5, 0), util.vector.of(-0.03, 0, 0), "iron_ore");
				let item2 = scene.world.createItemEntity(itemsDroppedOf.add(0, 1.5, 0), util.vector.of(-0.03, 0, -0.03), "beef");
				let item3 = scene.world.createItemEntity(itemsDroppedOf.add(0, 1.5, 0), util.vector.of(0.03, 0, 0), "clay");
				scene.idle(10);
				scene.text(80, "Items have to be dropped on top of the heated coil to be smelted", itemsDroppedOf)
					.placeNearTarget();
				scene.idle(100);
				scene.world.removeEntity(item1);
				scene.world.removeEntity(item2);
				scene.world.removeEntity(item3);

				//PIPING ITEMS
				scene.rotateCameraY(-90);
				scene.idle(20);
				scene.world.showSection([1, 1, 4, 2, 2, 6], Facing.EAST)
				scene.idle(20);
				scene.text(80, "Once done, items can be pumped out using an Item Extractor and Item Pipes", [2.5, 1.5, 5.5])
					.placeNearTarget();
				scene.showControls(40, util.grid.at(2, 2, 5).above(0.5), "down").rightClick();
				scene.world.modifyBlocks([2, 2, 5], (bState) => bState.with("powered", "true").with("face", "floor").with("facing", "east"), false);
				scene.idle(100);
				
				//INSULATOR
				scene.world.showSection([3, 1, 6, 5, 1, 6], Facing.NORTH)
				scene.idle(20);
				scene.text(80, "Heat Insulators increase the Max Heat of the Hearth Coil and reduces Cooling Speed when dormant", [4.5, 1.5, 6.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(100);
				scene.text(80, "Multiple Insulators can be attached until no more ports are left", [4.5, 1.5, 6.5])
					.placeNearTarget();
				scene.idle(100);
				scene.rotateCameraY(-180);
				scene.idle(40);

				//SPECIAL UPGRADES
				scene.world.setBlocks([8, 1, 5], 'embers:char_instiller');
				scene.world.setBlocks([7, 1, 5], 'embers:atmospheric_bellows');
				scene.world.modifyBlocks([8, 1, 5], (curState) => curState.with("facing", "west"), false);
				scene.world.modifyBlocks([7, 1, 5], (curState) => curState.with("facing", "west"), false);

				scene.text(80, "Lastly, optional Specialization Upgrades can be applied, doubling the speed for specific recipes", [5.5, 1.5, 5.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(100);
				let smokingUpgrade = scene.world.showIndependentSection([8, 1, 5], Direction.WEST);
				scene.world.moveSection(smokingUpgrade, [-2, 0, 0], 0);
				scene.idle(10);
				scene.world.setBlocks([6, 1, 5], 'embers:char_instiller');
				scene.world.modifyBlocks([6, 1, 5], (curState) => curState.with("facing", "west"), false);
				scene.text(80, "Applying the Char Instiller doubles your speed for Smoking recipes only", [6.5, 1.5, 5.5])
					.placeNearTarget();
				scene.idle(100);
				scene.world.hideIndependentSection(smokingUpgrade, Direction.EAST);
				scene.idle(20);

				let blastingUpgrade = scene.world.showIndependentSection([7, 1, 5], Direction.WEST);
				scene.world.moveSection(blastingUpgrade, [-1, 0, 0], 0);
				scene.idle(10);
				scene.world.setBlocks([6, 1, 5], 'embers:atmospheric_bellows', false);
				scene.world.modifyBlocks([6, 1, 5], (curState) => curState.with("facing", "west"), false);
				scene.text(80, "Atmospheric Bellows limits the Hearth Coil to only Blasting recipes, however at double the speed", [6.5, 1.5, 5.5])
					.placeNearTarget();
				scene.idle(100);
				scene.world.setBlocks([6, 1, 5], 'air', false);
				scene.world.hideIndependentSection(blastingUpgrade, Direction.EAST);				
			});
});