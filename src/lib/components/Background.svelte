<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	type BasicSphere = import('three').Mesh<
		import('three').SphereGeometry,
		import('three').MeshBasicMaterial
	>;
	type WaterClass = typeof import('three/addons/objects/Water.js').Water;

	// All Three.js references — only assigned inside init() (client only)
	let THREE: typeof import('three');
	let scene: import('three').Scene;
	let camera: import('three').PerspectiveCamera;
	let renderer: import('three').WebGLRenderer;
	let water: import('three/addons/objects/Water.js').Water;
	let clock: import('three').Clock;

	let starsGroup: import('three').Group;
	let moonMesh: BasicSphere;
	let moonGlowMesh: import('three').Sprite;
	let moonLight: import('three').DirectionalLight;
	let nightAmbient: import('three').AmbientLight;

	let skyMaterial: import('three').ShaderMaterial;

	let active = false;
	let animationFrame = 0;
	const cameraBaseY = 46;
	const cameraBaseZ = 255;
	const cameraLookY = 115;
	const cameraLookZ = -950;
	const waterTimeStep = 0.011;

	async function init(canvas: HTMLCanvasElement) {
		// Dynamic import — only runs on the client
		THREE = await import('three');
		const { Water } = await import('three/addons/objects/Water.js');

		if (!active) return;

		clock = new THREE.Clock();

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x3b4448, 560, 6200);

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
		camera.position.set(0, cameraBaseY, cameraBaseZ);
		camera.lookAt(0, cameraLookY, cameraLookZ);

		renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.08;

		createSky();
		createStars();
		createMoon();
		createOcean(Water);

		window.addEventListener('resize', onWindowResize);

		animate();
	}

	function createSky() {
		const skyGeometry = new THREE.SphereGeometry(9000, 32, 32);
		skyMaterial = new THREE.ShaderMaterial({
			side: THREE.BackSide,
			uniforms: {
				topColor: { value: new THREE.Color(0x1a2026) },
				bottomColor: { value: new THREE.Color(0x3a4247) },
				offset: { value: 400 },
				exponent: { value: 0.82 }
			},
			vertexShader: `
				varying vec3 vWorldPosition;
				void main() {
					vec4 worldPosition = modelMatrix * vec4(position, 1.0);
					vWorldPosition = worldPosition.xyz;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				uniform vec3 topColor;
				uniform vec3 bottomColor;
				uniform float offset;
				uniform float exponent;
				varying vec3 vWorldPosition;
				void main() {
					float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
					gl_FragColor = vec4(
						mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)),
						1.0
					);
				}
			`
		});
		scene.add(new THREE.Mesh(skyGeometry, skyMaterial));
	}

	function createStars() {
		const radius = 6500;
		const goldenAngle = Math.PI * (3 - Math.sqrt(5));
		const moonDirection = new THREE.Vector3(650, 560, -1100).normalize();
		const moonTangent = new THREE.Vector3().crossVectors(moonDirection, new THREE.Vector3(0, 1, 0));
		if (moonTangent.lengthSq() < 0.001) moonTangent.set(1, 0, 0);
		moonTangent.normalize();
		const moonBitangent = new THREE.Vector3().crossVectors(moonDirection, moonTangent).normalize();

		function seeded(index: number, salt: number) {
			const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
			return value - Math.floor(value);
		}

		function addStar(
			positions: number[],
			colors: number[],
			direction: import('three').Vector3,
			brightness: number,
			warmth: number
		) {
			positions.push(direction.x * radius, direction.y * radius, direction.z * radius);
			colors.push(
				THREE.MathUtils.clamp(brightness + warmth, 0, 1),
				THREE.MathUtils.clamp(brightness, 0, 1),
				THREE.MathUtils.clamp(brightness - warmth * 0.5, 0, 1)
			);
		}

		function makeStarMaterial(size: number) {
			return new THREE.ShaderMaterial({
				uniforms: {
					size: { value: size },
					time: { value: 0 }
				},
				transparent: true,
				depthWrite: false,
				vertexShader: `
					attribute vec3 color;
					uniform float size;
					uniform float time;
					varying vec3 vColor;
					varying float vTwinkle;

					float random(vec3 value) {
						return fract(sin(dot(value, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
					}

					void main() {
						float seed = random(position);
						vColor = color;
						vTwinkle = 0.68 + 0.32 * sin(time * (0.7 + seed * 1.7) + seed * 6.2831853);
						gl_PointSize = size;
						gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
					}
				`,
				fragmentShader: `
					varying vec3 vColor;
					varying float vTwinkle;

					void main() {
						float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
						float alpha = smoothstep(0.5, 0.18, distanceFromCenter) * vTwinkle;
						gl_FragColor = vec4(vColor * vTwinkle, alpha);
					}
				`
			});
		}

		function makeStarLayer(count: number, size: number, minY: number, maxBrightness: number) {
			const positions: number[] = [];
			const colors: number[] = [];
			for (let i = 0; i < count; i++) {
				const theta = i * goldenAngle + seeded(i, 1) * 0.18;
				const normalizedY = minY + ((i + seeded(i, 2)) / count) * (1 - minY);
				const horizontalRadius = Math.sqrt(1 - normalizedY * normalizedY);
				const direction = new THREE.Vector3(
					Math.cos(theta) * horizontalRadius,
					normalizedY,
					Math.sin(theta) * horizontalRadius
				);
				const horizonFade = THREE.MathUtils.smoothstep(normalizedY, 0.03, 0.22);
				const brightness = THREE.MathUtils.lerp(0.66, maxBrightness, seeded(i, 3)) * horizonFade;
				const warmth = THREE.MathUtils.lerp(-0.08, 0.08, seeded(i, 4));
				addStar(positions, colors, direction, brightness, warmth);
			}
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
			geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			return new THREE.Points(geometry, makeStarMaterial(size));
		}

		function makeMoonFillLayer(count: number, size: number) {
			const positions: number[] = [];
			const colors: number[] = [];
			for (let i = 0; i < count; i++) {
				const theta = i * goldenAngle;
				const distance = 0.018 + Math.sqrt((i + seeded(i, 5)) / count) * 0.58;
				const direction = moonDirection
					.clone()
					.addScaledVector(moonTangent, Math.cos(theta) * distance)
					.addScaledVector(moonBitangent, Math.sin(theta) * distance)
					.normalize();
				const brightness = THREE.MathUtils.lerp(0.74, 1.0, seeded(i, 6));
				const warmth = THREE.MathUtils.lerp(-0.05, 0.06, seeded(i, 7));
				addStar(positions, colors, direction, brightness, warmth);
			}
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
			geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			return new THREE.Points(geometry, makeStarMaterial(size));
		}
		starsGroup = new THREE.Group();
		starsGroup.add(makeStarLayer(4300, 2.05, 0.005, 1.0));
		starsGroup.add(makeStarLayer(760, 3.0, 0.035, 1.0));
		starsGroup.add(makeMoonFillLayer(520, 2.45));
		scene.add(starsGroup);
	}

	function createGlowTexture(rgbaPrefix: string) {
		const canvas = document.createElement('canvas');
		canvas.width = 256;
		canvas.height = 256;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
		gradient.addColorStop(0, `${rgbaPrefix}, 1.0)`);
		gradient.addColorStop(0.15, `${rgbaPrefix}, 0.7)`);
		gradient.addColorStop(0.4, `${rgbaPrefix}, 0.2)`);
		gradient.addColorStop(1, `${rgbaPrefix}, 0.0)`);

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 256, 256);

		return new THREE.CanvasTexture(canvas);
	}

	function createMoon() {
		const moonGeo = new THREE.SphereGeometry(32, 32, 32);
		const moonMat = new THREE.MeshBasicMaterial({
			color: 0xdbeafe,
			transparent: true,
			opacity: 0.68
		});
		moonMesh = new THREE.Mesh(moonGeo, moonMat);
		moonMesh.position.set(650, 560, -1100);
		scene.add(moonMesh);

		const glowTexture = createGlowTexture('rgba(147, 197, 253');
		if (glowTexture) {
			const glowMat = new THREE.SpriteMaterial({
				map: glowTexture,
				transparent: true,
				opacity: 0.12,
				blending: THREE.AdditiveBlending
			});
			moonGlowMesh = new THREE.Sprite(glowMat);
			moonGlowMesh.position.copy(moonMesh.position);
			moonGlowMesh.scale.set(260, 260, 1);
			scene.add(moonGlowMesh);
		}

		moonLight = new THREE.DirectionalLight(0x9dbfff, 1.7);
		moonLight.position.copy(moonMesh.position);
		scene.add(moonLight);

		nightAmbient = new THREE.AmbientLight(0x789bd8, 0.62);
		scene.add(nightAmbient);
	}

	function createOcean(Water: WaterClass) {
		const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
		const sunDir = new THREE.Vector3(650, 560, -1100).normalize();
		const waterNormals = new THREE.TextureLoader().load(
			'https://threejs.org/examples/textures/waternormals.jpg',
			function (texture: import('three').Texture) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(3.2, 3.2);
				texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
			}
		);
		water = new Water(waterGeometry, {
			textureWidth: 2048,
			textureHeight: 2048,
			waterNormals,
			sunDirection: sunDir,
			sunColor: 0xd6dde8,
			waterColor: 0x142832,
			distortionScale: 6.4,
			fog: true
		});
		water.rotation.x = -Math.PI / 2;
		water.position.y = 0;
		scene.add(water);
	}

	function animate() {
		if (!active) return;
		animationFrame = requestAnimationFrame(animate);

		const elapsed = clock.getElapsedTime();

		if (water) water.material.uniforms['time'].value += waterTimeStep;
		if (starsGroup) {
			starsGroup.children.forEach((child) => {
				if (child instanceof THREE.Points && child.material instanceof THREE.ShaderMaterial) {
					child.material.uniforms.time.value = elapsed;
				}
			});
		}

		if (camera) {
			camera.position.y = cameraBaseY + Math.sin(elapsed * 0.5) * 1.4;
			camera.position.z = cameraBaseZ;
			camera.lookAt(0, cameraLookY, cameraLookZ);
		}
		if (renderer) renderer.render(scene, camera);
	}

	function onWindowResize() {
		if (camera && renderer) {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}

	const backgroundCanvas: Attachment<HTMLCanvasElement> = (canvas) => {
		active = true;
		init(canvas);

		return () => {
			active = false;
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('resize', onWindowResize);
			if (renderer) renderer.dispose();
		};
	};
</script>

<canvas {@attach backgroundCanvas} class="fixed inset-0 z-0 h-[100dvh] w-full bg-transparent"
></canvas>
