/*
	Embers Rekindled x Aetherworks - Ponders by 'RQT
*/

Ponder.registry(event => {			
	event.create([
		'aetherworks:aether_forge', 
		'aetherworks:forge_anvil', 
		'aetherworks:forge_tool_station', 
		'aetherworks:forge_metal_former', 
		'aetherworks:forge_vent', 
		'aetherworks:forge_heater', 
		'aetherworks:forge_cooler'
		])
		.scene("embers_aetherium_forge", "Operating the Aetherium Forge", "kubejs:embers_aetherium_forge",
			(scene, util) => {
				
				let pEmber = new $SparkParticleOptions($GlowParticleOptions.EMBER_COLOR, 1.0);
				let pSmoke = new $SmokeParticleOptions($SmokeParticleOptions.SMOKE_COLOR, 3.0);
				let emitEmber = $CreateEmitter.Emitter.simple(pEmber, util.vector.of(0.1, 0, 0.1));
				let emitSmoke = $CreateEmitter.Emitter.simple(pSmoke, util.vector.of(0.1, 0, 0.1));
				
				let forgeCore = util.grid.at(4, 2, 4);
				let emberEmitter = util.grid.at(4, 3, 0);
				let nixieTube = util.grid.at(2, 1, 6);
				let forgeReceptor = util.grid.at(4, 4, 4);
				let pipeConnection = util.grid.at(4, 2, 2);
				let metalFormer = util.grid.at(4, 3, 5);
				let aethAnvil = util.grid.at(3, 3, 4);
				let aethTF = util.grid.at(5, 3, 4);
				
				let glowPosAnvil = util.vector.centerOf(aethAnvil).add(0.03 + Math.random() * 0.4, 0, 0.03 + Math.random() * 0.4);
				
				let rHeater = util.vector.centerOf(3, 3, 2);
				let boxHeater = new $AABB(rHeater).move(0, -0.25, 0).deflate(1 / 4);
				
				let lHeater = util.vector.centerOf(3, 2, 1);
				let boxLever = new $AABB(lHeater).move(0, -0.25, 0).deflate(1 / 4);
				
				let rHeater2 = util.vector.centerOf(5, 3, 2);
				let boxHeater2 = new $AABB(rHeater2).move(0, -0.25, 0).deflate(1 / 4);

				let bHeater = util.vector.centerOf(5, 2, 1);
				let boxButton = new $AABB(bHeater).move(0, -0.25, 0).deflate(0.65);					
				
				let textStart = 60;
				let counter = 0;
				
				let randomNum = (min, max) => {
					return Math.random() * (max - min) + min;
				}
				
				let forgeActions = [
					"Form Gems and Metals,",
					"Break Geodes,",
					"Purify Tool Parts,",
					"and Forge Tools"
				];
				
				let heaterNeeds = [
					"A Molten Fluid Source, ",
					"Ember,",
					"Water,",
					"and a Redstone Signal"
				];
				
				let coolerNeeds = [
					"Any Cold Block, ",
					"Ember,",
					"Water,",
					"and a Redstone Signal"
				];
				
				function nixieStrength(scene, strength) {
					scene.world.modifyBlockEntityNBT(nixieTube, (nbt) => {
						nbt.RedstoneStrength = strength;
					})
				}
				
				function modifyHeat(scene, heatAmount) {
					scene.world.modifyBlockEntityNBT(forgeCore, (nbt) => {
						nbt["aetherworks:heat"] = heatAmount;
					});
				}
				
				function modifyEmber(scene, emberAmount) {
					scene.world.modifyBlockEntityNBT(forgeCore, (nbt) => {
						nbt["embers:ember"] = emberAmount;
					})
				}
				
				function makeBoom(scene) {
					scene.world.showIndependentSectionImmediately(util.select.fromTo(1, 1, 1, 7, 4, 7))
					scene.world.replaceBlocks([1, 1, 1, 7, 4, 7], "air", false);
					scene.world.replaceBlocks([2, 0, 2, 6, 0, 6], "air", false);
					scene.world.setBlock([3, 1, 2], "lava", false);
					scene.particles.simple(10, "explosion", [2, 1, 2])
						.density(1)
						.scale(1.15)
						.motion([0, 0, -0.1])
						.area([6, 3, 6]);
				}
				
				function nixieStrengthAnimate(scene, start, end, idle, isAddition) {
					
					let heatAmount = (end / 15) * 3000;
					modifyHeat(scene, heatAmount);
					
					if (isAddition) {
						for (let i = start; i <= end; i++) {
							nixieStrength(scene, i)
							scene.idle(idle);
						}
					} else {
						for (let i = start; i >= end; i--) {
							nixieStrength(scene, i)
							scene.idle(idle);
						}
					}
				}
				
				function spawnEmber(scene, emberSparks, dX, dY, dZ) {
					for (let x = 0; x < emberSparks; x++) {
						
						scene.idle(15);
						let entitySpark = scene.world.createEntity("embers:ember_packet", emberEmitter);
						
						scene.world.modifyEntity(entitySpark, (e) => {
							e.mergeNbt(`{lifetime:60,Motion:[0.0d,0.25,0.0d],destX:${dX},destY:${dY},destZ:${dZ}}`);
						});
					}
				}
				
				function anvilTimeout(scene, timeout) {
					scene.world.modifyBlockEntityNBT(aethAnvil, (nbt) => {
						nbt.hitTimeout = timeout;
					});
				}
				
				function simulateHitAnvil(scene, resetTimeout) {
					let randomIdle = randomNum(20, 80);
					scene.idle(Math.round(randomIdle * 0.25));
					scene.showControls(5, util.vector.centerOf(aethAnvil).subtract(0, 0.25, 0), "right").rightClick().withItem("embers:tinker_hammer");
					scene.idle(1);
					scene.effects.emitParticles(glowPosAnvil, emitEmber, 20.0, 1);
					scene.idle(5);
					if (resetTimeout) {
						scene.idle(5);
						anvilTimeout(scene, 0);
						scene.idle(randomIdle);
						anvilTimeout(scene, 80);
					}
				}
				
				function simulateHitTF(scene, complete) {
					let maxHits = 1;
					if (complete) maxHits = 15;
					for (let i = 0; i <= maxHits; i++) {
						let glowPosTF = util.vector.centerOf(aethTF).add(0.3 + Math.random() * 0.4, 0.35, 0.3 + Math.random() * 0.4);
						scene.idle(15);
						scene.showControls(5, util.vector.centerOf(aethTF).subtract(0, 0.25, 0), "down").rightClick().withItem("embers:tinker_hammer");
						scene.idle(1);
						scene.effects.emitParticles(glowPosTF, emitEmber, 10.0, 2);
						modifyHeat(scene, 2900);
						scene.idle(5);
						scene.world.modifyBlockEntityNBT(aethTF, (nbt) => {
							nbt.progress += 2;
							nbt.has_ember = 1;
							nbt.has_heat = 1;
							nbt.inventory = {
								Size: 6,
								Items: [
									{
										Slot: 3,
										id: "aetherworks:tool_rod_infused",
										Count: 1
									},
									{
										Slot: 2,
										id: "aetherworks:aether_pearl",
										Count: 1
									},
									{
										Slot: 1,
										id: "aetherworks:pickaxe_head_aether",
										Count: 1
									}
								]
							};
						});
						if (i == 3) {
							scene.text(60, "Each hit consumes Ember and Heat")
								.placeNearTarget()
								.colored(PonderPalette.MEDIUM)
								.independent(70);
						}
						if (i == 15) {
							scene.idle(3);
							scene.effects.emitParticles(glowPosTF, emitSmoke, 10.0, 2);
							scene.world.modifyBlockEntityNBT(aethTF, (nbt) => {
								nbt.progress = 0;
								nbt.has_ember = 1;
								nbt.has_heat = 1;
								nbt.inventory = {
									Size: 6,
									Items: [
										{
											Slot: 5,
											id: "aetherworks:pickaxe_aether",
											Count: 1
										}
									]
								};
							});
						}
					}
				}
				
				//START
				scene.world.showSection([0, 0, 0, 10, 0, 10], Facing.UP);
				scene.idle(10);
				for (let x = 3; x <= 5; x++) {
					for (let z = 3; z <= 5; z++) {
						if ((x == 3 && z == 4) || (x == 4 && z == 4)) {
							continue;
						}
						scene.world.showSection([x, 1, z], Facing.DOWN);
					}
					scene.idle(3);
				}
				scene.idle(20);
				scene.world.showSection([3, 2, 3, 5, 2, 5], Facing.DOWN);
				scene.world.showSection([4, 3, 4], Facing.DOWN);
				scene.idle(10);
				scene.text(60, "This is the Aetherium Forge", [4.5, 3.5, 4.5])
					.placeNearTarget();
				scene.idle(40);
				scene.overlay.showText(60)
					.colored(PonderPalette.MEDIUM)
					.placeNearTarget()
					.independent(65)
					.text("Heat and Ember are required for it to work");
				scene.idle(80);
				scene.overlay.showText(40)
					.independent(40)
					.placeNearTarget()
					.text("The Forge makes it possible to:");
				for (let t of forgeActions) {
					scene.idle(15);
					scene.overlay.showText(50)
						.colored(PonderPalette.MEDIUM)
						.placeNearTarget()
						.independent(textStart)
						.text(t);
					textStart += 17;
				}
				scene.idle(70);
				scene.world.setBlock([3, 2, 2], "aetherworks:forge_heater", false);
				scene.world.modifyBlock([3, 2, 2], (curState) => curState.with("facing", "south"), false);
				scene.world.showSection([3, 2, 2], Facing.SOUTH);
				scene.idle(10);
				scene.text(60, "Heat is generated by the Forge Heater", [3.5, 2.5, 2.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(60);
				
				//HEAT
				scene.world.setBlock([3, 1, 2], "lava", false);
				scene.world.setBlock([3, 3, 2], "embers:ember_receiver", false);
				scene.overlay.showText(240)
					.independent(40)
					.placeNearTarget()
					.text("The Forge Heater requires:");
				textStart = 60;
				for (let t of heaterNeeds) {
					scene.idle(30);
					scene.overlay.showText(80)
						.colored(PonderPalette.MEDIUM)
						.placeNearTarget()
						.independent(textStart)
						.text(t);
					textStart += 17;
					counter++;
					if (counter == 1) {
						scene.world.showSection([2, 1, 2], Facing.DOWN);
						scene.idle(6);
						scene.world.showSection([3, 1, 1], Facing.DOWN);
						scene.idle(6);
						scene.world.showSection([4, 1, 2], Facing.DOWN);
						scene.idle(6);
						scene.world.showSection([3, 1, 2], Facing.UP);
						scene.idle(10);
						scene.overlay.showOutline(PonderPalette.GREEN, new Object(), [3, 1, 2], 15);
					}
					if (counter == 2) {
						scene.world.showSection([3, 3, 2], Facing.DOWN);
						scene.idle(10);
						scene.overlay.chaseBoundingBoxOutline(PonderPalette.GREEN, boxHeater, boxHeater, 15);
						scene.idle(15);
						spawnEmber(scene, 2, 3, 3, 2);			
					}
					if (counter == 3) {
						scene.world.showSection([4, 1, 1], Facing.DOWN);
						scene.idle(10);
						scene.overlay.showOutline(PonderPalette.GREEN, new Object(), [4, 1, 1], 15);
						scene.idle(6);
						scene.world.showSection([4, 2, 1], Facing.DOWN);
						scene.idle(6);
						scene.world.showSection(pipeConnection, Facing.DOWN);
						scene.world.modifyBlockEntityNBT(pipeConnection, (nbt) => {
							nbt.connection4 = 3;
						});
						scene.idle(12);
						scene.showControls(30, util.vector.centerOf(util.grid.at(4, 1, 1)).add(0.25, 0, 0), "right").rightClick().withItem("minecraft:water_bucket");
						scene.idle(5);
						scene.world.modifyBlockEntityNBT([4, 1, 1], (nbt) => {
							nbt = {
								FluidName: "minecraft:water",
								Amount: 1000
							};
						})
					}
					if (counter == 4) {
						scene.world.showSection([3, 2, 1], Facing.DOWN);
						scene.idle(10);
						scene.overlay.chaseBoundingBoxOutline(PonderPalette.GREEN, boxLever, boxLever, 15);
						scene.idle(15);
						scene.showControls(40, util.grid.at(3, 2, 1).above(0.5), "down").rightClick();
						scene.idle(5);
						scene.world.modifyBlocks([3, 2, 1], (bState) => bState.with("powered", "true").with("face", "floor").with("facing", "south"), false);						
					}
					
				}
				scene.idle(80);
				modifyHeat(scene, 200);
				scene.text(80, "Once all has been provided, the Forge will start to heat up", [3.5, 2.5, 2.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(100);
				scene.world.hideSection([3, 2, 3, 5, 2, 5], Facing.UP);
				scene.world.hideSection([4, 3, 4], Facing.UP);
				scene.rotateCameraY(-60);
				scene.idle(20);
				scene.world.showSection([4, 1, 4, 3, 1, 4], Facing.DOWN);
				scene.idle(10);
				scene.text(60, "Just like most machines, this one can be extended too", [4.5, 1.5, 4.5])
					.placeNearTarget();
				scene.idle(80);
				scene.world.showSection([3, 2, 3, 5, 2, 5], Facing.DOWN);
				scene.world.showSection([4, 3, 4], Facing.DOWN);
				scene.idle(10);
				scene.world.showSection([2, 1, 4], Direction.EAST);
				scene.idle(10);
				scene.text(60, "Placing a Forge Dial shows the Heat of the Forge", [2.5, 2, 4.5])
					.placeNearTarget();
				scene.idle(80);
				scene.rotateCameraY(-40);
				scene.world.showSection([2, 1, 5], Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([2, 1, 6], Facing.DOWN);
				scene.idle(10);
				scene.text(60, "As well as giving of a redstone signal based off of the Heat", [2.5, 1.15, 5.5])
					.placeNearTarget();
				scene.idle(10);
				scene.world.modifyBlocks([2, 1, 5], (bState) => bState.with("powered", "true").with("facing", "north"), false);
				nixieStrengthAnimate(scene, 0, 2, 4, true);
				scene.idle(80);
				scene.overlay.showText(80)
					.colored(PonderPalette.MEDIUM)
					.placeNearTarget()
					.independent(60)
					.text("As the Heat continues to rise, recipes will start to become available for you");
				modifyHeat(scene, 2800);
				scene.idle(10);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), nixieTube, 4);
				nixieStrengthAnimate(scene, 2, 13, 8, true);
				scene.idle(40);
				scene.world.showSection(metalFormer, Facing.DOWN);
				scene.idle(10);
				scene.text(80, "To start of, place the Metal Former on top of the heated surface and provide it with an input", util.vector.centerOf(metalFormer).subtract(0, 0.25, 0))
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(60);
				scene.showControls(30, util.vector.topOf(metalFormer), "down").rightClick().withItem("aetherworks:aether_gas_bucket");
				scene.idle(5);
				scene.world.modifyBlockEntityNBT(metalFormer, (nbt) => {
					nbt.FluidName = "aetherworks:aether_gas";
					nbt.Amount = 360;
				});
				scene.idle(50);
				scene.showControls(30, util.vector.topOf(metalFormer), "down").rightClick().withItem("diamond");
				scene.idle(5);
				scene.world.modifyBlockEntityNBT(metalFormer, (nbt) => {
					nbt.inventory = {
						Size: 1,
						Items: [
							{
								Slot: 0,
								id: "minecraft:diamond",
								Count: 1
							}
						]
					};
				});
				scene.idle(50);
				scene.overlay.showText(80)
					.colored(PonderPalette.RED)
					.placeNearTarget()
					.independent(60)
					.text("Don't forget to add Ember too");
				scene.idle(10);
				scene.world.showSection(forgeReceptor, Facing.DOWN);
				scene.idle(3);
				scene.world.showSection([4, 3, 3], Facing.SOUTH);
				scene.idle(10);
				spawnEmber(scene, 3, 4, 4, 4);
				modifyEmber(scene, 1500);
				scene.idle(40);
				scene.world.modifyBlockEntityNBT(metalFormer, (nbt) => {
					nbt.progress = 295;
				});
				scene.text(80, "While progressing, Heat and Ember are being consumed", util.vector.topOf(metalFormer).subtract(0, 0.85, 0))
					.placeNearTarget();
				scene.idle(100);
				scene.world.modifyBlockEntityNBT(metalFormer, (nbt) => {
					nbt.inventory = {
						Size: 1,
						Items: [
							{
								Slot: 0,
								id: "aetherworks:gem_aether",
								Count: 1
							}
						]
					};
				});
				scene.world.modifyBlockEntityNBT(metalFormer, (nbt) => {
					nbt.FluidName = "minecraft:empty";
					nbt.Amount = 0;
				});
				scene.idle(20);
				scene.overlay.showText(60)
					.colored(PonderPalette.RED)
					.placeNearTarget()
					.independent(60)
					.attachKeyFrame()
					.text("At high Heat, the Aetherium Forge starts to become dangerously unstable");
				scene.idle(20);
				nixieStrength(scene, 13);
				scene.idle(60);
				scene.world.setBlock([3, 2, 6], "aetherworks:forge_vent", false);
				scene.idle(6);
				scene.world.showSection([3, 2, 6], Direction.NORTH);
				scene.idle(10);
				scene.text(60, "This can be compensated with a Forge Heat Vent", util.vector.blockSurface(util.grid.at(3, 2, 6), Direction.NORTH))
					.placeNearTarget();
				scene.idle(80);
				scene.world.showSection([4, 1, 6], Facing.DOWN);
				scene.idle(9);
				scene.world.showSection([4, 2, 6], Facing.DOWN);
				scene.idle(20);
				scene.showControls(20, util.grid.at(4, 2, 6).above(0.5), "down").rightClick();
				scene.idle(5);
				scene.world.modifyBlocks([4, 2, 6], (bState) => bState.with("powered", "true").with("face", "floor").with("facing", "north"), false);
				scene.idle(10);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), nixieTube, 4);
				scene.idle(10);
				nixieStrengthAnimate(scene, 13, 9, 10, false);
				scene.idle(20);
				scene.world.setBlock([5, 2, 6], "aetherworks:forge_vent", false);
				scene.idle(6);
				scene.world.showSection([5, 2, 6], Direction.NORTH);
				scene.idle(10);
				scene.text(60, "Adding one more Vent evens out the Heat", util.vector.blockSurface(util.grid.at(5, 2, 6), Direction.NORTH))
					.placeNearTarget();
				scene.idle(80);
				scene.showControls(20, util.grid.at(4, 2, 6).above(0.5), "down").rightClick();
				scene.idle(5);
				scene.world.modifyBlocks([4, 2, 6], (bState) => bState.with("powered", "false").with("face", "floor").with("facing", "north"), false);
				scene.idle(30);
				scene.rotateCameraY(120);
				scene.idle(20);
				scene.world.setBlock([5, 2, 2], "aetherworks:forge_cooler", false);
				scene.world.setBlock([5, 1, 2], "packed_ice", true);
				scene.world.setBlock([5, 3, 2], "embers:ember_receiver", false);
				scene.world.modifyBlock([5, 2, 2], (curState) => curState.with("facing", "south"), false);
				scene.world.showSection([5, 2, 2], Facing.SOUTH);
				scene.idle(10);
				scene.text(60, "For urgent cooling use a Forge Cooler", [5.5, 2.5, 2.5])
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(80);
				scene.overlay.showText(300)
					.independent(40)
					.placeNearTarget()
					.text("It's requirements are:");
				textStart = 60;
				counter = 0;
				for (let t of coolerNeeds) {
					scene.idle(30);
					scene.overlay.showText(60)
						.colored(PonderPalette.MEDIUM)
						.placeNearTarget()
						.independent(textStart)
						.text(t);
					textStart += 17;
					counter++;
					if (counter == 1) {
						scene.world.showSection([5, 1, 2], Facing.SOUTH);
						scene.idle(10);
						scene.overlay.showOutline(PonderPalette.GREEN, new Object(), [5, 1, 2], 15);
					}
					if (counter == 2) {	
						scene.world.showSection([5, 3, 2], Facing.DOWN);
						scene.idle(10);
						scene.overlay.chaseBoundingBoxOutline(PonderPalette.GREEN, boxHeater2, boxHeater2, 15);
						scene.idle(15);
						spawnEmber(scene, 2, 5, 3, 2);
					}
					
					if (counter == 3) {
						scene.idle(10);
						scene.overlay.showOutline(PonderPalette.GREEN, new Object(), [4, 1, 1], 15);
						scene.idle(10);
						scene.showControls(10, util.vector.centerOf(pipeConnection).add(0.25, 0, 0.25), "down").rightClick().withItem("embers:tinker_hammer");
						scene.idle(1);
						scene.world.modifyBlockEntityNBT(pipeConnection, (nbt) => {
							nbt.connection5 = 3;
						});
						scene.idle(1);
						scene.world.setBlock(pipeConnection, "embers:fluid_pipe", true);
						scene.idle(40);
						scene.showControls(30, util.grid.at(4, 1, 1), "right").rightClick().withItem("minecraft:water_bucket");
						scene.idle(5);
						scene.world.modifyBlockEntityNBT([4, 1, 1], (nbt) => {
							nbt = {
								FluidName: "minecraft:water",
								Amount: 1000
							};
						});
						scene.idle(10);
					}
					if (counter == 4) {
						scene.world.showSection([5, 1, 1], Facing.DOWN);
						scene.idle(9);
						scene.world.showSection([5, 2, 1], Facing.DOWN);
						scene.idle(10);
						scene.overlay.chaseBoundingBoxOutline(PonderPalette.GREEN, boxButton, boxButton, 15);
						scene.idle(20);
						scene.showControls(20, util.grid.at(5, 2, 1).above(0.5), "down").rightClick();
						scene.idle(5);
						scene.world.modifyBlocks([5, 2, 1], (bState) => bState.with("powered", "true").with("face", "floor").with("facing", "south"), false);
						scene.world.setBlock([5, 1, 2], "air", false);
						scene.idle(20);
						scene.world.modifyBlocks([5, 2, 1], (bState) => bState.with("powered", "false").with("face", "floor").with("facing", "south"), false);
						scene.idle(20);
						scene.overlay.showText(60)
							.colored(PonderPalette.RED)
							.placeNearTarget()
							.independent(140)
							.text("The cold block below will be used in the process");
					}
				}
				scene.idle(80);
				scene.rotateCameraY(-120);
				scene.idle(20);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), nixieTube, 4);
				scene.idle(10);
				nixieStrengthAnimate(scene, 9, 6, 2, false);
				scene.idle(40);
				scene.world.setBlock([2, 2, 3], "embers:fluid_vessel", false);
				scene.idle(10);
				scene.world.showSection([2, 2, 3], Facing.EAST);
				scene.idle(10);
				scene.text(100, "Note that placing a Fluid Vessel adjacent to the edges of the Forge fills the Metal Former with the same content", [2.5, 2.5, 3.5])
					.placeNearTarget()
					.colored(PonderPalette.MEDIUM)
					.attachKeyFrame();
				scene.idle(120);
				scene.showControls(20, util.grid.at(2, 2, 3).above(1.5), "down").rightClick().withItem("aetherworks:aether_gas_bucket");
				scene.idle(5);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), metalFormer, 4);
				scene.idle(10);
				scene.world.modifyBlockEntityNBT(metalFormer, (nbt) => {
					nbt.FluidName = "aetherworks:aether_gas";
					nbt.Amount = 1000;
				});
				scene.idle(40);
				scene.text(60, "For the next part, a lot of heat is required")
					.placeNearTarget()
					.colored(PonderPalette.MEDIUM)
					.independent(104);
				scene.idle(60);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), nixieTube, 4);
				nixieStrengthAnimate(scene, 6, 14, 6, true);
				scene.idle(10);
				scene.rotateCameraY(40);
				scene.idle(20);
				scene.world.showSection(aethAnvil, Facing.DOWN);
				scene.idle(10);
				scene.text(80, "The Aetherium Anvil is used to break open Geodes but also purifies Tool Parts", util.vector.centerOf(aethAnvil).subtract(0, 0.25, 0))
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(100);
				scene.showControls(10, util.vector.topOf(aethAnvil), "down").rightClick().withItem("aetherworks:tool_rod_crude");
				scene.idle(5);
				scene.world.modifyBlockEntityNBT(aethAnvil, (nbt) => {
					nbt.inventory = {
						Size: 1,
						Items: [
							{
								Slot: 0,
								id: "aetherworks:tool_rod_crude",
								Count: 1
							}
						]
					};
				});
				scene.idle(10);
				anvilTimeout(scene, 80);
				scene.idle(20);
				scene.text(100, "The green exclamation mark indicates the item being ready to get struck by the Tinker's Hammer", util.vector.centerOf(aethAnvil).add(0, 0.25, 0))
					.colored(PonderPalette.MEDIUM)
					.placeNearTarget();
				scene.idle(80);
				scene.text(80, "Each hit drains Ember and increases Heat dependent on the recipe's Difficulty Rating")
					.placeNearTarget()
					.colored(PonderPalette.RED)
					.independent(97);
				scene.idle(100);
				simulateHitAnvil(scene, false);
				scene.idle(5);
				anvilTimeout(scene, 0);
				scene.idle(20);
				scene.text(100, "Hitting the anvil while a yellow mark is shown or not hitting it at all will count as a mistake", util.vector.centerOf(aethAnvil).add(0, 0.25, 0))
					.colored(PonderPalette.MEDIUM)
					.placeNearTarget();
				scene.idle(80);
				anvilTimeout(scene, 80);
				simulateHitAnvil(scene, true);
				scene.text(60, "Three mistakes will destroy the item")
					.placeNearTarget()
					.colored(PonderPalette.RED)
					.independent(60);
				simulateHitAnvil(scene, true);
				simulateHitAnvil(scene, true);
				simulateHitAnvil(scene, true);
				simulateHitAnvil(scene, false);
				scene.idle(5);
				scene.world.modifyBlockEntityNBT(aethAnvil, (nbt) => {
					nbt.mistakes = 0;
					nbt.progress = 15;
					nbt.inventory = {
						Size: 1,
						Items: [
							{
								Slot: 0,
								id: "aetherworks:tool_rod",
								Count: 1
							}
						]
					};
				});
				scene.idle(10);
				scene.text(80, "In order to make use of the Tool Part, another apparatus is needed")
					.colored(PonderPalette.MEDIUM)
					.placeNearTarget()
					.independent(87);
				scene.idle(100);
				scene.rotateCameraY(-130);
				scene.idle(30);
				scene.world.showSection(aethTF, Facing.DOWN);
				scene.idle(10);
				scene.text(80, "The Aetherium Tool Forge merges together multiple parts to create a new Tool", util.vector.centerOf(aethTF).subtract(0, 0.25, 0))
					.placeNearTarget()
					.attachKeyFrame();
				scene.idle(40);
				scene.text(60, "The heat has to be close to maximum in order to function")
					.placeNearTarget()
					.colored(PonderPalette.MEDIUM)
					.independent(107);
				scene.idle(80);
				scene.overlay.showOutline(PonderPalette.GREEN, new Object(), nixieTube, 4);
				nixieStrengthAnimate(scene, 14, 15, 2, true);
				scene.idle(10);
				scene.text(60, "Place the Tool Parts in the designated input slot")
					.placeNearTarget()
					.colored(PonderPalette.MEDIUM)
					.independent(107);
				scene.idle(30);
				scene.showControls(10, util.vector.centerOf(aethTF).subtract(0, 0.25, 0), "down").rightClick().withItem("aetherworks:tool_rod_infused");
				scene.idle(5);
				scene.world.modifyBlockEntityNBT(aethTF, (nbt) => {
					nbt.has_ember = 1;
					nbt.has_heat = 1;
					nbt.inventory = {
						Size: 6,
						Items: [
							{
								Slot: 3,
								id: "aetherworks:tool_rod_infused",
								Count: 1
							}
						]
					};
				});
				scene.idle(30);
				scene.showControls(10, util.vector.centerOf(aethTF).subtract(0, 0.25, 0), "down").rightClick().withItem("aetherworks:aether_pearl");
				scene.idle(5);
				scene.world.modifyBlockEntityNBT(aethTF, (nbt) => {
					nbt.has_ember = 1;
					nbt.has_heat = 1;
					nbt.inventory = {
						Size: 6,
						Items: [
							{
								Slot: 3,
								id: "aetherworks:tool_rod_infused",
								Count: 1
							},
							{
								Slot: 2,
								id: "aetherworks:aether_pearl",
								Count: 1
							}
						]
					};
				});
				scene.idle(30);
				scene.showControls(10, util.vector.centerOf(aethTF).subtract(0, 0.25, 0), "down").rightClick().withItem("aetherworks:pickaxe_head_aether");
				scene.idle(5);
				scene.world.modifyBlockEntityNBT(aethTF, (nbt) => {
					nbt.progress = 0;
					nbt.has_ember = 1;
					nbt.has_heat = 1;
					nbt.inventory = {
						Size: 6,
						Items: [
							{
								Slot: 3,
								id: "aetherworks:tool_rod_infused",
								Count: 1
							},
							{
								Slot: 2,
								id: "aetherworks:aether_pearl",
								Count: 1
							},
							{
								Slot: 1,
								id: "aetherworks:pickaxe_head_aether",
								Count: 1
							}
						]
					};
				});
				scene.idle(30);
				scene.text(80, "When both Heat and Ember are present, strike it with the Hammer multiple times", util.vector.centerOf(aethTF).subtract(0, 0.25, 0))
					.placeNearTarget();
				scene.idle(100);
				simulateHitTF(scene, true);
				scene.idle(40);
				scene.text(80, "Lastly, pay attention to not go beyond the Heat Limit of 3000 or else...")
					.placeNearTarget()
					.colored(PonderPalette.RED)
					.independent(60)
					.attachKeyFrame();
				scene.idle(100);
				makeBoom(scene);
			});
});