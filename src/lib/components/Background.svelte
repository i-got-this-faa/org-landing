<script lang="ts">
	import { onMount } from 'svelte';

	let { isDarkMode = true }: { isDarkMode: boolean } = $props();

	let canvasContainer: HTMLDivElement;

	// All Three.js references — only assigned inside init() (client only)
	let THREE: typeof import('three');
	let scene: import('three').Scene;
	let camera: import('three').PerspectiveCamera;
	let renderer: import('three').WebGLRenderer;
	let water: any; // Water type from addons
	let clock: import('three').Clock;

	let starsGroup: import('three').Group;
	let moonMesh: import('three').Mesh;
	let moonGlowMesh: any;
	let moonLight: import('three').DirectionalLight;
	let nightAmbient: import('three').AmbientLight;

	let sunMesh: import('three').Mesh;
	let sunGlowMesh: any;
	let sunLight: import('three').DirectionalLight;
	let dayAmbient: import('three').AmbientLight;

	let cloudsGroup: import('three').Group;
	let skyMaterial: import('three').ShaderMaterial;

	// Smooth transition state
	let transitionProgress = 0; // 0 = full night, 1 = full day
	let targetProgress = 0;
	const LERP_FACTOR = 0.035; // smooth ease-out per frame

	// Color targets — created inside init()
	let nightSkyTop: import('three').Color;
	let nightSkyBottom: import('three').Color;
	let daySkyTop: import('three').Color;
	let daySkyBottom: import('three').Color;
	let nightWaterColor: import('three').Color;
	let dayWaterColor: import('three').Color;
	let nightSunColor: import('three').Color;
	let daySunColor: import('three').Color;
	let nightSunDir: import('three').Vector3;
	let daySunDir: import('three').Vector3;

	// Temp objects for lerping — created inside init()
	let _tmpTop: import('three').Color;
	let _tmpBottom: import('three').Color;
	let _tmpWater: import('three').Color;
	let _tmpSun: import('three').Color;
	let _tmpDir: import('three').Vector3;

	let initialized = $state(false);

	async function init() {
		// Dynamic import — only runs on the client
		THREE = await import('three');
		const { Water } = await import('three/addons/objects/Water.js');

		// Create color/vector targets now that THREE is loaded
		nightSkyTop = new THREE.Color(0x020617);
		nightSkyBottom = new THREE.Color(0x0f172a);
		daySkyTop = new THREE.Color(0x1e6aca);
		daySkyBottom = new THREE.Color(0x7ab8f5);
		nightWaterColor = new THREE.Color(0x001e3c);
		dayWaterColor = new THREE.Color(0x0369a1);
		nightSunColor = new THREE.Color(0x9dbfff);
		daySunColor = new THREE.Color(0xfdf4e3);
		nightSunDir = new THREE.Vector3(-200, 150, -1200).normalize();
		daySunDir = new THREE.Vector3(200, 150, -1200).normalize();
		_tmpTop = new THREE.Color();
		_tmpBottom = new THREE.Color();
		_tmpWater = new THREE.Color();
		_tmpSun = new THREE.Color();
		_tmpDir = new THREE.Vector3();

		clock = new THREE.Clock();

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
		camera.position.set(0, 80, 220);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 0.6;

		canvasContainer.appendChild(renderer.domElement);

		createSky();
		createStars();
		createMoon();
		createSun();
		createClouds();
		createOcean(Water);

		// Set initial state instantly (no transition on first load)
		transitionProgress = isDarkMode ? 0 : 1;
		targetProgress = transitionProgress;
		applyTransition(transitionProgress);

		window.addEventListener('resize', onWindowResize);
		initialized = true;

		animate();
	}

	function createSky() {
		const skyGeometry = new THREE.SphereGeometry(9000, 32, 32);
		skyMaterial = new THREE.ShaderMaterial({
			side: THREE.BackSide,
			uniforms: {
				topColor: { value: new THREE.Color(0x020617) },
				bottomColor: { value: new THREE.Color(0x0f172a) },
				offset: { value: 400 },
				exponent: { value: 0.7 }
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
		function makeStarLayer(count: number, size: number, minY: number, maxBrightness: number) {
			const positions: number[] = [];
			const colors: number[] = [];
			for (let i = 0; i < count; i++) {
				const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
				const normalizedY = THREE.MathUtils.randFloat(minY, 1);
				const horizontalRadius = Math.sqrt(1 - normalizedY * normalizedY);
				positions.push(
					Math.cos(theta) * horizontalRadius * radius,
					normalizedY * radius,
					Math.sin(theta) * horizontalRadius * radius
				);
				const horizonFade = THREE.MathUtils.smoothstep(normalizedY, 0.03, 0.22);
				const brightness = THREE.MathUtils.randFloat(0.25, maxBrightness) * horizonFade;
				const warmth = THREE.MathUtils.randFloat(-0.08, 0.08);
				colors.push(
					THREE.MathUtils.clamp(brightness + warmth, 0, 1),
					THREE.MathUtils.clamp(brightness, 0, 1),
					THREE.MathUtils.clamp(brightness - warmth * 0.5, 0, 1)
				);
			}
			const geometry = new THREE.BufferGeometry();
			geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
			geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
			return new THREE.Points(geometry, new THREE.PointsMaterial({
				size, sizeAttenuation: false, vertexColors: true,
				transparent: true, opacity: 0.9, depthWrite: false
			}));
		}
		starsGroup = new THREE.Group();
		starsGroup.add(makeStarLayer(1800, 1.15, 0.025, 0.7));
		starsGroup.add(makeStarLayer(180, 1.8, 0.08, 1.0));
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
		const moonGeo = new THREE.SphereGeometry(45, 32, 32);
		const moonMat = new THREE.MeshBasicMaterial({ color: 0xdbeafe, transparent: true });
		moonMesh = new THREE.Mesh(moonGeo, moonMat);
		moonMesh.position.set(-200, 150, -1200);
		scene.add(moonMesh);

		const glowTexture = createGlowTexture('rgba(147, 197, 253');
		if (glowTexture) {
			const glowMat = new THREE.SpriteMaterial({
				map: glowTexture,
				transparent: true,
				opacity: 0.18,
				blending: THREE.AdditiveBlending
			});
			moonGlowMesh = new THREE.Sprite(glowMat);
			moonGlowMesh.position.copy(moonMesh.position);
			moonGlowMesh.scale.set(300, 300, 1);
			scene.add(moonGlowMesh);
		}

		moonLight = new THREE.DirectionalLight(0x9dbfff, 1.8);
		moonLight.position.copy(moonMesh.position);
		scene.add(moonLight);

		nightAmbient = new THREE.AmbientLight(0x1e3a8a, 0.45);
		scene.add(nightAmbient);
	}

	function createSun() {
		const sunGeo = new THREE.SphereGeometry(65, 32, 32);
		const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb, transparent: true, opacity: 0 });
		sunMesh = new THREE.Mesh(sunGeo, sunMat);
		sunMesh.position.set(200, 150, -1200);
		scene.add(sunMesh);

		const glowTexture = createGlowTexture('rgba(254, 240, 138');
		if (glowTexture) {
			const glowMat = new THREE.SpriteMaterial({
				map: glowTexture,
				transparent: true,
				opacity: 0,
				blending: THREE.AdditiveBlending
			});
			sunGlowMesh = new THREE.Sprite(glowMat);
			sunGlowMesh.position.copy(sunMesh.position);
			sunGlowMesh.scale.set(650, 650, 1); // Large soft sun glow
			scene.add(sunGlowMesh);
		}

		sunLight = new THREE.DirectionalLight(0xfff4d6, 0);
		sunLight.position.copy(sunMesh.position);
		scene.add(sunLight);

		dayAmbient = new THREE.AmbientLight(0xffffff, 0);
		scene.add(dayAmbient);
	}

	function createCloudTexture() {
		const canvas = document.createElement('canvas');
		canvas.width = 128;
		canvas.height = 128;
		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
		gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
		gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
		gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 128, 128);

		return new THREE.CanvasTexture(canvas);
	}

	function createClouds() {
		cloudsGroup = new THREE.Group();
		const cloudTexture = createCloudTexture();
		if (!cloudTexture) return;

		// Create a single shared template material
		const cloudMat = new THREE.SpriteMaterial({
			map: cloudTexture,
			transparent: true,
			opacity: 0,
			depthWrite: false,
			blending: THREE.NormalBlending
		});

		for (let i = 0; i < 22; i++) {
			const cluster = new THREE.Group();
			const particles = 4 + Math.floor(Math.random() * 4);
			for (let j = 0; j < particles; j++) {
				const sprite = new THREE.Sprite(cloudMat.clone());
				const scaleX = Math.random() * 120 + 80;
				const scaleY = scaleX * (0.25 + Math.random() * 0.15); // flat cinematic clouds
				sprite.scale.set(scaleX, scaleY, 1);
				sprite.position.set(
					(Math.random() - 0.5) * 120,
					(Math.random() - 0.5) * 20,
					(Math.random() - 0.5) * 100
				);
				sprite.material.rotation = (Math.random() - 0.5) * 0.15;
				cluster.add(sprite);
			}
			cluster.position.set(
				(Math.random() - 0.5) * 5000,
				Math.random() * 250 + 150, // lower cloud deck for horizon depth
				-Math.random() * 2500 - 500
			);
			cloudsGroup.add(cluster);
		}
		scene.add(cloudsGroup);
	}

	function createOcean(Water: any) {
		const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
		const waterNormals = new THREE.TextureLoader().load(
			'https://threejs.org/examples/textures/waternormals.jpg',
			function (texture: any) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
			}
		);
		water = new Water(waterGeometry, {
			textureWidth: 1024,
			textureHeight: 1024,
			waterNormals: waterNormals,
			sunDirection: new THREE.Vector3(-1, 1, -1).normalize(),
			sunColor: 0x9dbfff,
			waterColor: 0x001e3c,
			distortionScale: 7,
			fog: true
		});
		water.rotation.x = -Math.PI / 2;
		water.position.y = 0;
		scene.add(water);
	}

	/** Smooth lerp-based transition. t=0 night, t=1 day */
	function applyTransition(t: number) {
		if (!skyMaterial || !water) return;
		const nightT = 1 - t;

		// Sky gradient
		_tmpTop.copy(nightSkyTop).lerp(daySkyTop, t);
		_tmpBottom.copy(nightSkyBottom).lerp(daySkyBottom, t);
		skyMaterial.uniforms.topColor.value.copy(_tmpTop);
		skyMaterial.uniforms.bottomColor.value.copy(_tmpBottom);

		// Water
		_tmpWater.copy(nightWaterColor).lerp(dayWaterColor, t);
		_tmpSun.copy(nightSunColor).lerp(daySunColor, t);
		water.material.uniforms.waterColor.value.copy(_tmpWater);
		water.material.uniforms.sunColor.value.copy(_tmpSun);
		_tmpDir.copy(nightSunDir).lerp(daySunDir, t).normalize();
		water.material.uniforms.sunDirection.value.copy(_tmpDir);

		// Tone mapping exposure: night=0.6, day=1.2
		renderer.toneMappingExposure = 0.6 + 0.6 * t;

		// Stars: fade opacity
		starsGroup.children.forEach(child => {
			if ((child as any).material) {
				(child as any).material.opacity = 0.9 * nightT;
			}
		});

		// Moon: fade
		(moonMesh.material as any).opacity = nightT;
		(moonGlowMesh.material as any).opacity = 0.18 * nightT;
		moonLight.intensity = 1.8 * nightT;
		nightAmbient.intensity = 0.45 * nightT;

		// Sun: fade in
		(sunMesh.material as any).opacity = t;
		(sunGlowMesh.material as any).opacity = 0.25 * t;
		sunLight.intensity = 2.5 * t;
		dayAmbient.intensity = 0.8 * t;

		// Clouds: fade opacity on each mesh material
		cloudsGroup.children.forEach(cluster => {
			cluster.children.forEach(child => {
				if ((child as any).material) {
					(child as any).material.opacity = 0.65 * t;
				}
			});
		});
	}

	function animate() {
		requestAnimationFrame(animate);

		const elapsed = clock.getElapsedTime();

		// Smooth transition interpolation (ease-out lerp every frame)
		if (Math.abs(transitionProgress - targetProgress) > 0.001) {
			transitionProgress += (targetProgress - transitionProgress) * LERP_FACTOR;
			applyTransition(transitionProgress);
		}

		if (water) water.material.uniforms['time'].value += 0.015;
		if (starsGroup) starsGroup.rotation.y += 0.00003;

		// Drift clouds
		if (cloudsGroup) {
			cloudsGroup.children.forEach(cluster => {
				cluster.position.x += 0.35;
				if (cluster.position.x > 2500) cluster.position.x = -2500;
			});
		}

		if (camera) {
			camera.position.y = 80 + Math.sin(elapsed * 0.5) * 2;
			camera.lookAt(0, 0, 0);
		}
		if (renderer && scene && camera) renderer.render(scene, camera);
	}

	function onWindowResize() {
		if (camera && renderer) {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}
	}

	$effect(() => {
		if (initialized) {
			targetProgress = isDarkMode ? 0 : 1;
		}
	});

	onMount(() => {
		init();
		return () => {
			window.removeEventListener('resize', onWindowResize);
			if (renderer) renderer.dispose();
		};
	});
</script>

<div bind:this={canvasContainer} class="fixed inset-0 z-0 h-[100dvh] w-full bg-transparent"></div>
