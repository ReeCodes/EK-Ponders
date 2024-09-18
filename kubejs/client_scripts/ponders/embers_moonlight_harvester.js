const $GlowParticleOptions = Java.loadClass("com.rekindled.embers.particle.GlowParticleOptions");
const $AWUtils = Java.loadClass("net.sirplop.aetherworks.util.Utils");
const $CreateEmitter = Java.loadClass("com.simibubi.create.foundation.ponder.instruction.EmitParticlesInstruction");

Ponder.registry(event => {			
	event.create([
		'aetherworks:prism', 
		'aetherworks:aether_prism_controller_matrix', 
		'aetherworks:moonlight_amplifier', 
		'aetherworks:prism_support'
		])
		.scene("embers_moonlight_harvester", "Gathering Aetherium with the Moonlight Harvester", "kubejs:embers_moonlight_harvester",
			(scene, util) => {
				
				let pAetherium = new $GlowParticleOptions($AWUtils.AETHERIUM_COLOR, 1.0, 1);
				let pEmber = new $GlowParticleOptions($GlowParticleOptions.EMBER_COLOR, 40.0, 1.25);
								
				let pAetheriumBeamPos = util.vector.blockSurface(util.grid.at(4, 4, 4), Direction.DOWN);
				
				let amp1 = util.select.position(4, 4, 1);
				let amp2 = util.select.position(7, 4, 4);
				let amp3 = util.select.position(4, 4, 7);
				let amp4 = util.select.position(1, 4, 4);
				
				let matrix1 = util.select.position(2, 3, 2);
				let matrix2 = util.select.position(6, 3, 2);
				let matrix3 = util.select.position(6, 3, 6);
				let matrix4 = util.select.position(2, 3, 6);
				
				let startingPosition = [
					{ start: { x: 2.5, y: 4, z: 2.5 }, end: { x: 4.5, y: 5, z: 4.5 } },
				];

				let allPositions = [
					{ start: { x: 2.5, y: 4, z: 2.5 }, end: { x: 4.5, y: 5, z: 4.5 } },
					{ start: { x: 6.5, y: 4, z: 2.5 }, end: { x: 4.5, y: 5, z: 4.5 } },
					{ start: { x: 6.5, y: 4, z: 6.5 }, end: { x: 4.5, y: 5, z: 4.5 } },
					{ start: { x: 2.5, y: 4, z: 6.5 }, end: { x: 4.5, y: 5, z: 4.5 } }
				];
				
				function collectingAetherium(scene, amount, idle) {
					for (let x = 0; x < amount; x++) {
						for (let y = 0.5; y > -3; y -= 0.05) {
							scene.effects.emitParticles(pAetheriumBeamPos.add(0, y * Math.random(), 0), $CreateEmitter.Emitter.simple(pAetherium, util.vector.of(0, 0, 0)), 1.0, 20);
						}
						scene.idle(idle);
					}
				}
				
				function matrixParticles(scene, pos, steps, amplitude, particlesPerTick, particleType) {
					let frequency = JavaMath.PI / steps * (-2);
					
					for (let i = 0; i < steps; i += particlesPerTick) {
						for (let j = 0; j < particlesPerTick; j++) {
							let t = (i + j) / steps;
							let x = pos.start.x + (pos.end.x - pos.start.x) * t;
							let z = pos.start.z + (pos.end.z - pos.start.z) * t;

							let baseY = pos.start.y + (pos.end.y - pos.start.y) * t;
							let y = baseY + amplitude * Math.sin(frequency * (i + j));

							let currentPos = util.vector.of(x, y, z);
							scene.effects.emitParticles(currentPos, $CreateEmitter.Emitter.simple(particleType, util.vector.of(0, 0, 0)), 1.0, 20);
						}
						scene.idle(1);
					}
				}

				function matrixCollecting(scene, positions, amount, idle) {
					for (let x = 0; x < amount; x++) {
						let steps = 100;
						let amplitude = 1;
						let particlesPerTick = 3;

						for (let pos of positions) {
							let particleType = Math.random() < 0.5 ? pEmber : pAetherium;
							matrixParticles(scene, pos, steps, amplitude, particlesPerTick, particleType);
							collectingAetherium(scene, 1, 1);
						}
						scene.idle(idle);
					}
				}
				
				//START
				scene.world.modifyBlocks([4, 4, 1], (bState) => bState.with("facing", "north"), false);
				scene.world.showSection([0, 0, 0, 10, 0, 10], Facing.UP)
				scene.idle(10);
				scene.world.showSection([2, 1, 2, 2, 2, 2], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([6, 1, 2, 6, 2, 2], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([6, 1, 6, 6, 2, 6], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([2, 1, 6, 2, 2, 6], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([4, 1, 1, 4, 3, 1], Facing.DOWN);
				let ampPos = scene.world.showIndependentSection(util.select.position(4, 4, 1), Direction.DOWN);
				scene.idle(3);
				scene.world.showSection([7, 1, 4, 7, 4, 4], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([4, 1, 7, 4, 4, 7], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([1, 1, 4, 1, 4, 4], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([4, 1, 4, 4, 4, 4], Facing.DOWN);
				scene.idle(20);
				scene.text(60, "The Moonlight Harvester is a construct made up of eight pillars", [4.5, 4.5, 4.5])
					.placeNearTarget();					
				scene.idle(70);
				scene.text(60, "Each Moonlight Amplifier has to face the Refraction Prism", [4.5, 4.5, 4.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), amp2, 80);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), amp3, 80);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), amp4, 80);
				scene.overlay.showLine(PonderPalette.GREEN, util.vector.blockSurface(util.grid.at(7, 4, 4), Direction.WEST),
					util.vector.blockSurface(util.grid.at(4, 4, 4), Direction.EAST), 80);
				scene.overlay.showLine(PonderPalette.GREEN, util.vector.blockSurface(util.grid.at(4, 4, 7), Direction.NORTH),
					util.vector.blockSurface(util.grid.at(4, 4, 4), Direction.SOUTH), 80);
				scene.overlay.showLine(PonderPalette.GREEN, util.vector.blockSurface(util.grid.at(1, 4, 4), Direction.EAST),
					util.vector.blockSurface(util.grid.at(4, 4, 4), Direction.WEST), 80);
				scene.idle(80);
				scene.overlay.showSelectionWithText(amp1, 40)
					.colored(PonderPalette.RED)
					.placeNearTarget()
					.text("This one however is not");
				scene.idle(60);
				scene.particles
					.rotationIndicator(10, [4.5, 4.5, 1.5], 0.5, 0.5, "Y")
					.rotationSpeed(10)
					.color("#FF0000");
				scene.idle(5);
				scene.world.rotateSection(ampPos, 0, 180, 0, 10);
				scene.idle(10);
				scene.text(60, "Now the structure should light up (Not replicable in ponder view)", [4.5, 4.5, 4.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(80);
				scene.text(100, "At night the Moonlight Harvester will start collecting Impure Aetherium Sludge", [4.5, 1.5, 4.5])
					.placeNearTarget();
				scene.idle(20);	
				scene.rotateCameraY(14);
				scene.idle(10);
				collectingAetherium(scene, 2, 60);
				scene.idle(10);
				scene.rotateCameraY(-64);
				scene.text(80, "Placing an Aetherium Focusing Matrix on the lower pillars, speeds up the collection process", [2.5, 3.5, 2.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.world.showIndependentSection(matrix1, Direction.DOWN);
				scene.idle(35);
				matrixCollecting(scene, startingPosition, 3, 12);
				scene.world.showIndependentSection(matrix2, Direction.DOWN);
				scene.world.showIndependentSection(matrix3, Direction.DOWN);
				scene.world.showIndependentSection(matrix4, Direction.DOWN);
				scene.rotateCameraY(64);
				scene.idle(12);
				scene.markAsFinished();
				matrixCollecting(scene, allPositions, 4, 0);
			});
});