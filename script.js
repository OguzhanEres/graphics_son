import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';

// Global değişkenler
let scene, camera, renderer, controls;
let plane, sun, directionalLight, ambientLight;
let selectedModel = null;
const models = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const keys = { w: false, a: false, s: false, d: false };
const moveSpeed = 0.15; // Diğer modeller için
const walkingCharacterSpeed = 0.05; // Walking karakteri için yavaş hız
let loadedModels = 0;
const totalModels = 4; // 4 model olacak (deve dahil)

// Animasyon için yeni değişkenler
<<<<<<< HEAD
let mixer; // Hurricane_Kick için animasyon mixer'ı
let walkAction; // Hurricane_Kick yürüme animasyonu
let idleAction; // Durma animasyonu (varsa)

// Walking.fbx için animasyon değişkenleri
let walkingMixer; // Walking.fbx için animasyon mixer'ı
let walkingAction; // Walking.fbx yürüme animasyonu

=======
let mixer; // Animasyon mixer'ı
let walkAction; // Yürüme animasyonu
let idleAction; // Durma animasyonu (varsa)
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
const clock = new THREE.Clock(); // Zaman takibi için

// Deve gezintisi için değişkenler
let camelTourActive = false;
let camelTourStartTime = 0;
let originalCameraPosition = new THREE.Vector3();
let originalCameraTarget = new THREE.Vector3();
let camelTourDuration = 15000; // 15 saniye
let sandstormActive = false;

// Mezar bulmacası için değişkenler
let tombPuzzleActive = false;
let selectedSequence = [];
let correctSequence = ['sun', 'water', 'human', 'wisdom']; // Güneş, Su, İnsan, Bilgelik
let tombTourActive = false;
let tombTourStartTime = 0;
let tombTourDuration = 12000; // 12 saniye

<<<<<<< HEAD
// Gizli Oda Turu için yeni değişkenler
let hiddenChamberTourActive = false;
let hiddenChamberStartTime = 0;
let hiddenChamberDuration = 18000; // 18 saniye - daha uzun bir tur
let hiddenChamberScene = null;
let originalScene = null;
let chamberCameraPath = [];
let currentPathIndex = 0;
let chamberLights = [];
let sarcophagus = null;
let hieroglyphWalls = [];
let treasureChests = [];

// Gizli Oda Turu sahne verileri
const chamberData = {
    cameraPath: [
        { position: { x: 0, y: 3, z: 8 }, target: { x: 0, y: 1, z: 0 }, duration: 2000, description: "Gizli mezar girişine yaklaşıyorsunuz..." },
        { position: { x: 2, y: 2, z: 3 }, target: { x: 0, y: 1, z: -2 }, duration: 3000, description: "Duvarlar antik hiyerogliflerle kaplı..." },
        { position: { x: -3, y: 1.5, z: 1 }, target: { x: 0, y: 0.5, z: -3 }, duration: 4000, description: "Firavunun sandukası ortaya çıkıyor..." },
        { position: { x: 4, y: 2.5, z: -2 }, target: { x: -2, y: 1, z: -1 }, duration: 3000, description: "Değerli hazineler ve altın eşyalar..." },
        { position: { x: 0, y: 4, z: -5 }, target: { x: 0, y: 0, z: 0 }, duration: 4000, description: "Oda'nın tamamını görüyorsunuz..." },
        { position: { x: -1, y: 1, z: 2 }, target: { x: 0, y: 0.5, z: -3 }, duration: 2000, description: "Sandukaya yakından bakıyorsunuz..." }
    ],
    ambientData: {
        soundEffects: ['tomb_echo', 'ancient_whispers', 'treasure_shimmer'],
        lightIntensity: 0.15,
        torchPositions: [
            { x: -3, y: 2, z: -3 },
            { x: 3, y: 2, z: -3 },
            { x: -3, y: 2, z: 3 },
            { x: 3, y: 2, z: 3 }
        ]
    }
};

=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
// Hiyeroglif verileri
const hieroglyphData = {
    panel1: {
        symbol: "𓈖",
        title: "Su - Hayat Kaynağı",
        description: "Bu simge suyu temsil eder. Antik Mısır'da su, hayatın kaynağı olarak kutsal sayılırdı. Nil nehri sayesinde Mısır medeniyeti gelişmiştir.",
        question: "Bu hiyeroglif neyi temsil eder?",
        options: ["Su", "Ateş", "Toprak", "Hava"],
        correct: 0
    },
    panel2: {
        symbol: "𓅓",
        title: "Baykuş - Bilgelik",
        description: "Baykuş sembolü bilgeliği ve gece görüş yeteneğini temsil eder. Aynı zamanda 'M' harfinin karşılığıdır.",
        question: "Baykuş simgesi neyi temsil eder?",
        options: ["Güç", "Bilgelik", "Hız", "Cesaret"],
        correct: 1
    },
    panel3: {
        symbol: "𓂀",
        title: "İnsan - Toplum",
        description: "Bu simge insanı ve toplumsal düzeni temsil eder. Mısır hiyerogliflerinde insan figürü çok önemlidir.",
        question: "Bu sembol neyi ifade eder?",
        options: ["Hayvan", "Bitki", "İnsan", "Nesne"],
        correct: 2
    },
    panel4: {
        symbol: "𓊪",
        title: "Tahıl - Bereket",
        description: "Tahıl sembolü bereketi ve bolluk içinde yaşamı temsil eder. Mısır'ın tarım toplumu olmasının göstergesidir.",
        question: "Tahıl sembolü neyi temsil eder?",
        options: ["Savaş", "Barış", "Bereket", "Ölüm"],
        correct: 2
    },
    panel5: {
        symbol: "𓈙",
        title: "Güneş - Ra Tanrısı",
        description: "Güneş diski Ra tanrısını temsil eder. Antik Mısır'da en önemli tanrılardan biridir ve hayat enerjisinin kaynağıdır.",
        question: "Güneş diski hangi tanrıyı temsil eder?",
        options: ["Osiris", "Ra", "Anubis", "Isis"],
        correct: 1
    },
    panel6: {
        symbol: "𓆣",
        title: "Kartal - Güç ve Koruma",
        description: "Kartal sembolü gücü, korumayı ve kraliyet otoritesini temsil eder. Firavunların sembollerinde sıkça kullanılır.",
        question: "Kartal sembolü neyi temsil eder?",
        options: ["Zayıflık", "Güç", "Hastalık", "Yoksulluk"],
        correct: 1
    }
};

function init() {
    // Sahne oluştur
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    // Kamera oluştur
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 8, 8);
    
    // Renderer oluştur
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x87CEEB);
    document.getElementById('container').appendChild(renderer.domElement);
    
    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2.1;
    
    // Işıklar
    setupLighting();
    
    // Zemin oluştur
    createGround();
    
    // FBX modelleri yükle
    loadModels();
    
    // Event listeners
    setupEventListeners();
    
    // Animasyon başlat
    animate();
}

function setupLighting() {
<<<<<<< HEAD
    // Ambient light - models-showcase gibi daha parlak
    ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Hemisphere Light (gökyüzü ışığı) - models-showcase'ten alındı
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.4);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    
    // Ana kontrol edilebilir directional light (güneş)
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(5, 10, 5);
=======
    // Ambient light
    ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    // Directional light (güneş)
    directionalLight = new THREE.DirectionalLight(0xFFFFAA, 1.5);
    directionalLight.position.set(10, 25, 10);
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
<<<<<<< HEAD
    directionalLight.shadow.camera.far = 50;
=======
    directionalLight.shadow.camera.far = 100;
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);
    
<<<<<<< HEAD
    // Güneş görsel temsili - models-showcase gibi daha büyük
    const sunGeometry = new THREE.SphereGeometry(1, 16, 16);
=======
    // Güneş görsel temsili
    const sunGeometry = new THREE.SphereGeometry(0.5, 16, 16);
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFFF00
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.copy(directionalLight.position);
    scene.add(sun);
<<<<<<< HEAD
    
    // Directional light helper - görselleştirme için
    //const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
    //scene.add(dirLightHelper);
    
    // Ön taraftan yumuşak ışık - detayları daha iyi görmek için (models-showcase'ten)
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
    frontLight.position.set(0, 5, 15);
    scene.add(frontLight);
    
    // Otomatik dönen ışık parametreleri
    window.autoRotate = true;
    window.rotationSpeed = 1.0;
    window.lightRadius = 15;
    window.lightAngle = 0;
}

function createGround() {
    // Düzlem oluştur
    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 	0xcccc99,
        roughness: 0.8,
        metalness: 0.1
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);
    /*
    // Grid helper
    const gridHelper = new THREE.GridHelper(50, 50, 0x000000, 0x000000);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    */
=======
}

function createGround() {
    // Load FBX terrain instead of creating a simple plane
    const fbxLoader = new FBXLoader();
      fbxLoader.load(
        './uploads_files_3835558_untitled.fbx',
        (terrainObject) => {
            console.log('FBX Terrain loaded:', terrainObject);
            
            // Configure terrain properties
            terrainObject.position.set(0, 0, 0);
            terrainObject.receiveShadow = true;
            
            // Auto-scale terrain based on its size (optional adjustment)
            const box = new THREE.Box3().setFromObject(terrainObject);
            const size = box.getSize(new THREE.Vector3());
            console.log('Terrain size:', size);
            
            // If terrain is too small or too large, adjust scale
            const targetSize = 50; // Target terrain size
            const maxDimension = Math.max(size.x, size.z);
            if (maxDimension > 0) {
                const scale = targetSize / maxDimension;
                // Only scale if significantly different (avoid unnecessary scaling)
                if (scale < 0.5 || scale > 2.0) {
                    terrainObject.scale.set(scale, scale, scale);
                    console.log('Terrain scaled by factor:', scale);
                }
            }
            
            // Apply desert-like material to the terrain
            terrainObject.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                    child.castShadow = false; // Terrain typically doesn't cast shadows
                    
                    // Apply desert material
                    const desertMaterial = new THREE.MeshStandardMaterial({
                        color: 0xcccc99, // Sandy desert color
                        roughness: 0.8,
                        metalness: 0.1
                    });
                    child.material = desertMaterial;
                }
            });
            
            // Store reference for global access
            plane = terrainObject;
            scene.add(terrainObject);
            
            console.log('FBX terrain added to scene successfully');
        },
        (progress) => {
            console.log('Terrain loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
            console.error('Error loading FBX terrain:', error);
            console.log('Falling back to default plane terrain...');
            
            // Fallback to original plane if FBX fails to load
            const planeGeometry = new THREE.PlaneGeometry(50, 50);
            const planeMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xcccc99,
                roughness: 0.8,
                metalness: 0.1
            });
            plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -Math.PI / 2;
            plane.receiveShadow = true;
            scene.add(plane);
        }
    );
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
}

function loadModels() {
    const fbxLoader = new FBXLoader();
    const tdsLoader = new TDSLoader(); // 3DS dosyaları için
    
    // Statue model
    fbxLoader.load(
        './Statue_egypt1/fbxStatue.fbx',
        (object) => {
            console.log('Statue yüklendi:', object);
            object.position.set(-4, 0, 0);
            object.scale.set(0.5, 0.5, 0.5);
            
            // Gölgeleri etkinleştir
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.side = THREE.FrontSide;
                                if (mat.map) mat.map.flipY = false;
                            });
                        } else {
                            child.material.side = THREE.FrontSide;
                            if (child.material.map) child.material.map.flipY = false;
                        }
                    }
                }
            });
            
            object.name = 'Statue';
            scene.add(object);
            models.push(object);
            onModelLoaded();
        },
        (progress) => {
            console.log('Statue yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(0, progress.loaded / progress.total);
        },
        (error) => {
            console.error('Statue yüklenemedi:', error);
            addPlaceholderModel(-4, 0, 0, 'Statue', 0xff0000);
            onModelLoaded();
        }
    );
    
   
    fbxLoader.load(
        './Free_pyramid/fbxPyra.fbx',
        (object) => {
            console.log('Pyramid yüklendi:', object);
            object.position.set(4, 0, 0);
            object.scale.set(0.5, 0.5, 0.5);
            
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.side = THREE.FrontSide;
                                if (mat.map) mat.map.flipY = false;
                            });
                        } else {
                            child.material.side = THREE.FrontSide;
                            if (child.material.map) child.material.map.flipY = false;
                        }
                    }
                }
            });
            
            object.name = 'Pyramid';
            scene.add(object);
            models.push(object);
            onModelLoaded();
        },
        (progress) => {
            console.log('Pyramid yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(1, progress.loaded / progress.total);
        },
        (error) => {
            console.error('Pyramid yüklenemedi:', error);
            addPlaceholderModel(4, 0, 0, 'Pyramid', 0x00ff00);
            onModelLoaded();
        }
    );
      // Animasyonlu Walking model
    fbxLoader.load(
        './Hurricane_Kick.fbx',
        (object) => {
            console.log('Walking model yüklendi:', object);
            object.position.set(0, 0, -4);
            object.scale.set(0.05, 0.05, 0.05); // Boyutu ayarlayın
            
            // Gölgeleri etkinleştir
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.side = THREE.FrontSide;
                                if (mat.map) mat.map.flipY = false;
                            });
                        } else {
                            child.material.side = THREE.FrontSide;
                            if (child.material.map) child.material.map.flipY = false;
                        }
                    }
                }
            });
            
            // Animasyonları kontrol et
            if (object.animations && object.animations.length > 0) {
                console.log('Animasyonlar bulundu:', object.animations.length);
                
                // AnimationMixer oluştur
                mixer = new THREE.AnimationMixer(object);
                
                // Yürüme animasyonunu hazırla ama başlatma
                walkAction = mixer.clipAction(object.animations[0]);
                walkAction.setLoop(THREE.LoopRepeat);
                
                // Animasyonu durdur
                walkAction.stop();
                
                console.log('Animasyon hazırlandı:', object.animations[0].name);
            } else {
                console.log('Bu modelde animasyon bulunamadı');
            }
            
            object.name = 'WalkingCharacter';
            scene.add(object);
            models.push(object);
            onModelLoaded();
        },
        (progress) => {
            console.log('Walking model yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(2, progress.loaded / progress.total);
        },
        (error) => {
            console.error('Walking model yüklenemedi:', error);
            addPlaceholderModel(0, 0, -4, 'WalkingCharacter', 0x0000ff);
            onModelLoaded();
        }
<<<<<<< HEAD
    );      // Walking model 2
    fbxLoader.load(
        './Walking.fbx',
        (object) => {
            console.log('Walking model 2 yüklendi:', object);
=======
    );
    
    // Deve model (Walking.fbx'i deve olarak kullan)
    fbxLoader.load(
        './Walking.fbx',
        (object) => {
            console.log('Deve modeli yüklendi:', object);
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
            object.position.set(-8, 0, 8);
            object.scale.set(0.03, 0.03, 0.03);
            object.rotation.y = Math.PI / 4; // 45 derece döndür
            
            // Gölgeleri etkinleştir
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                mat.side = THREE.FrontSide;
                                if (mat.map) mat.map.flipY = false;
<<<<<<< HEAD
=======
                                // Deve rengini kahverengi yap
                                mat.color = new THREE.Color(0x8B4513);
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
                            });
                        } else {
                            child.material.side = THREE.FrontSide;
                            if (child.material.map) child.material.map.flipY = false;
<<<<<<< HEAD
=======
                            child.material.color = new THREE.Color(0x8B4513);
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
                        }
                    }
                }
            });
            
<<<<<<< HEAD
            // Animasyonları kontrol et
            if (object.animations && object.animations.length > 0) {
                console.log('Walking model 2 animasyonları bulundu:', object.animations.length);
                
                // AnimationMixer oluştur
                walkingMixer = new THREE.AnimationMixer(object);
                
                // Yürüme animasyonunu hazırla ama başlatma
                walkingAction = walkingMixer.clipAction(object.animations[0]);
                walkingAction.setLoop(THREE.LoopRepeat);
                
                // Animasyonu durdur
                walkingAction.stop();
                
                console.log('Walking model 2 animasyon hazırlandı:', object.animations[0].name);
            } else {
                console.log('Walking model 2 animasyon bulunamadı');
            }
            
            object.name = 'WalkingModel';
=======
            object.name = 'Camel';
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
            scene.add(object);
            models.push(object);
            onModelLoaded();
        },
        (progress) => {
<<<<<<< HEAD
            console.log('Walking model 2 yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(3, progress.loaded / progress.total);
        },
        (error) => {
            console.error('Walking model 2 yüklenemedi:', error);
            addPlaceholderModel(-8, 0, 8, 'WalkingModel', 0xFFAA00);
=======
            console.log('Deve modeli yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(3, progress.loaded / progress.total);
        },
        (error) => {
            console.error('Deve modeli yüklenemedi:', error);
            addPlaceholderModel(-8, 0, 8, 'Camel', 0xFFAA00);
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
            onModelLoaded();
        }
    );
}

function addPlaceholderModel(x, y, z, name, color) {
    let geometry;
    if (name === 'Pyramid') {
        geometry = new THREE.ConeGeometry(1, 2, 4);
    } else {
        geometry = new THREE.BoxGeometry(1, 2, 1);
    }
    
    const material = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + 1, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = name;
    
    scene.add(mesh);
    models.push(mesh);
}

function updateLoadingProgress(modelIndex, progress) {
    const totalProgress = ((loadedModels + progress) / totalModels) * 100;
    document.getElementById('loadingProgress').textContent = Math.round(totalProgress) + '%';
}

function onModelLoaded() {
    loadedModels++;
    if (loadedModels >= totalModels) {
        document.getElementById('loading').style.display = 'none';
        console.log('Tüm modeller yüklendi!');
    }
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    setupSunControls();
<<<<<<< HEAD
    setupChamberLightControls();
=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    setupHieroglyphPanels();
    setupTombPuzzle();
}

<<<<<<< HEAD
// Mezar bulmaca sistem kurulumu
function setupTombPuzzle() {
    // Mezar bulmacası etkileşimini ayarla
    setupTombPuzzleInteraction();
    
    console.log('Mezar bulmaca sistemi kuruldu');
}

=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
function setupSunControls() {
    const controls = ['sunX', 'sunY', 'sunZ', 'lightIntensity'];
    
    controls.forEach(id => {
        const slider = document.getElementById(id);
        const valueInput = document.getElementById(id + 'Value');
        
        if (slider && valueInput) {
            slider.addEventListener('input', () => {
                valueInput.value = slider.value;
                updateSunPosition();
            });
            
            valueInput.addEventListener('input', () => {
                slider.value = valueInput.value;
                updateSunPosition();
            });
        }
    });
}

function updateSunPosition() {
    const x = parseFloat(document.getElementById('sunX').value);
    const y = parseFloat(document.getElementById('sunY').value);
    const z = parseFloat(document.getElementById('sunZ').value);
    const intensity = parseFloat(document.getElementById('lightIntensity').value);
    
    directionalLight.position.set(x, y, z);
    directionalLight.intensity = intensity;
    sun.position.copy(directionalLight.position);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
    if (event.button !== 0) return;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(models, true);
    
    if (intersects.length > 0) {
        let clickedObject = intersects[0].object;
        
        while (clickedObject.parent && !models.includes(clickedObject)) {
            clickedObject = clickedObject.parent;
        }
<<<<<<< HEAD
          // Piramide tıklanma kontrolü - Mezar bulmacasını aç (gizli oda modunda değilse)
        if (clickedObject.name === 'Pyramid' || clickedObject.name === 'pyramid') {
            // Gizli oda turu aktifse mezar bulmacasını gösterme
            if (!hiddenChamberTourActive) {
                showTombPuzzle();
            }
            return; // Piramide tıklandığında model seçimi yapma
        }
          if (selectedModel) {
=======
          // Deve tıklandığında gezintiyi başlat
        if (clickedObject.name === 'Camel') {
            if (!camelTourActive) {
                startCamelTour();
            }
            return;
        }
        
        // Piramit tıklandığında mezar bulmacasını aç
        if (clickedObject.name === 'Pyramid') {
            if (!tombPuzzleActive) {
                showTombPuzzle();
            }
            return;
        }
        
        if (selectedModel) {
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
            // Önceki model seçimi kaldırılırken animasyonu durdur
            if (selectedModel.name === 'WalkingCharacter' && walkAction) {
                walkAction.stop();
            }
<<<<<<< HEAD
            if (selectedModel.name === 'WalkingModel' && walkingAction) {
                walkingAction.stop();
            }
=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
            deselectModel(selectedModel);
        }
        
        if (models.includes(clickedObject)) {
            selectedModel = clickedObject;
            selectModel(selectedModel);
            document.getElementById('selectedModel').textContent = `Seçili Model: ${selectedModel.name}`;
            updateCharacterStatus();
        }
    } else {
        if (selectedModel) {
            // Model seçimi kaldırılırken animasyonu durdur
            if (selectedModel.name === 'WalkingCharacter' && walkAction) {
                walkAction.stop();
            }
            deselectModel(selectedModel);
            selectedModel = null;
            document.getElementById('selectedModel').textContent = 'Seçili Model: Yok';
            updateCharacterStatus();
        }
    }
}

function selectModel(model) {
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    if (mat.emissive) mat.emissive.setHex(0x444444);
                });
            } else {
                if (child.material.emissive) child.material.emissive.setHex(0x444444);
            }
        }
    });
}

function deselectModel(model) {
    model.traverse((child) => {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    if (mat.emissive) mat.emissive.setHex(0x000000);
                });
            } else {
                if (child.material.emissive) child.material.emissive.setHex(0x000000);
            }
        }
    });
}

function onKeyDown(event) {
    const key = event.key.toLowerCase();
<<<<<<< HEAD
    
    // ESC tuşu ile gizli odadan çık
    if (event.key === 'Escape' && hiddenChamberTourActive) {
        stopHiddenChamberTour();
        return;
    }
    
=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    if (keys.hasOwnProperty(key)) {
        keys[key] = true;
        event.preventDefault();
        updateCharacterStatus();
    }
}

function onKeyUp(event) {
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = false;
        event.preventDefault();
        updateCharacterStatus();
    }
}

function updateCharacterStatus() {
    const statusElement = document.getElementById('characterStatus');
    if (statusElement) {
        if (selectedModel && selectedModel.name === 'WalkingCharacter') {
            if (keys.w || keys.a || keys.s || keys.d) {
                statusElement.textContent = 'Karakter: Yürüyor';
            } else {
                statusElement.textContent = 'Karakter: Duruyor';
            }
        } else {
            statusElement.textContent = 'Karakter: Seçili Değil';
        }
    }
}

function updateSelectedModel() {
    if (!selectedModel) return;
    
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(camera.up, cameraDirection).normalize();
    
    const moveVector = new THREE.Vector3();
    
    if (keys.w) moveVector.add(cameraDirection.clone().multiplyScalar(-1));
    if (keys.s) moveVector.add(cameraDirection);
    if (keys.a) moveVector.add(cameraRight.clone().multiplyScalar(-1));
    if (keys.d) moveVector.add(cameraRight);
<<<<<<< HEAD
      // Seçili model WalkingCharacter ise animasyon kontrolü yap
=======
    
    // Seçili model WalkingCharacter ise animasyon kontrolü yap
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    if (selectedModel.name === 'WalkingCharacter' && walkAction) {
        const isMoving = keys.w || keys.s || keys.a || keys.d;
        
        if (isMoving && !walkAction.isRunning()) {
            // Hareket başladığında animasyonu oynat
            walkAction.reset();
            walkAction.play();
            console.log('Yürüme animasyonu başlatıldı');
        } else if (!isMoving && walkAction.isRunning()) {
            // Hareket durduğunda animasyonu durdur
            walkAction.stop();
            console.log('Yürüme animasyonu durduruldu');
        }
    }
    
<<<<<<< HEAD
    // Seçili model WalkingModel ise animasyon kontrolü yap
    if (selectedModel.name === 'WalkingModel' && walkingAction) {
        const isMoving = keys.w || keys.s || keys.a || keys.d;
        
        if (isMoving && !walkingAction.isRunning()) {
            // Hareket başladığında animasyonu oynat
            walkingAction.reset();
            walkingAction.play();
            console.log('Walking model 2 animasyonu başlatıldı');
        } else if (!isMoving && walkingAction.isRunning()) {
            // Hareket durduğunda animasyonu durdur
            walkingAction.stop();
            console.log('Walking model 2 animasyonu durduruldu');
        }
    }
    
=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    // Sadece hareket tuşları basılıysa modeli hareket ettir
    if (keys.w || keys.s || keys.a || keys.d) {
        moveVector.y = 0;
        moveVector.normalize();
        
        // Walking karakteri için özel yavaş hız kullan
        const currentSpeed = selectedModel.name === 'WalkingCharacter' ? walkingCharacterSpeed : moveSpeed;
        moveVector.multiplyScalar(currentSpeed);
        
        selectedModel.position.add(moveVector);
        
        const maxDistance = 23;
        selectedModel.position.x = Math.max(-maxDistance, Math.min(maxDistance, selectedModel.position.x));
        selectedModel.position.z = Math.max(-maxDistance, Math.min(maxDistance, selectedModel.position.z));
    }
}

function animate() {
    requestAnimationFrame(animate);
    
<<<<<<< HEAD
    // Animasyon mixer'larını güncelle
=======
    // Animasyon mixer'ını güncelle
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }
<<<<<<< HEAD
    if (walkingMixer) {
        walkingMixer.update(delta);
    }
    
    // Otomatik dönen ışık sistemini güncelle
    updateLightPosition();
    
    // Deve gezintisi animasyonu
=======
      // Deve gezintisi animasyonu
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    if (camelTourActive) {
        updateCamelTour();
    }
    
    // Mezar turu animasyonu
    if (tombTourActive) {
        updateTombTour();
    }
    
<<<<<<< HEAD
    // Gizli oda için sadece alev animasyonu (otomatik tur kaldırıldı)
    if (hiddenChamberTourActive) {
        animateFlames();
    }
      controls.update();
=======
    controls.update();
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    updateSelectedModel();
    renderer.render(scene, camera);
}

<<<<<<< HEAD
// Otomatik dönen ışık pozisyonu güncellemesi
function updateLightPosition() {
    if (window.autoRotate) {
        window.lightAngle += 0.01 * window.rotationSpeed;
        
        // Directional light pozisyonunu dairesel yolda güncelle
        directionalLight.position.x = Math.sin(window.lightAngle) * window.lightRadius;
        directionalLight.position.z = Math.cos(window.lightAngle) * window.lightRadius;
        
        // Güneş görsel temsilini de güncelle
        sun.position.copy(directionalLight.position);
    }
}

=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
// Hiyeroglif panelleri için event listener'ları ayarla
function setupHieroglyphPanels() {
    const panels = document.querySelectorAll('.hieroglyph-panel');
    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            const panelId = panel.id;
            showHieroglyphInfo(panelId);
        });
    });
}

// Hiyeroglif bilgi panelini göster
function showHieroglyphInfo(panelId) {
    const data = hieroglyphData[panelId];
    if (!data) return;
    
    document.getElementById('hieroglyphTitle').textContent = data.title;
    document.getElementById('hieroglyphDescription').textContent = data.description;
    
    // Bulmaca seçeneklerini oluştur
    const optionsContainer = document.getElementById('puzzleOptions');
    optionsContainer.innerHTML = '';
    
    data.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'puzzle-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => checkPuzzleAnswer(index, data.correct, optionDiv);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Sonuç metnini temizle
    document.getElementById('puzzleResult').textContent = '';
    
    // Paneli göster
    document.getElementById('hieroglyphInfo').style.display = 'block';
}

// Bulmaca cevabını kontrol et
function checkPuzzleAnswer(selectedIndex, correctIndex, selectedElement) {
    const resultElement = document.getElementById('puzzleResult');
    const options = document.querySelectorAll('.puzzle-option');
    
    // Tüm seçenekleri devre dışı bırak
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    if (selectedIndex === correctIndex) {
        selectedElement.classList.add('correct');
        resultElement.textContent = '🎉 Doğru! Tebrikler!';
        resultElement.style.color = '#00ff00';
    } else {
        selectedElement.classList.add('wrong');
        options[correctIndex].classList.add('correct');
        resultElement.textContent = '❌ Yanlış. Doğru cevap işaretlendi.';
        resultElement.style.color = '#ff6666';
    }
}

// Hiyeroglif panelini kapat
function closeHieroglyphInfo() {
    document.getElementById('hieroglyphInfo').style.display = 'none';
}

// Deve gezintisini başlat
function startCamelTour() {
    if (camelTourActive) return;
    
    camelTourActive = true;
    camelTourStartTime = Date.now();
    
    // Orijinal kamera pozisyonunu kaydet
    originalCameraPosition.copy(camera.position);
    originalCameraTarget.copy(controls.target);
    
    // Kontrolleri devre dışı bırak
    controls.enabled = false;
    
    // Butonları güncelle
    document.getElementById('startCamelTour').disabled = true;
    document.getElementById('stopCamelTour').disabled = false;
    
    // Kum fırtınasını başlat
    setTimeout(() => {
        startSandstorm();
    }, 3000); // 3 saniye sonra kum fırtınası başlar
    
    console.log('Deve gezintisi başladı!');
}

// Deve gezintisini durdur
function stopCamelTour() {
    if (!camelTourActive) return;
    
    camelTourActive = false;
    
    // Kamera kontrollerini geri etkinleştir
    controls.enabled = true;
    
    // Kamera pozisyonunu orijinal haline yakın bir konuma getir
    camera.position.copy(originalCameraPosition);
    controls.target.copy(originalCameraTarget);
    controls.update();
    
    // Kum fırtınasını durdur
    stopSandstorm();
    
    // Butonları güncelle
    document.getElementById('startCamelTour').disabled = false;
    document.getElementById('stopCamelTour').disabled = true;
    
    console.log('Deve gezintisi durduruldu!');
}

// Deve gezintisi animasyonunu güncelle
function updateCamelTour() {
    const elapsed = Date.now() - camelTourStartTime;
    const progress = Math.min(elapsed / camelTourDuration, 1);
    
    // Otomatik olarak durdur
    if (progress >= 1) {
        stopCamelTour();
        return;
    }
    
    // Kervan yolu boyunca kamera hareketi (dairesel bir yol)
    const radius = 20;
    const speed = 2;
    const angle = progress * Math.PI * speed;
    
    // Kamerayı kervan yolu boyunca hareket ettir
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 5 + Math.sin(progress * Math.PI * 4) * 2; // Yukarı aşağı dalgalanma
    
    camera.position.set(x, y, z);
    
    // Kamerayı sahnenin merkezine çevir
    controls.target.set(0, 2, 0);
    controls.update();
}

// Kum fırtınasını başlat
function startSandstorm() {
    const overlay = document.getElementById('sandstormOverlay');
    overlay.classList.add('sandstorm-active');
    sandstormActive = true;
    
    // Sahne arka planını kum fırtınası rengine değiştir
    scene.background = new THREE.Color(0xC4926C);
    
    // Işık yoğunluğunu azalt
    ambientLight.intensity = 0.2;
    directionalLight.intensity = 0.8;
    
    console.log('Kum fırtınası başladı!');
}

// Kum fırtınasını durdur
function stopSandstorm() {
    const overlay = document.getElementById('sandstormOverlay');
    overlay.classList.remove('sandstorm-active');
    sandstormActive = false;
    
    // Sahne arka planını normale döndür
    scene.background = new THREE.Color(0x87CEEB);
    
    // Işık yoğunluğunu normale döndür
    ambientLight.intensity = 0.4;
    directionalLight.intensity = 1.5;
    
    console.log('Kum fırtınası durdu!');
}

<<<<<<< HEAD
// Gizli Mezar Bulmacası Fonksiyonları

// Mezar bulmacasını göster
function showTombPuzzle() {
    const puzzleElement = document.getElementById('tombPuzzle');
    puzzleElement.style.display = 'block';
    tombPuzzleActive = true;
    
    // Kontrollerini devre dışı bırak
    controls.enabled = false;
    
    // Bulmaca durumunu sıfırla
    resetTombPuzzle();
    
    console.log('Mezar bulmacası açıldı');
}

// Mezar bulmacasını kapat
function closeTombPuzzle() {
    const puzzleElement = document.getElementById('tombPuzzle');
    puzzleElement.style.display = 'none';
    tombPuzzleActive = false;
    
    // Kontrollerini geri etkinleştir
    controls.enabled = true;
    
    console.log('Mezar bulmacası kapatıldı');
}

// Mezar bulmacasını sıfırla
function resetTombPuzzle() {
    selectedSequence = [];
    
    // Tüm slotları temizle
    for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`slot${i}`);
        slot.textContent = '';
        slot.className = 'sequence-slot';
        
        // Sequence number'ı tekrar ekle
        const numberDiv = document.createElement('div');
        numberDiv.className = 'sequence-number';
        numberDiv.textContent = i;
        slot.appendChild(numberDiv);
    }
    
    // Tüm hiyeroglifleri yeniden kullanılabilir yap
    const hieroglyphs = document.querySelectorAll('.selectable-hieroglyph');
    hieroglyphs.forEach(h => {
        h.classList.remove('used');
        h.style.pointerEvents = 'auto';
    });
    
    // Durum mesajını temizle
    const statusElement = document.getElementById('puzzleStatus');
    statusElement.textContent = '';
    statusElement.className = 'puzzle-status';
    
    console.log('Mezar bulmacası sıfırlandı');
}

// Mezar bulmaca sırasını kontrol et
function checkTombSequence() {
    const statusElement = document.getElementById('puzzleStatus');
    
    // Sıra tamamlanmış mı kontrol et
    if (selectedSequence.length !== 4) {
        statusElement.textContent = 'Lütfen 4 hiyeroglifi sırayla seçin!';
        statusElement.className = 'puzzle-status error';
        return;
    }
    
    // Doğru sırayı kontrol et
    const isCorrect = selectedSequence.every((symbol, index) => 
        symbol === correctSequence[index]
    );
    
    if (isCorrect) {
        statusElement.textContent = '🎉 Tebrikler! Gizli mezar açıldı!';
        statusElement.className = 'puzzle-status success';
        
        // Kısa bir gecikme sonrası gizli oda turunu başlat
        setTimeout(() => {
            closeTombPuzzle();
            startHiddenChamberTour();
        }, 2000);
        
        console.log('Mezar bulmacası doğru çözüldü! Gizli oda turu başlıyor...');
    } else {
        statusElement.textContent = '❌ Yanlış sıra! Tekrar deneyin.';
        statusElement.className = 'puzzle-status error';
        
        // 2 saniye sonra sıfırla
        setTimeout(() => {
            resetTombPuzzle();
        }, 2000);
        
        console.log('Mezar bulmacası yanlış çözüldü');
    }
}

// Hiyeroglif seçimi için event listener'ları ayarla
function setupTombPuzzleInteraction() {
    const hieroglyphs = document.querySelectorAll('.selectable-hieroglyph');
    
    hieroglyphs.forEach(hieroglyph => {
        hieroglyph.addEventListener('click', function() {
            // Kullanılmışsa işlem yapma
            if (this.classList.contains('used')) return;
            
            // Sıra dolu mu kontrol et
            if (selectedSequence.length >= 4) return;
            
            // Seçimi kaydet
            const meaning = this.getAttribute('data-meaning');
            const symbol = this.getAttribute('data-symbol');
            selectedSequence.push(meaning);
            
            // Hiyeroglifi kullanılmış olarak işaretle
            this.classList.add('used');
            this.style.pointerEvents = 'none';
            
            // İlgili slotu doldur
            const slotIndex = selectedSequence.length;
            const slot = document.getElementById(`slot${slotIndex}`);
            
            // Slot içeriğini temizle ve yeni sembolü ekle
            slot.innerHTML = `<div class="sequence-number">${slotIndex}</div>${symbol}`;
            slot.classList.add('filled');
            
            console.log(`Hiyeroglif seçildi: ${meaning} (${symbol})`);
            
            // Durum mesajını güncelle
            const statusElement = document.getElementById('puzzleStatus');
            if (selectedSequence.length === 4) {
                statusElement.textContent = 'Sıra tamamlandı! "Kontrol Et" butonuna tıklayın.';
                statusElement.className = 'puzzle-status';
            } else {
                statusElement.textContent = `${selectedSequence.length}/4 hiyeroglif seçildi.`;
                statusElement.className = 'puzzle-status';
            }
        });
    });
}

=======
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
// Global fonksiyonları window objesine ekle (HTML'den erişilebilir olması için)
window.closeHieroglyphInfo = closeHieroglyphInfo;
window.startCamelTour = startCamelTour;
window.stopCamelTour = stopCamelTour;
window.showTombPuzzle = showTombPuzzle;
window.closeTombPuzzle = closeTombPuzzle;
window.resetTombPuzzle = resetTombPuzzle;
window.checkTombSequence = checkTombSequence;

<<<<<<< HEAD
// Gizli Oda Turu Fonksiyonları
function createHiddenChamberScene() {
    // Yeni bir container grup oluştur
    hiddenChamberScene = new THREE.Group();
    hiddenChamberScene.name = 'HiddenChamber';
    
    // Oda duvarları oluştur
    createChamberWalls();
    
    // Sanduka oluştur
    createSarcophagus();
    
    // Hiyeroglif duvarları oluştur
    createHieroglyphWalls();
    
    // Hazine sandıkları oluştur
    createTreasureChests();
    
    // Oda ışıklandırması
    createChamberLighting();
    
    // Sahneye ekle ama başlangıçta görünmez yap
    hiddenChamberScene.visible = false;
    scene.add(hiddenChamberScene);
    
    console.log('Gizli oda sahnesi oluşturuldu');
}

function createChamberWalls() {
    // Ana oda duvarları - kare şeklinde
    const wallHeight = 4;
    const wallThickness = 0.2;
    const roomSize = 8;
    
    const wallMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        map: createStoneTexture()
    });
    
    // Duvar geometrisi
    const wallGeometry = new THREE.BoxGeometry(roomSize, wallHeight, wallThickness);
    
    // 4 duvar oluştur
    const walls = [
        { position: [0, wallHeight/2, -roomSize/2], rotation: [0, 0, 0] }, // Arka duvar
        { position: [0, wallHeight/2, roomSize/2], rotation: [0, 0, 0] },  // Ön duvar  
        { position: [-roomSize/2, wallHeight/2, 0], rotation: [0, Math.PI/2, 0] }, // Sol duvar
        { position: [roomSize/2, wallHeight/2, 0], rotation: [0, Math.PI/2, 0] }   // Sağ duvar
    ];
    
    walls.forEach((wallConfig, index) => {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(...wallConfig.position);
        wall.rotation.set(...wallConfig.rotation);
        wall.castShadow = true;
        wall.receiveShadow = true;
        wall.name = `ChamberWall_${index}`;
        hiddenChamberScene.add(wall);
    });
    
    // Zemin oluştur
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    const floorMaterial = new THREE.MeshPhongMaterial({
        color: 0x654321,
        map: createStoneTexture()
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    floor.name = 'ChamberFloor';
    hiddenChamberScene.add(floor);
    
    // Tavan oluştur
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = wallHeight;
    ceiling.name = 'ChamberCeiling';
    hiddenChamberScene.add(ceiling);
}

function createSarcophagus() {
    // Sanduka ana gövdesi
    const sarcophagusGeometry = new THREE.BoxGeometry(2.5, 0.8, 1.2);
    const sarcophagusMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFD700,
        shininess: 100,
        specular: 0x444444
    });
    
    sarcophagus = new THREE.Mesh(sarcophagusGeometry, sarcophagusMaterial);
    sarcophagus.position.set(0, 0.4, -2);
    sarcophagus.castShadow = true;
    sarcophagus.receiveShadow = true;
    sarcophagus.name = 'Sarcophagus';
    
    // Sanduka kapağı (ayrı bir obje olarak)
    const lidGeometry = new THREE.BoxGeometry(2.6, 0.2, 1.3);
    const lidMaterial = new THREE.MeshPhongMaterial({
        color: 0xDAA520,
        shininess: 80
    });
    
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.set(0, 0.9, -2);
    lid.castShadow = true;
    lid.name = 'SarcophagusLid';
    
    // Hiyeroglif detayları ekle
    const hieroglyphGeometry = new THREE.PlaneGeometry(0.3, 0.3);
    const hieroglyphMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        transparent: true
    });
    
    const hieroglyphs = ['𓈖', '𓅓', '𓂀', '𓊪', '𓈙'];
    hieroglyphs.forEach((symbol, index) => {
        const hieroglyph = new THREE.Mesh(hieroglyphGeometry, hieroglyphMaterial.clone());
        hieroglyph.position.set((index - 2) * 0.4, 0.1, 0.61);
        hieroglyph.material.map = createTextTexture(symbol);
        sarcophagus.add(hieroglyph);
    });
    
    hiddenChamberScene.add(sarcophagus);
    hiddenChamberScene.add(lid);
}

function createHieroglyphWalls() {
    hieroglyphWalls = [];
    
    // Duvar hiyeroglifleri için pozisyonlar
    const wallPositions = [
        { wall: 'back', x: 0, y: 2, z: -3.9 },
        { wall: 'left', x: -3.9, y: 2, z: 0 },
        { wall: 'right', x: 3.9, y: 2, z: 0 }
    ];
    
    const hieroglyphSymbols = [
        ['𓈖', '𓅓', '𓂀', '𓊪', '𓈙', '𓆣'],
        ['𓃀', '𓄿', '𓇯', '𓈎', '𓉐', '𓊃'],
        ['𓋴', '𓌳', '𓍘', '𓎛', '𓏏', '𓐝']
    ];
    
    wallPositions.forEach((wallPos, wallIndex) => {
        const wallGroup = new THREE.Group();
        wallGroup.name = `HieroglyphWall_${wallPos.wall}`;
        
        hieroglyphSymbols[wallIndex].forEach((symbol, index) => {
            const panelGeometry = new THREE.PlaneGeometry(0.8, 0.8);
            const panelMaterial = new THREE.MeshPhongMaterial({
                color: 0xF4A460,
                transparent: true,
                opacity: 0.9
            });
            
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            
            // Panel pozisyonunu hesapla
            const offsetX = (index % 3 - 1) * 1.2;
            const offsetY = Math.floor(index / 3) * 1.2 - 0.6;
            
            if (wallPos.wall === 'back') {
                panel.position.set(wallPos.x + offsetX, wallPos.y + offsetY, wallPos.z);
            } else if (wallPos.wall === 'left') {
                panel.position.set(wallPos.x, wallPos.y + offsetY, wallPos.z + offsetX);
                panel.rotation.y = Math.PI / 2;
            } else if (wallPos.wall === 'right') {
                panel.position.set(wallPos.x, wallPos.y + offsetY, wallPos.z + offsetX);
                panel.rotation.y = -Math.PI / 2;
            }
            
            // Hiyeroglif tekstürü ekle
            panel.material.map = createTextTexture(symbol, '#8B4513');
            
            panel.name = `Hieroglyph_${symbol}_${wallIndex}_${index}`;
            wallGroup.add(panel);
        });
        
        hieroglyphWalls.push(wallGroup);
        hiddenChamberScene.add(wallGroup);
    });
}

function createTreasureChests() {
    treasureChests = [];
    
    const chestPositions = [
        { x: -3, z: -3, rotation: 0.2 },
        { x: 3, z: -3, rotation: -0.2 },
        { x: -2.5, z: 2, rotation: 0.1 },
        { x: 2.5, z: 2, rotation: -0.1 }
    ];
    
    chestPositions.forEach((pos, index) => {
        const chestGroup = new THREE.Group();
        
        // Sandık ana gövdesi
        const chestGeometry = new THREE.BoxGeometry(1, 0.6, 0.8);
        const chestMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            map: createWoodTexture()
        });
        
        const chest = new THREE.Mesh(chestGeometry, chestMaterial);
        chest.position.y = 0.3;
        chest.castShadow = true;
        chest.receiveShadow = true;
        
        // Sandık kapağı
        const lidGeometry = new THREE.BoxGeometry(1.1, 0.1, 0.9);
        const lidMaterial = new THREE.MeshPhongMaterial({
            color: 0x654321
        });
        
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.y = 0.65;
        lid.rotation.x = -0.3; // Hafif açık
        lid.castShadow = true;
        
        // Altın parıltısı ekle
        const goldGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const goldMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700,
            emissive: 0x222200,
            shininess: 100
        });
        
        for (let i = 0; i < 5; i++) {
            const gold = new THREE.Mesh(goldGeometry, goldMaterial);
            gold.position.set(
                (Math.random() - 0.5) * 0.8,
                0.7 + Math.random() * 0.2,
                (Math.random() - 0.5) * 0.6
            );
            chestGroup.add(gold);
        }
        
        chestGroup.add(chest);
        chestGroup.add(lid);
        chestGroup.position.set(pos.x, 0, pos.z);
        chestGroup.rotation.y = pos.rotation;
        chestGroup.name = `TreasureChest_${index}`;
        
        treasureChests.push(chestGroup);
        hiddenChamberScene.add(chestGroup);
    });
}

function createChamberLighting() {
    chamberLights = [];
    chamberTorchLights = [];
      // Daha güçlü ambient ışık - odayı daha aydınlık yapmak için
    chamberAmbientLight = new THREE.AmbientLight(0x606060, 2.0); // 1.5'ten 2.0'a artırıldı, renk daha açık
    chamberAmbientLight.name = 'ChamberAmbient';
    hiddenChamberScene.add(chamberAmbientLight);
    chamberLights.push(chamberAmbientLight);
    
    // Ana directional ışık - daha parlak yapıldı
    chamberMainLight = new THREE.DirectionalLight(0xFFFFCC, 4.5); // 4.0'dan 4.5'e artırıldı, renk daha açık
    chamberMainLight.position.set(0, 8, 2); // Odanın üstünden aydınlatma
    chamberMainLight.castShadow = true;
    chamberMainLight.shadow.mapSize.width = 1024;
    chamberMainLight.shadow.mapSize.height = 1024;
    chamberMainLight.shadow.camera.near = 0.5;
    chamberMainLight.shadow.camera.far = 20;
    chamberMainLight.shadow.camera.left = -10;
    chamberMainLight.shadow.camera.right = 10;
    chamberMainLight.shadow.camera.top = 10;
    chamberMainLight.shadow.camera.bottom = -10;
    hiddenChamberScene.add(chamberMainLight);
    chamberLights.push(chamberMainLight);    // Ek ışık kaynakları - odayı daha aydınlık yapmak için
    const additionalLight1 = new THREE.DirectionalLight(0xFFFFDD, 2.5); // 1.8'den 2.5'e artırıldı
    additionalLight1.position.set(-5, 6, 5);
    hiddenChamberScene.add(additionalLight1);
    chamberLights.push(additionalLight1);
    
    const additionalLight2 = new THREE.DirectionalLight(0xFFFFDD, 2.5); // 1.8'den 2.5'e artırıldı
    additionalLight2.position.set(5, 6, -5);
    hiddenChamberScene.add(additionalLight2);
    chamberLights.push(additionalLight2);
    
    // Yeni ekstra ışıklar - köşeleri ve duvarları aydınlatmak için
    const cornerLight1 = new THREE.PointLight(0xFFDDAA, 1.5, 14);
    cornerLight1.position.set(-3, 3, -3);
    hiddenChamberScene.add(cornerLight1);
    chamberLights.push(cornerLight1);
    
    const cornerLight2 = new THREE.PointLight(0xFFDDAA, 1.5, 14);
    cornerLight2.position.set(3, 3, -3);
    hiddenChamberScene.add(cornerLight2);
    chamberLights.push(cornerLight2);// Dekoratif meşale ışıkları (daha parlak yapıldı)
    chamberData.ambientData.torchPositions.forEach((pos, index) => {        // Point light - daha da parlak yapıldı
        const torchLight = new THREE.PointLight(0xFF7722, 2.2, 15, 2); // 1.5'ten 2.2'ye artırıldı, menzil 12'den 15'e
        torchLight.position.set(pos.x, pos.y, pos.z);
        torchLight.castShadow = true;
        torchLight.shadow.mapSize.width = 256;
        torchLight.shadow.mapSize.height = 256;
        
        // Meşale görsel temsili
        const torchGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
        const torchMaterial = new THREE.MeshPhongMaterial({
            color: 0x654321
        });
        
        const torch = new THREE.Mesh(torchGeometry, torchMaterial);
        torch.position.set(pos.x, pos.y - 0.5, pos.z);        // Alev efekti - daha büyük ve daha parlak
        const flameGeometry = new THREE.SphereGeometry(0.3, 8, 8); // 0.25'ten 0.3'e
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFAA66, // Renk daha parlak
            transparent: true,
            opacity: 0.95, // 0.9'dan 0.95'e
            emissive: 0xFF9966, // Işık yayma özelliği ekle
            emissiveIntensity: 0.8
        });
        
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(pos.x, pos.y + 0.2, pos.z);
        flame.scale.set(1.2, 1.7, 1.2); // Biraz daha büyük
        
        // İç alev (daha parlak)
        const innerFlameGeometry = new THREE.SphereGeometry(0.18, 8, 8); // 0.15'ten 0.18'e
        const innerFlameMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFEE00, // Renk daha parlak
            transparent: true,
            opacity: 1.0, // 0.95'ten 1.0'a
        });
        
        const innerFlame = new THREE.Mesh(innerFlameGeometry, innerFlameMaterial);
        innerFlame.position.set(pos.x, pos.y + 0.25, pos.z);
        innerFlame.scale.set(1, 1.3, 1);
        
        hiddenChamberScene.add(torchLight);
        hiddenChamberScene.add(torch);
        hiddenChamberScene.add(flame);
        hiddenChamberScene.add(innerFlame);        
        chamberLights.push(torchLight);
        chamberTorchLights.push(torchLight);
        
        // Alev animasyonu için objeleri kaydet
        flame.userData = { originalScale: flame.scale.clone(), type: 'flame', lightRef: torchLight };
        innerFlame.userData = { originalScale: innerFlame.scale.clone(), type: 'innerFlame', lightRef: torchLight };
        chamberLights.push(flame);
        chamberLights.push(innerFlame);
    });    // Sanduka spotlight'ı - çok daha parlak
    chamberSarcophagusLight = new THREE.SpotLight(0xFFE24D, 3.0, 18, Math.PI / 7, 0.25, 2); // 2.0'dan 3.0'a artırıldı, menzil 15'ten 18'e
    chamberSarcophagusLight.position.set(0, 3.5, -2);
    chamberSarcophagusLight.target.position.set(0, 0.5, -2);
    chamberSarcophagusLight.castShadow = true;
    
    hiddenChamberScene.add(chamberSarcophagusLight);
    hiddenChamberScene.add(chamberSarcophagusLight.target);
    chamberLights.push(chamberSarcophagusLight);
}

// Yardımcı fonksiyonlar - tekstür oluşturma
function createStoneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Taş dokusu oluştur
    context.fillStyle = '#8B7355';
    context.fillRect(0, 0, 256, 256);
    
    // Rastgele taş detayları
    for (let i = 0; i < 50; i++) {
        context.fillStyle = `rgb(${120 + Math.random() * 40}, ${100 + Math.random() * 40}, ${70 + Math.random() * 30})`;
        context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 20 + 5, Math.random() * 20 + 5);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    
    return texture;
}

function createWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Ahşap dokusu oluştur
    const gradient = context.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, '#8B4513');
    gradient.addColorStop(0.5, '#A0522D');
    gradient.addColorStop(1, '#8B4513');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    // Ahşap damarları
    for (let i = 0; i < 20; i++) {
        context.strokeStyle = '#654321';
        context.lineWidth = Math.random() * 3 + 1;
        context.beginPath();
        context.moveTo(0, Math.random() * 256);
        context.lineTo(256, Math.random() * 256);
        context.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
}

function createTextTexture(text, color = '#FFD700') {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    // Arka plan
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, 128, 128);
    
    // Metin
    context.fillStyle = color;
    context.font = 'bold 60px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 64, 64);
    
    return new THREE.CanvasTexture(canvas);
}

function startHiddenChamberTour() {
    if (hiddenChamberTourActive) return;
    
    // Gizli oda sahnesi henüz oluşturulmadıysa oluştur
    if (!hiddenChamberScene) {
        createHiddenChamberScene();
    }
    
    hiddenChamberTourActive = true;
    
    // Orijinal sahne verilerini kaydet
    originalCameraPosition.copy(camera.position);
    originalCameraTarget.copy(controls.target);
      // Ana sahne objelerini gizle
    models.forEach(model => {
        if (model) model.visible = false;
    });
    plane.visible = false;
    sun.visible = false;
      // Gizli oda sahnesini göster
    hiddenChamberScene.visible = true;
    
    // Gizli oda ışık kontrollerini göster
    showChamberLightControls();
    
    // Kamera kontrollerini ETKİNLEŞTİR (otomatik tur yerine serbest hareket)
    controls.enabled = true;
=======
// Mezar bulmacası fonksiyonları
function setupTombPuzzle() {
    const hieroglyphs = document.querySelectorAll('.selectable-hieroglyph');
    hieroglyphs.forEach(hieroglyph => {
        hieroglyph.addEventListener('click', () => {
            if (!hieroglyph.classList.contains('used')) {
                selectHieroglyphForSequence(hieroglyph);
            }
        });
    });
}

function showTombPuzzle() {
    tombPuzzleActive = true;
    document.getElementById('tombPuzzle').style.display = 'block';
    resetTombPuzzle();
}

function closeTombPuzzle() {
    tombPuzzleActive = false;
    document.getElementById('tombPuzzle').style.display = 'none';
    resetTombPuzzle();
}

function selectHieroglyphForSequence(hieroglyphElement) {
    if (selectedSequence.length >= 4) return;
    
    const symbol = hieroglyphElement.dataset.symbol;
    const meaning = hieroglyphElement.dataset.meaning;
    
    selectedSequence.push(meaning);
    hieroglyphElement.classList.add('used');
    
    // Slot'u doldur
    const slotIndex = selectedSequence.length;
    const slot = document.getElementById(`slot${slotIndex}`);
    slot.textContent = symbol;
    slot.classList.add('filled');
    
    // Status'u güncelle
    updatePuzzleStatus();
}

function resetTombPuzzle() {
    selectedSequence = [];
    
    // Slot'ları temizle
    for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`slot${i}`);
        slot.textContent = '';
        slot.classList.remove('filled');
    }
    
    // Hiyeroglifleri resetle
    const hieroglyphs = document.querySelectorAll('.selectable-hieroglyph');
    hieroglyphs.forEach(h => h.classList.remove('used'));
    
    // Status'u temizle
    document.getElementById('puzzleStatus').textContent = '';
    document.getElementById('puzzleStatus').className = 'puzzle-status';
}

function updatePuzzleStatus() {
    const status = document.getElementById('puzzleStatus');
    
    if (selectedSequence.length === 0) {
        status.textContent = '';
        status.className = 'puzzle-status';
    } else if (selectedSequence.length < 4) {
        status.textContent = `${selectedSequence.length}/4 sembol seçildi. Devam edin...`;
        status.className = 'puzzle-status';
    } else {
        status.textContent = 'Sıra tamamlandı! "Kontrol Et" tuşuna basın.';
        status.className = 'puzzle-status';
    }
}

function checkTombSequence() {
    if (selectedSequence.length !== 4) {
        const status = document.getElementById('puzzleStatus');
        status.textContent = 'Önce 4 sembolü de seçin!';
        status.className = 'puzzle-status error';
        return;
    }
    
    const isCorrect = selectedSequence.every((symbol, index) => symbol === correctSequence[index]);
    const status = document.getElementById('puzzleStatus');
    
    if (isCorrect) {
        status.textContent = '🎉 Doğru! Mezar girişi açılıyor...';
        status.className = 'puzzle-status success';
        
        // 2 saniye sonra mezar turunu başlat
        setTimeout(() => {
            closeTombPuzzle();
            startTombTour();
        }, 2000);
    } else {
        status.textContent = '❌ Yanlış sıra! Tekrar deneyin. İpucu: "Güneş, Su, İnsan, Bilgelik"';
        status.className = 'puzzle-status error';
        
        // 3 saniye sonra resetle
        setTimeout(() => {
            resetTombPuzzle();
        }, 3000);
    }
}

function startTombTour() {
    if (tombTourActive) return;
    
    tombTourActive = true;
    tombTourStartTime = Date.now();
    
    // Orijinal kamera pozisyonunu kaydet
    originalCameraPosition.copy(camera.position);
    originalCameraTarget.copy(controls.target);
    
    // Kontrolleri devre dışı bırak
    controls.enabled = false;
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    
    // Overlay'i göster
    const overlay = document.getElementById('tombTourOverlay');
    overlay.classList.add('tomb-tour-active');
<<<<<<< HEAD
      // Sahne ışığını artır
    directionalLight.intensity = 0.5; // 0.3'ten 0.5'e artırıldı
    ambientLight.intensity = 0.3; // 0.2'den 0.3'e artırıldı
    
    console.log('Gizli Oda - Serbest Keşif Modu başladı!');
    
    // Başlangıç kamera pozisyonunu ayarla
    camera.position.set(0, 3, 8);
    controls.target.set(0, 1, 0);
    controls.update();
    
    // Kullanım mesajını göster
    document.getElementById('tombTourText').textContent = "Gizli odayı keşfedin! ESC tuşuna basarak çıkabilirsiniz.";
}

function updateHiddenChamberTour() {
    if (!hiddenChamberTourActive) return;
    
    const elapsed = Date.now() - hiddenChamberStartTime;
    const totalDuration = chamberData.cameraPath.reduce((sum, path) => sum + path.duration, 0);
    
    // Tur tamamlandığında durdur
    if (elapsed >= totalDuration) {
        stopHiddenChamberTour();
        return;
    }
    
    // Mevcut path segment'ini bul
    let currentTime = 0;
    let currentSegment = null;
    let segmentProgress = 0;
    
    for (let i = 0; i < chamberData.cameraPath.length; i++) {
        const segment = chamberData.cameraPath[i];
        if (elapsed >= currentTime && elapsed < currentTime + segment.duration) {
            currentSegment = segment;
            segmentProgress = (elapsed - currentTime) / segment.duration;
            currentPathIndex = i;
            break;
        }
        currentTime += segment.duration;
    }
    
    if (!currentSegment) return;
    
    // Kamera pozisyonunu interpolate et
    if (currentPathIndex < chamberData.cameraPath.length - 1) {
        const nextSegment = chamberData.cameraPath[currentPathIndex + 1];
        
        // Smooth interpolation
        const easeProgress = easeInOutCubic(segmentProgress);
        
        // Pozisyon interpolasyonu
        camera.position.lerpVectors(
            new THREE.Vector3(currentSegment.position.x, currentSegment.position.y, currentSegment.position.z),
            new THREE.Vector3(nextSegment.position.x, nextSegment.position.y, nextSegment.position.z),
            easeProgress
        );
        
        // Target interpolasyonu
        controls.target.lerpVectors(
            new THREE.Vector3(currentSegment.target.x, currentSegment.target.y, currentSegment.target.z),
            new THREE.Vector3(nextSegment.target.x, nextSegment.target.y, nextSegment.target.z),
            easeProgress
        );
    }
    
    // Mesajı güncelle
    document.getElementById('tombTourText').textContent = currentSegment.description;
    
    // Alev animasyonu
    animateFlames();
    
    controls.update();
}

function animateFlames() {
    const time = Date.now() * 0.005;
    
    chamberLights.forEach(light => {
        if (light.userData && light.userData.type === 'flame') {
            const scale = light.userData.originalScale;
            light.scale.set(
                scale.x + Math.sin(time + light.position.x) * 0.15,
                scale.y + Math.sin(time * 1.5 + light.position.z) * 0.25,
                scale.z + Math.cos(time + light.position.y) * 0.15
            );
            
            // Işık intensity animasyonu
            if (light.userData.lightRef) {
                light.userData.lightRef.intensity = 1.2 + Math.sin(time * 2) * 0.3;
            }
        } else if (light.userData && light.userData.type === 'innerFlame') {
            const scale = light.userData.originalScale;
            light.scale.set(
                scale.x + Math.sin(time * 1.2 + light.position.x) * 0.1,
                scale.y + Math.sin(time * 1.8 + light.position.z) * 0.2,
                scale.z + Math.cos(time * 1.1 + light.position.y) * 0.1
            );
        }
    });
}

function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function stopHiddenChamberTour() {
    if (!hiddenChamberTourActive) return;
    
    hiddenChamberTourActive = false;
=======
    
    // Sahne ışığını azalt (mezar atmosferi)
    ambientLight.intensity = 0.1;
    directionalLight.intensity = 0.3;
    
    console.log('Mezar turu başladı!');
}

function updateTombTour() {
    const elapsed = Date.now() - tombTourStartTime;
    const progress = Math.min(elapsed / tombTourDuration, 1);
    
    // Otomatik olarak durdur
    if (progress >= 1) {
        stopTombTour();
        return;
    }
    
    const textElement = document.getElementById('tombTourText');
    
    // Farklı aşamalarda farklı metinler göster
    if (progress < 0.2) {
        textElement.textContent = '🏺 Gizli mezara giriyorsunuz...';
        // Kamerayı piramit içine götür
        camera.position.set(2, 3, 2);
        controls.target.set(0, 1, 0);
    } else if (progress < 0.4) {
        textElement.textContent = '🕯️ Antik duvar resimleri görünüyor...';
        // Kamerayı duvarlara çevir
        camera.position.set(1, 2, 3);
        controls.target.set(0, 2, 0);
    } else if (progress < 0.6) {
        textElement.textContent = '⚱️ Firavunun mezar odasına yaklaşıyorsunuz...';
        // Daha derine git
        camera.position.set(-1, 1.5, 1);
        controls.target.set(0, 1, -2);
    } else if (progress < 0.8) {
        textElement.textContent = '💎 Değerli hazineler keşfediyorsunuz...';
        // Hazine odasına bak
        camera.position.set(-2, 2, -1);
        controls.target.set(0, 1, -3);
    } else {
        textElement.textContent = '🚪 Mezardan çıkış yapıyorsunuz...';
        // Çıkışa doğru
        camera.position.set(3, 4, 3);
        controls.target.set(0, 0, 0);
    }
    
    controls.update();
}

function stopTombTour() {
    if (!tombTourActive) return;
    
    tombTourActive = false;
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
    
    // Overlay'i gizle
    const overlay = document.getElementById('tombTourOverlay');
    overlay.classList.remove('tomb-tour-active');
<<<<<<< HEAD
      // Ana sahne objelerini geri göster
    models.forEach(model => {
        if (model) model.visible = true;
    });
    plane.visible = true;
    sun.visible = true;
      // Gizli oda sahnesini gizle
    if (hiddenChamberScene) hiddenChamberScene.visible = false;
    
    // Gizli oda ışık kontrollerini gizle
    hideChamberLightControls();
    
    // Kamera kontrollerini etkin tut (zaten etkin)
    controls.enabled = true;
    
    // Kamera pozisyonunu orijinal haline getir (smooth transition)
    animateToOriginalPosition();
    
    // Işıkları normale döndür
    directionalLight.intensity = 1.5;
    ambientLight.intensity = 0.4;
    
    console.log('Gizli Oda Keşfi tamamlandı!');
}

function animateToOriginalPosition() {
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 2000;
    const startTime = Date.now();
    
    function animateStep() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeInOutCubic(progress);
        
        camera.position.lerpVectors(startPos, originalCameraPosition, easeProgress);
        controls.target.lerpVectors(startTarget, originalCameraTarget, easeProgress);
        controls.update();
        
        if (progress < 1) {
            requestAnimationFrame(animateStep);
        }
    }
    
    animateStep();
}

// Sarcophagus (sanduka) interaktif fonksiyonu
function onSarcophagusClick() {
    if (!hiddenChamberTourActive || !sarcophagus) return;
    
    // Sanduka açılma animasyonu
    const lid = scene.getObjectByName('SarcophagusLid');
    if (lid) {
        // Kapağı yavaşça aç
        const openAnimation = {
            startRotation: lid.rotation.x,
            targetRotation: lid.rotation.x - Math.PI / 3,
            duration: 2000,
            startTime: Date.now()
        };
        
        function animateLid() {
            const elapsed = Date.now() - openAnimation.startTime;
            const progress = Math.min(elapsed / openAnimation.duration, 1);
            const easeProgress = easeInOutCubic(progress);
            
            lid.rotation.x = THREE.MathUtils.lerp(
                openAnimation.startRotation,
                openAnimation.targetRotation,
                easeProgress
            );
            
            if (progress < 1) {
                requestAnimationFrame(animateLid);
            }
        }
        
        animateLid();
        
        // Sanduka açıldığında altın parıltı efekti
        setTimeout(() => {
            addTreasureSparkles();
        }, 1000);
    }
}

function addTreasureSparkles() {
    const sparkleCount = 20;
    const sparkles = [];
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkleGeometry = new THREE.SphereGeometry(0.02, 6, 6);
        const sparkleMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            emissive: 0xFFD700,
            transparent: true,
            opacity: 0.8
        });
        
        const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
        sparkle.position.set(
            (Math.random() - 0.5) * 2,
            0.8 + Math.random() * 0.5,
            -2 + (Math.random() - 0.5) * 1
        );
        
        // Rastgele hareket vektörü
        sparkle.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                Math.random() * 0.02 + 0.01,
                (Math.random() - 0.5) * 0.05
            ),
            life: 3000,
            startTime: Date.now()
        };
        
        sparkles.push(sparkle);
        hiddenChamberScene.add(sparkle);
    }
    
    // Parıltı animasyonu
    function animateSparkles() {
        const currentTime = Date.now();
        
        sparkles.forEach((sparkle, index) => {
            const elapsed = currentTime - sparkle.userData.startTime;
            const progress = elapsed / sparkle.userData.life;
            
            if (progress >= 1) {
                hiddenChamberScene.remove(sparkle);
                sparkles.splice(index, 1);
                return;
            }
            
            // Hareket et
            sparkle.position.add(sparkle.userData.velocity);
            
            // Yaşlanma efekti
            sparkle.material.opacity = 0.8 * (1 - progress);
            sparkle.scale.setScalar(1 - progress * 0.5);
        });
        
        if (sparkles.length > 0) {
            requestAnimationFrame(animateSparkles);
        }
    }
    
    animateSparkles();
}

// Gizli Oda Işık Kontrol Fonksiyonları
let chamberLightControlsActive = false;
let chamberMainLight = null;
let chamberAmbientLight = null;
let chamberTorchLights = [];
let chamberSarcophagusLight = null;

function setupChamberLightControls() {
    const controls = [
        'chamberMainIntensity',
        'chamberAmbientIntensity', 
        'chamberTorchIntensity',
        'chamberSarcophagusIntensity',
        'chamberMainX',
        'chamberMainY',
        'chamberMainZ'
    ];
    
    controls.forEach(id => {
        const slider = document.getElementById(id);
        const valueInput = document.getElementById(id + 'Value');
        const valueSpan = document.getElementById(id + 'Value');
        
        if (slider) {
            slider.addEventListener('input', () => {
                if (valueInput) valueInput.value = slider.value;
                if (valueSpan) valueSpan.textContent = slider.value;
                updateChamberLighting();
            });
        }
        
        if (valueInput) {
            valueInput.addEventListener('input', () => {
                slider.value = valueInput.value;
                updateChamberLighting();
            });
        }
    });
    
    // Renk kontrolü
    const colorPicker = document.getElementById('chamberLightColor');
    if (colorPicker) {
        colorPicker.addEventListener('input', () => {
            updateChamberLighting();
        });
    }
    
    // Sıfırlama butonu
    const resetBtn = document.getElementById('resetChamberLights');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetChamberLights();
        });
    }
}

function updateChamberLighting() {
    if (!hiddenChamberScene || !hiddenChamberTourActive) return;
    
    // Ana ışık yoğunluğu
    const mainIntensity = parseFloat(document.getElementById('chamberMainIntensity').value);
    if (chamberMainLight) {
        chamberMainLight.intensity = mainIntensity;
    }
    
    // Ortam ışığı
    const ambientIntensity = parseFloat(document.getElementById('chamberAmbientIntensity').value);
    if (chamberAmbientLight) {
        chamberAmbientLight.intensity = ambientIntensity;
    }
    
    // Meşale ışıkları
    const torchIntensity = parseFloat(document.getElementById('chamberTorchIntensity').value);
    chamberTorchLights.forEach(light => {
        if (light && light.isPointLight) {
            light.intensity = torchIntensity;
        }
    });
    
    // Sanduka spot ışığı
    const sarcophagusIntensity = parseFloat(document.getElementById('chamberSarcophagusIntensity').value);
    if (chamberSarcophagusLight) {
        chamberSarcophagusLight.intensity = sarcophagusIntensity;
    }
    
    // Ana ışık pozisyonu
    const x = parseFloat(document.getElementById('chamberMainX').value);
    const y = parseFloat(document.getElementById('chamberMainY').value);
    const z = parseFloat(document.getElementById('chamberMainZ').value);
    
    if (chamberMainLight) {
        chamberMainLight.position.set(x, y, z);
    }
    
    // Işık rengi
    const color = document.getElementById('chamberLightColor').value;
    if (chamberMainLight) {
        chamberMainLight.color.setHex(color.replace('#', '0x'));
    }
    
    // Değer spanlarını güncelle
    document.getElementById('chamberMainXValue').textContent = x;
    document.getElementById('chamberMainYValue').textContent = y;
    document.getElementById('chamberMainZValue').textContent = z;
}

function resetChamberLights() {
    // Varsayılan değerlere sıfırla - daha parlak yeni değerlerle
    document.getElementById('chamberMainIntensity').value = 4.0;
    document.getElementById('chamberMainIntensityValue').value = 4.0;
    document.getElementById('chamberAmbientIntensity').value = 1.5;
    document.getElementById('chamberAmbientIntensityValue').value = 1.5;
    document.getElementById('chamberTorchIntensity').value = 1.5;
    document.getElementById('chamberTorchIntensityValue').value = 1.5;
    document.getElementById('chamberSarcophagusIntensity').value = 2.0;
    document.getElementById('chamberSarcophagusIntensityValue').value = 2.0;
    document.getElementById('chamberMainX').value = 0;
    document.getElementById('chamberMainY').value = 8;
    document.getElementById('chamberMainZ').value = 2;
    document.getElementById('chamberLightColor').value = '#ffffaa';
    
    updateChamberLighting();
}

function showChamberLightControls() {
    const controlPanel = document.getElementById('chamberLightControls');
    if (controlPanel) {
        controlPanel.classList.add('active');
        chamberLightControlsActive = true;
    }
}

function hideChamberLightControls() {
    const controlPanel = document.getElementById('chamberLightControls');
    if (controlPanel) {
        controlPanel.classList.remove('active');
        chamberLightControlsActive = false;
    }
=======
    
    // Kamera kontrollerini geri etkinleştir
    controls.enabled = true;
    
    // Kamera pozisyonunu orijinal haline getir
    camera.position.copy(originalCameraPosition);
    controls.target.copy(originalCameraTarget);
    controls.update();
    
    // Işıkları normale döndür
    ambientLight.intensity = 0.4;
    directionalLight.intensity = 1.5;
    
    console.log('Mezar turu tamamlandı!');
>>>>>>> f668638b333c7003eeaaa27aac025a4d5ca07d46
}

// Başlat
init();
