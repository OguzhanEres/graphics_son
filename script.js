import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';

// Global variables
let scene, camera, renderer, controls;
let plane, sun, directionalLight, ambientLight;
let selectedModel = null;
const models = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const keys = { w: false, a: false, s: false, d: false };
const moveSpeed = 0.15; // For other models
const walkingCharacterSpeed = 0.05; // Minimum speed for walking character
let loadedModels = 0;
const totalModels = 6; // Statue + 3 Piramit + WalkingCharacter + DesertTerrain

// New variables for animation
let mixer; // Animation mixer for Hurricane_Kick
let walkAction; // Hurricane_Kick walking animation
let idleAction; // Durma animasyonu (varsa)
const actions = {};
// Simplified animation system variables
let characterAnimations = {
    idle: null,        // Standing Idle.fbx
    walk: null         // Female Walk.fbx
};
let characterMixer = null;
let currentAction = null;
let wasMoving = false;

// New animation system variables
let sabitMixer = null;
let sabitAction = null;
let kosmaAction = null;

const clock = new THREE.Clock(); // For time tracking

// Variables for camel tour
let camelTourActive = false;
let camelTourStartTime = 0;
let originalCameraPosition = new THREE.Vector3();
let originalCameraTarget = new THREE.Vector3();
let camelTourDuration = 15000; // 15 seconds
let sandstormActive = false;

// Variables for tomb puzzle
let tombPuzzleActive = false;
let selectedSequence = [];
let correctSequence = ['sun', 'water', 'human', 'wisdom']; 
let tombTourActive = false;
let tombTourStartTime = 0;
let tombTourDuration = 12000; // 12 saniye

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
    ],    ambientData: {
        soundEffects: ['tomb_echo', 'ancient_whispers', 'treasure_shimmer'],
        lightIntensity: 0.45, // Işık yoğunluğunu artırıyoruz
        torchPositions: [
            { x: -3.5, y: 2.5, z: -3.5 }, // Köşe meşaleleri daha köşeye
            { x: 3.5, y: 2.5, z: -3.5 },
            { x: -3.5, y: 2.5, z: 3.5 },
            { x: 3.5, y: 2.5, z: 3.5 },
            { x: 0, y: 2.5, z: -3.8 }, // Ek merkez meşaleler
            { x: 0, y: 2.5, z: 3.8 }
        ]
    }
};

// Hieroglyph data
const hieroglyphData = {
    panel1: {
        symbol: "𓈖",
        title: "Water - Source of Life",
        description: "This symbol represents water. In ancient Egypt, water was considered sacred as the source of life. Egyptian civilization developed thanks to the Nile River.",
        question: "What does this hieroglyph represent?",
        options: ["Water", "Fire", "Earth", "Air"],
        correct: 0
    },
    panel2: {
        symbol: "𓅓",
        title: "Owl - Wisdom",
        description: "The owl symbol represents wisdom and night vision ability. It is also the equivalent of the letter 'M'.",
        question: "What does the owl symbol represent?",
        options: ["Power", "Wisdom", "Speed", "Courage"],
        correct: 1
    },
    panel3: {
        symbol: "𓂀",
        title: "Human - Society",
        description: "This symbol represents humans and social order. The human figure is very important in Egyptian hieroglyphs.",
        question: "What does this symbol express?",
        options: ["Animal", "Plant", "Human", "Object"],
        correct: 2
    },
    panel4: {
        symbol: "𓊪",
        title: "Grain - Abundance",
        description: "The grain symbol represents abundance and living in prosperity. It is an indicator of Egypt being an agricultural society.",
        question: "What does the grain symbol represent?",
        options: ["War", "Peace", "Abundance", "Death"],
        correct: 2
    },
    panel5: {
        symbol: "𓈙",
        title: "Sun - Ra God",
        description: "The sun disk represents the god Ra. It is one of the most important gods in ancient Egypt and is the source of life energy.",
        question: "Which god does the sun disk represent?",
        options: ["Osiris", "Ra", "Anubis", "Isis"],
        correct: 1
    },
    panel6: {
        symbol: "𓆣",
        title: "Eagle - Power and Protection",
        description: "The eagle symbol represents power, protection, and royal authority. It is frequently used in pharaoh symbols.",
        question: "What does the eagle symbol represent?",
        options: ["Weakness", "Power", "Illness", "Poverty"],
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
    // Ambient light - çöl için daha sıcak
    ambientLight = new THREE.AmbientLight(0xFFF8DC, 0.5); // Daha sıcak ambient ışık
    scene.add(ambientLight);
    
    // Hemisphere Light (çöl gökyüzü ışığı)
    const hemiLight = new THREE.HemisphereLight(0xFFE4B5, 0xD2B48C, 0.6); // Çöl renkleri
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    
    // Ana güneş ışığı - çöl için daha güçlü
    directionalLight = new THREE.DirectionalLight(0xFFF8DC, 1.2);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    
    // Güneş görsel temsili - daha büyük
    const sunGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xFFDD44,
        emissive: 0xFFDD44,
        emissiveIntensity: 0.3
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.copy(directionalLight.position);
    scene.add(sun);
    
    // Çöl arka planı
    scene.background = new THREE.Color(0xFFF8DC); // Çöl gökyüzü
    
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
    window.sunHeight = 10; // Güneşin yüksekliği
    window.dayDuration = 60; // Bir gün süresi (saniye)
    window.currentTime = 6; // Günün saati (0-24)
}

function createGround() {
    // Ana çöl zemini oluştur - daha büyük ve çöl görünümü
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 128, 128); // Daha büyük ve detaylı
    
    // Çöl kumları için malzeme
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xE6C9A8, // Çöl kumu rengi
        roughness: 0.9,
        metalness: 0.05,
        transparent: false
    });
    
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    plane.name = 'DesertGround';
    
    // Zemini dalgalı yapmak için vertex manipülasyonu
    const vertices = plane.geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        // Y koordinatını (vertices[i+1]) rastgele değiştir
        vertices[i+1] += (Math.random() - 0.5) * 0.8; // Kum tepecikleri
    }
    plane.geometry.attributes.position.needsUpdate = true;
    plane.geometry.computeVertexNormals();
    
    scene.add(plane);
    
    // Çöl atmosferi için sis ekle
    scene.fog = new THREE.FogExp2(0xE6C9A8, 0.012); // Çöl sisi
}

function loadModels() {
    const fbxLoader = new FBXLoader();
    const tdsLoader = new TDSLoader(); // 3DS dosyaları için
    
    // Statue model
    fbxLoader.load(
        './Statue_egypt1/fbxStatue.fbx',
        (object) => {
            console.log('Statue yüklendi:', object);
            object.position.set(-14, 0, 3);
            object.scale.set(0.7, 0.7, 0.7);
            
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
            console.log('Statue loading:', (progress.loaded / progress.total * 100) + '%');
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
            object.position.set(10, 0, 0);
            object.scale.set(0.8, 0.8, 0.8); // Gizli mezar girişi olan piramit - daha büyük
            
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
            console.log('Pyramid loading:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(1, progress.loaded / progress.total);
        },        (error) => {
            console.error('Pyramid yüklenemedi:', error);
            addPlaceholderModel(10, 0, 0, 'Pyramid', 0x00ff00);
            onModelLoaded();
        }    );      
    
    // İkinci Piramit
    fbxLoader.load(
        './Free_pyramid/fbxPyra.fbx',
        (object) => {
            console.log('Pyramid2 yüklendi:', object);
            object.position.set(-5, 0, 15);
            object.scale.set(0.3, 0.3, 0.3);
            
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
            
            object.name = 'Pyramid2';
            scene.add(object);
            models.push(object);
            onModelLoaded();
        },        (progress) => {
            console.log('Pyramid2 yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(2, progress.loaded / progress.total);
        },
        (error) => {
            console.error('Pyramid2 yüklenemedi:', error);
            addPlaceholderModel(-10, 0, 10, 'Pyramid2', 0x00ff00);
            onModelLoaded();
        }
    );
    
    // Üçüncü Piramit
    fbxLoader.load(
        './Free_pyramid/fbxPyra.fbx',
        (object) => {
            console.log('Pyramid3 yüklendi:', object);
            object.position.set(-10, 0, -15);
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
            
            object.name = 'Pyramid3';
            scene.add(object);
            models.push(object);
            onModelLoaded();
        },
        (progress) => {
            console.log('Pyramid3 yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(3, progress.loaded / progress.total);        },
        (error) => {
            console.error('Pyramid3 yüklenemedi:', error);
            addPlaceholderModel(10, 0, -15, 'Pyramid3', 0x00ff00);
            onModelLoaded();
        }
    );

    // Animasyonlu Walking model - Yeni animasyon sistemi ile
    loadCharacterWithAnimations();
}

    // Basitleştirilmiş animasyon sistemi ile karakter yükleme
function loadCharacterWithAnimations() {
    const fbxLoader = new FBXLoader();
    let loadedAnimations = 0;
    const totalAnimations = 2; // Sadece idle ve walk
    let characterModel = null;
    
    // Önce base model olarak Standing Idle'ı yükle
    fbxLoader.load(
        './Female Walk.fbx',
        (object) => {
            console.log('Kosma modeli yüklendi:', object);
            
            // Animasyonları kontrol et ve karakterModel'e bağla
            if (object.animations && object.animations.length > 0) {
                console.log('Kosma animasyonları bulundu:', object.animations.length);
                
                // Animasyonu global olarak saklayalım ki sabit modeli yüklenince kullanabilelim
                window.kosmaAnimation = object.animations[0];
                
                console.log('Kosma animasyon kaydedildi:', object.animations[0].name);
            } else {
                console.log('Kosma animasyon bulunamadı');
            }
            
            // Modeli sahneye eklemeyelim, sadece animasyon verisi için kullanıyoruz
            onModelLoaded();
        },
        (progress) => {
            console.log('Kosma model yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(5, progress.loaded / progress.total);
        },
        (error) => {
            console.error('Kosma model yüklenemedi:', error);
            onModelLoaded();
        }
    );    // Sabit modeli (idle/durma animasyonu)
    fbxLoader.load(        './Standing Idle.fbx',
        (object) => {
            console.log('Sabit modeli yüklendi:', object);
            object.position.set(-5, 0, 0); 
            object.scale.set(0.01, 0.01, 0.01);
            
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
            });            // Animasyonları kontrol et
            if (object.animations && object.animations.length > 0) {
                console.log('Sabit animasyonları bulundu:', object.animations.length);
                  // AnimationMixer oluştur
                sabitMixer = new THREE.AnimationMixer(object);
                characterMixer = sabitMixer; // characterMixer referansını da ayarla// Sabit (idle) animasyonunu hazırla ve başlat
                // Pozisyon track'lerini tamamen filtrele - sadece rotation ve scale kullan
                const sabitFilteredTracks = object.animations[0].tracks.filter(track => {
                    return !track.name.includes('.position');
                });
                
                console.log('Sabit orijinal track sayısı:', object.animations[0].tracks.length);
                console.log('Sabit filtrelenmiş track sayısı:', sabitFilteredTracks.length);
                  // Sabit (idle) animasyon klonu oluştur - 24 frame animasyon için optimize edildi
                const sabitFilteredAnimation = new THREE.AnimationClip(
                    object.animations[0].name + '_idle',
                    object.animations[0].duration,
                    sabitFilteredTracks
                );
                
                sabitAction = sabitMixer.clipAction(sabitFilteredAnimation);
                sabitAction.setLoop(THREE.LoopRepeat, Infinity);
                sabitAction.clampWhenFinished = false;
                sabitAction.zeroSlopeAtStart = false;
                sabitAction.zeroSlopeAtEnd = false;
                sabitAction.timeScale = 1.0; // Smooth idle animasyon için
                sabitAction.setEffectiveWeight(1.0);
                sabitAction.enabled = true;
                sabitAction.play();
                
                console.log('Sabit animasyon hazırlandı ve başlatıldı:', object.animations[0].name);
            } else {
                console.log('Sabit animasyon bulunamadı');
            }            // Kosma animasyonunu da bu mixer'a ekle (eğer yüklendiyse)
            if (window.kosmaAnimation) {
                console.log('Kosma animasyonunu sabit modeline bağlıyorum...');
                  // Kosma animasyonu için tüm pozisyon track'lerini çıkar - sadece rotation ve scale kullan
                const filteredTracks = window.kosmaAnimation.tracks.filter(track => {
                    // Tüm pozisyon track'lerini çıkar, sadece rotation tut
                    return !track.name.includes('.position');
                });
                
                console.log('Kosma orijinal track sayısı:', window.kosmaAnimation.tracks.length);
                console.log('Kosma filtrelenmiş track sayısı:', filteredTracks.length);                // Filtrelenmiş animasyon klonu oluştur - 24 frame optimizasyonu ile
                const filteredAnimation = new THREE.AnimationClip(
                    window.kosmaAnimation.name + '_walking',
                    window.kosmaAnimation.duration,
                    filteredTracks
                );
                
                kosmaAction = sabitMixer.clipAction(filteredAnimation);
                kosmaAction.setLoop(THREE.LoopRepeat, Infinity);
                kosmaAction.clampWhenFinished = false;
                kosmaAction.zeroSlopeAtStart = false;
                kosmaAction.zeroSlopeAtEnd = false;
                kosmaAction.timeScale = 1.0; // 24 frame için optimize edilmiş hız
                kosmaAction.setEffectiveTimeScale(1.0); // Zaman ölçeğini düzgün ayarla
                kosmaAction.setEffectiveWeight(0.0);
                kosmaAction.enabled = true;
                kosmaAction.reset(); // Animasyonu doğru konumdan başlat
                kosmaAction.play();
                kosmaAction.paused = true;
                console.log('Kosma animasyon hazırlandı (pozisyon filtrelenmiş):', filteredAnimation.name);
            } else {
                console.log('Kosma animasyonu henüz yüklenmedi, daha sonra bağlanacak');
                // Animasyon daha sonra yüklenirse bağlamak için timeout
                setTimeout(() => {
                    if (window.kosmaAnimation && sabitMixer) {
                        console.log('Kosma animasyonunu gecikmeli olarak bağlıyorum...');
                          // Pozisyon track'lerini tamamen filtrele
                        const filteredTracks = window.kosmaAnimation.tracks.filter(track => {
                            return !track.name.includes('.position');
                        });                        // Gecikmeli kosma animasyonu - 24 frame optimizasyonu ile
                        const filteredAnimation = new THREE.AnimationClip(
                            window.kosmaAnimation.name + '_walking_delayed',
                            window.kosmaAnimation.duration,
                            filteredTracks
                        );
                        
                        kosmaAction = sabitMixer.clipAction(filteredAnimation);
                        kosmaAction.setLoop(THREE.LoopRepeat, Infinity);
                        kosmaAction.clampWhenFinished = false;
                        kosmaAction.zeroSlopeAtStart = false;
                        kosmaAction.zeroSlopeAtEnd = false;
                        kosmaAction.timeScale = 1.0; // 24 frame için optimize edilmiş hız
                        kosmaAction.setEffectiveTimeScale(1.0); // Zaman ölçeğini düzgün ayarla
                        kosmaAction.setEffectiveWeight(0.0);
                        kosmaAction.enabled = true;
                        kosmaAction.reset(); // Animasyonu doğru konumdan başlat
                        kosmaAction.play();
                        kosmaAction.paused = true;
                        console.log('Kosma animasyon hazırlandı (gecikmeli, pozisyon filtrelenmiş):', filteredAnimation.name);
                    }
                }, 1000);
            }
            
            object.name = 'WalkingCharacter';
            characterModel = object;
            scene.add(object);
            models.push(object);
            onModelLoaded();
        },
        (progress) => {
            console.log('Sabit model yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(6, progress.loaded / progress.total);        },        (error) => {
            console.error('Sabit model yüklenemedi:', error);
            addPlaceholderModel(8, 0, 8, 'WalkingCharacter', 0x00FFFF); // Y pozisyonu düzeltildi: -1.9 → 0
            onModelLoaded();
        }
    );

    // Desert Terrain Model - Büyük çöl arazisi
    fbxLoader.load(
        './desert_terrain.fbx',        (object) => {
            console.log('Desert Terrain yüklendi:', object);
            object.position.set(0, -5, 0); // Y pozisyonu düzeltildi: -30 → -5 (daha görünür)
            object.scale.set(3, 1, 3);
            object.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = true;
                    
                    if (child.material) {
                        const materials = Array.isArray(child.material) ? child.material : [child.material];
                        materials.forEach(mat => {
                            mat.side = THREE.FrontSide;
                            if (mat.map) mat.map.flipY = false;
                            mat.color.setHex(0xD2B48C); 
                            mat.roughness = 0.9;
                            mat.metalness = 0.0;
                            if (mat.emissive) {
                                mat.emissive.setHex(0x0A0704);
                            }
                        });
                    }

                    // Make terrain rugged
                    if (child.geometry) {
                        const vertices = child.geometry.attributes.position.array;
                        for (let i = 0; i < vertices.length; i += 3) {
                            // Affect Y coordinate (vertices[i+1])
                            // Add a small random value, scaled by the terrain's overall scale
                            const randomOffset = (Math.random() - 0.5) * 0.25; // Adjust multiplier for more/less ruggedness
                            vertices[i+1] += randomOffset;
                        }
                        child.geometry.attributes.position.needsUpdate = true;
                        child.geometry.computeVertexNormals(); // Important for lighting after vertex modification
                    }
                }
            });
              object.name = 'DesertTerrain';
            desertTerrain = object;
            scene.add(object);
            models.push(object); // Desert terrain'i models dizisine ekle
            onModelLoaded();
        },        (progress) => {
            console.log('Desert Terrain yükleme:', (progress.loaded / progress.total * 100) + '%');
            updateLoadingProgress(8, progress.loaded / progress.total); // Index 8 (son model)
        },        (error) => {
            console.error('Desert Terrain yüklenemedi:', error);
            // Hata durumunda basit bir çöl arazisi oluştur
            createFallbackTerrain();
            onModelLoaded();
        }
    );
}

// Fallback çöl arazisi oluşturma fonksiyonu
function createFallbackTerrain() {
    console.log('Fallback çöl arazisi oluşturuluyor...');
    
    // Büyük çöl arazisi geometrisi
    const terrainGeometry = new THREE.PlaneGeometry(80, 80, 64, 64);
    
    // Çöl malzemesi
    const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0xD2B48C, // Çöl kumu rengi
        roughness: 0.95,
        metalness: 0.02,
        transparent: false
    });
    
    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.set(0, -2, 0); // Hafif aşağıda
    terrainMesh.receiveShadow = true;
    terrainMesh.name = 'FallbackDesertTerrain';
    
    // Arazi yüzeyini dalgalı yapma
    const vertices = terrainMesh.geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        // Y koordinatını değiştir (kum tepeleri için)
        vertices[i+1] += (Math.random() - 0.5) * 2.0; // Daha belirgin tepeler
    }
    terrainMesh.geometry.attributes.position.needsUpdate = true;
    terrainMesh.geometry.computeVertexNormals();
    
    // Çöl dekoru ekle - kum tepeleri
    for (let i = 0; i < 8; i++) {
        const moundGeometry = new THREE.SphereGeometry(3 + Math.random() * 2, 16, 8);
        const moundMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.1, 0.3, 0.6 + Math.random() * 0.2),
            roughness: 0.9,
            metalness: 0.0
        });
        
        const mound = new THREE.Mesh(moundGeometry, moundMaterial);
        mound.position.set(
            (Math.random() - 0.5) * 60,
            -1.5,
            (Math.random() - 0.5) * 60
        );
        mound.scale.y = 0.3; // Düz tepeler
        mound.receiveShadow = true;
        mound.name = `DesertMound_${i}`;
        scene.add(mound);
    }
    
    // Ana terrain'i sahneye ekle
    scene.add(terrainMesh);
    desertTerrain = terrainMesh;
    
    console.log('Fallback çöl arazisi oluşturuldu');
}

function addPlaceholderModel(x, y, z, name, color) {
    let geometry;
    if (name.includes('Pyramid')) {
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
    setupChamberLightControls();
    setupHieroglyphPanels();
    setupTombPuzzle();
}

// Mezar bulmaca sistem kurulumu
function setupTombPuzzle() {
    // Mezar bulmacası etkileşimini ayarla
    setupTombPuzzleInteraction();
    
    console.log('Mezar bulmaca sistemi kuruldu');
}

function setupSunControls() {
    // Manuel pozisyon kontrolleri
    const controls = ['sunX', 'sunY', 'sunZ', 'lightIntensity', 'rotationSpeed'];
    
    controls.forEach(id => {
        const slider = document.getElementById(id);
        const valueInput = document.getElementById(id + 'Value');
        
        if (slider && valueInput) {
            slider.addEventListener('input', () => {
                valueInput.value = slider.value;
                if (id === 'rotationSpeed') {
                    window.rotationSpeed = parseFloat(slider.value);
                } else {
                    updateSunPosition();
                }
            });
            
            valueInput.addEventListener('input', () => {
                slider.value = valueInput.value;
                if (id === 'rotationSpeed') {
                    window.rotationSpeed = parseFloat(valueInput.value);
                } else {
                    updateSunPosition();
                }
            });
        }
    });
    
    // Otomatik rotasyon checkbox kontrolü
    const autoRotateCheckbox = document.getElementById('autoRotate');
    if (autoRotateCheckbox) {
        autoRotateCheckbox.checked = window.autoRotate;
        autoRotateCheckbox.addEventListener('change', function() {
            window.autoRotate = this.checked;
            
            // Manuel kontrollerin etkinliğini ayarla
            const manualControls = ['sunX', 'sunZ']; // Y her zaman manuel olarak ayarlanabilir
            manualControls.forEach(id => {
                const slider = document.getElementById(id);
                const input = document.getElementById(id + 'Value');
                if (slider) slider.disabled = this.checked;
                if (input) input.disabled = this.checked;
            });
            
            console.log('Otomatik güneş hareketi:', this.checked ? 'Etkin' : 'Devre dışı');
        });
        
        // Başlangıçta manuel kontrollerin durumunu ayarla
        const manualControls = ['sunX', 'sunZ'];
        manualControls.forEach(id => {
            const slider = document.getElementById(id);
            const input = document.getElementById(id + 'Value');
            if (slider) slider.disabled = window.autoRotate;
            if (input) input.disabled = window.autoRotate;
        });
    }
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
        
        // Sadece büyük piramit (Pyramid) için gizli mezar bulmacası - diğerleri normal seçim
        if (clickedObject.name === 'Pyramid') {
            // Gizli oda turu aktifse mezar bulmacasını gösterme
            if (!hiddenChamberTourActive) {
                showTombPuzzle();
            }
            return; // Büyük piramide tıklandığında model seçimi yapma
        }
        
        if (selectedModel) {
            // Önceki model seçimi kaldırılırken animasyonu sıfırla
            if (selectedModel.name === 'WalkingCharacter') {
                // Yeni sistemde animasyon otomatik olarak yönetiliyor
                wasMoving = false;            }
            deselectModel(selectedModel);
        }
        
        if (models.includes(clickedObject)) {
            selectedModel = clickedObject;
            selectModel(selectedModel);
            document.getElementById('selectedModel').textContent = `Selected Model: ${selectedModel.name}`;
            updateCharacterStatus();
        }    } else {
        if (selectedModel) {
            // Model seçimi kaldırılırken animasyonu sıfırla
            if (selectedModel.name === 'WalkingCharacter') {
                // Yeni sistemde animasyon otomatik olarak yönetiliyor
                wasMoving = false;
            }
            deselectModel(selectedModel);
            selectedModel = null;
            document.getElementById('selectedModel').textContent = 'Selected Model: Yok';
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
    
    // ESC tuşu ile gizli odadan çık - öncelik
    if (event.key === 'Escape') {
        console.log('ESC tuşuna basıldı, durum kontrol ediliyor...');
        console.log('hiddenChamberTourActive:', hiddenChamberTourActive);
        
        if (hiddenChamberTourActive) {
            console.log('ESC tuşuna basıldı - gizli odadan çıkılıyor...');
            event.preventDefault();
            event.stopPropagation();
            
            // Çift güvenlik: önce normal çıkış, çalışmazsa acil çıkış
            try {
                stopHiddenChamberTour();
                
                // 500ms sonra kontrol et, hala gizli odadaysa acil çıkış yap
                setTimeout(() => {
                    if (hiddenChamberTourActive) {
                        console.log('Normal çıkış başarısız - acil durum çıkışı yapılıyor!');
                        emergencyExitHiddenChamber();
                    }
                }, 500);
            } catch (error) {
                console.error('Normal çıkış hatası:', error);
                emergencyExitHiddenChamber();
            }
            return;
        }
    }
    
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
                statusElement.textContent = 'Character: Walkingr';
            } else {
                statusElement.textContent = 'Character: Standing';
            }
        } else {
            statusElement.textContent = 'Character: Not Selected';
        }
    }
}

function updateSelectedModel() {
    if (!selectedModel) return;
    
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(camera.up, cameraDirection).normalize();
    
    const moveVector = new THREE.Vector3();    if (keys.w) moveVector.add(cameraDirection);
    if (keys.s) moveVector.add(cameraDirection.clone().multiplyScalar(-1));
    if (keys.a) moveVector.add(cameraRight);
    if (keys.d) moveVector.add(cameraRight.clone().multiplyScalar(-1));
      // Yeni animasyon sistemi - WalkingCharacter için
    if (selectedModel.name === 'WalkingCharacter') {
        updateCharacterAnimation();
    }
    
      // Sadece hareket tuşları basılıysa modeli hareket ettir
    if (keys.w || keys.s || keys.a || keys.d) {
        moveVector.y = 0;
        moveVector.normalize();
          // Karakterin hareket yönüne dönmesi - daha yumuşak
        if (moveVector.length() > 0) {
            const targetAngle = Math.atan2(moveVector.x, moveVector.z);
            // Daha yumuşak dönüş için lerp kullan
            const currentAngle = selectedModel.rotation.y;
            let angleDiff = targetAngle - currentAngle;
            
            // Açı farkını -π ile π arasında tut
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            // Daha yumuşak interpolasyon faktörü
            selectedModel.rotation.y = currentAngle + angleDiff * 0.08;
        }
        
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
      // Animasyon mixer'larını güncelle - delta clamping ile
    const delta = Math.min(clock.getDelta(), 0.1); // Delta'yı sınırla
    if (characterMixer) {
        characterMixer.update(delta);
    }
    if (sabitMixer && sabitMixer !== characterMixer) {
        sabitMixer.update(delta);
    }
    
    // Update automatic rotating light system
    updateLightPosition();
    
    // Tomb tour animation
    if (tombTourActive) {
        updateTombTour();
    }
    
    // Gizli oda için işlemler
    if (hiddenChamberTourActive) {
        if (!hiddenChamberScene) {
            console.error('Error: Hidden chamber tour active but hiddenChamberScene not found!');
        } else if (!hiddenChamberScene.visible) {
            console.log('Hidden chamber tour active but scene not visible, making it visible...');
            hiddenChamberScene.visible = true;
        }
        
        // Meşale alevlerini canlandır
        try {
            animateFlames();
        } catch (error) {
            console.error('Error occurred while running flame animation:', error);
        }
        
        // Kamera hareketini güncelle (serbest dolaşım için)
        controls.update();
    }
    
    controls.update();
    updateSelectedModel();
    
    // Render - tüm sahneyi çizdir
    renderer.render(scene, camera);
}

// Otomatik dönen ışık pozisyonu güncellemesi
function updateLightPosition() {
    if (window.autoRotate) {
        window.lightAngle += 0.01 * window.rotationSpeed;
        
        // Directional light pozisyonunu dairesel yolda güncelle
        directionalLight.position.x = Math.sin(window.lightAngle) * window.lightRadius;
        directionalLight.position.z = Math.cos(window.lightAngle) * window.lightRadius;
          // Update the sun visual representation as well
        sun.position.copy(directionalLight.position);
        
        // Update UI sliders during automatic movement
        const sunXSlider = document.getElementById('sunX');
        const sunZSlider = document.getElementById('sunZ');
        const sunXValue = document.getElementById('sunXValue');
        const sunZValue = document.getElementById('sunZValue');
        
        if (sunXSlider && sunXValue) {
            sunXSlider.value = directionalLight.position.x.toFixed(1);
            sunXValue.value = directionalLight.position.x.toFixed(1);
        }
        
        if (sunZSlider && sunZValue) {
            sunZSlider.value = directionalLight.position.z.toFixed(1);
            sunZValue.value = directionalLight.position.z.toFixed(1);
        }
    }
}

// Update tomb tour animation
function updateTombTour() {
    // Placeholder for tomb tour animation
    // This function can be implemented based on specific tour requirements
    console.log('Tomb tour update called');
}

// Set up event listeners for hieroglyph panels
function setupHieroglyphPanels() {
    const panels = document.querySelectorAll('.hieroglyph-panel');
    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            const panelId = panel.id;
            showHieroglyphInfo(panelId);
        });
    });
}

// Show hieroglyph info panel
function showHieroglyphInfo(panelId) {
    const data = hieroglyphData[panelId];
    if (!data) return;
    
    document.getElementById('hieroglyphTitle').textContent = data.title;
    document.getElementById('hieroglyphDescription').textContent = data.description;
    
    // Create puzzle options
    const optionsContainer = document.getElementById('puzzleOptions');
    optionsContainer.innerHTML = '';
    
    data.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'puzzle-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => checkPuzzleAnswer(index, data.correct, optionDiv);
        optionsContainer.appendChild(optionDiv);    });
    
    // Clear result text
    document.getElementById('puzzleResult').textContent = '';
    
    // Show panel
    document.getElementById('hieroglyphInfo').style.display = 'block';
}

// Check puzzle answer
function checkPuzzleAnswer(selectedIndex, correctIndex, selectedElement) {
    const resultElement = document.getElementById('puzzleResult');
    const options = document.querySelectorAll('.puzzle-option');
    
    // Disable all options
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
      if (selectedIndex === correctIndex) {
        selectedElement.classList.add('correct');
        resultElement.textContent = '🎉 Correct! Congratulations!';
        resultElement.style.color = '#00ff00';
    } else {
        selectedElement.classList.add('wrong');
        options[correctIndex].classList.add('correct');
        resultElement.textContent = '❌ Wrong. The correct answer is marked.';
        resultElement.style.color = '#ff6666';
    }
}

// Close hieroglyph panel
function closeHieroglyphInfo() {
    document.getElementById('hieroglyphInfo').style.display = 'none';
}

// Start camel tour
function startCamelTour() {
    if (camelTourActive) return;
      camelTourActive = true;
    camelTourStartTime = Date.now();
    
    // Save original camera position
    originalCameraPosition.copy(camera.position);
    originalCameraTarget.copy(controls.target);
    
    // Disable controls    controls.enabled = false;
    
    // Update buttons
    document.getElementById('startCamelTour').disabled = true;
    document.getElementById('stopCamelTour').disabled = false;
    
    // Start sandstorm
    setTimeout(() => {
        startSandstorm();
    }, 3000); // Sandstorm starts after 3 seconds
    
    console.log('Camel tour started!');
}

// Stop camel tour
function stopCamelTour() {
    if (!camelTourActive) return;
    
    camelTourActive = false;
    
    // Re-enable camera controls    controls.enabled = true;
    
    // Bring camera position back to near the original position
    camera.position.copy(originalCameraPosition);
    controls.target.copy(originalCameraTarget);
    controls.update();
    
    // Stop sandstorm
    stopSandstorm();
    
    // Update buttons    document.getElementById('startCamelTour').disabled = false;
    document.getElementById('stopCamelTour').disabled = true;
    
    console.log('Camel tour stopped!');
}

// Update camel tour animation
function updateCamelTour() {    const elapsed = Date.now() - camelTourStartTime;
    const progress = Math.min(elapsed / camelTourDuration, 1);
    
    // Stop automatically
    if (progress >= 1) {
        stopCamelTour();
        return;
    }
    
    // Camera movement along the caravan route (circular path)
    const radius = 20;    const speed = 2;
    const angle = progress * Math.PI * speed;
    
    // Move camera along the caravan route
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 5 + Math.sin(progress * Math.PI * 4) * 2; // Up and down fluctuation
    
    camera.position.set(x, y, z);
    
    // Point camera towards the center of the scene
    controls.target.set(0, 2, 0);
    controls.update();
}

// Start sandstorm
function startSandstorm() {
    const overlay = document.getElementById('sandstormOverlay');
    overlay.classList.add('sandstorm-active');
    sandstormActive = true;
    
    // Change scene background to sandstorm color
    scene.background = new THREE.Color(0xC4926C);
    
    // Reduce light intensity    ambientLight.intensity = 0.2;
    directionalLight.intensity = 0.8;
    
    console.log('Sandstorm started!');
}

// Stop sandstorm
function stopSandstorm() {
    const overlay = document.getElementById('sandstormOverlay');
    overlay.classList.remove('sandstorm-active');
    sandstormActive = false;
    
    // Sahne arka planını normale döndür
    scene.background = new THREE.Color(0x87CEEB);
    
    // Işık yoğunluğunu normale döndür
    ambientLight.intensity = 0.4;    directionalLight.intensity = 1.5;
    
    console.log('Sandstorm stopped!');
}

// Hidden Tomb Puzzle Functions

// Show tomb puzzle
function showTombPuzzle() {    const puzzleElement = document.getElementById('tombPuzzle');
    puzzleElement.style.display = 'block';
    tombPuzzleActive = true;
    
    // Disable controls
    controls.enabled = false;
    
    // Reset puzzle state
    resetTombPuzzle();
    
    console.log('Tomb puzzle opened');
}

// Close tomb puzzle
function closeTombPuzzle() {    const puzzleElement = document.getElementById('tombPuzzle');
    puzzleElement.style.display = 'none';
    tombPuzzleActive = false;
    
    // Re-enable controls
    controls.enabled = true;
    
    console.log('Tomb puzzle closed');
}

// Reset tomb puzzle
function resetTombPuzzle() {
    selectedSequence = [];
    
    // Clear all slots
    for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`slot${i}`);
        slot.textContent = '';
        slot.className = 'sequence-slot';
        
        // Add sequence number again
        const numberDiv = document.createElement('div');
        numberDiv.className = 'sequence-number';
        numberDiv.textContent = i;        slot.appendChild(numberDiv);
    }
    
    // Make all hieroglyphs reusable again
    const hieroglyphs = document.querySelectorAll('.selectable-hieroglyph');
    hieroglyphs.forEach(h => {
        h.classList.remove('used');
        h.style.pointerEvents = 'auto';
    });
    
    // Clear status message    const statusElement = document.getElementById('puzzleStatus');
    statusElement.textContent = '';
    statusElement.className = 'puzzle-status';
    
    console.log('Tomb puzzle reset');
}

// Check tomb puzzle sequence
function checkTombSequence() {
    const statusElement = document.getElementById('puzzleStatus');
    
    // Check if sequence is complete
    if (selectedSequence.length !== 4) {
        statusElement.textContent = 'Please select 4 hieroglyphs in order!';
        statusElement.className = 'puzzle-status error';
        return;
    }
    
    // Check correct sequence
    const isCorrect = selectedSequence.every((symbol, index) => 
        symbol === correctSequence[index]    );
    
    if (isCorrect) {
        statusElement.textContent = '🎉 Congratulations! Hidden tomb opened!';
        statusElement.className = 'puzzle-status success';
        
        // Start hidden chamber tour after a short delay
        setTimeout(() => {
            closeTombPuzzle();
            startHiddenChamberTour();
        }, 2000);
        
        console.log('Tomb puzzle solved correctly! Hidden chamber tour starting...');
    } else {
        statusElement.textContent = '❌ Wrong sequence! Try again.';
        statusElement.className = 'puzzle-status error';
        
        // Reset after 2 seconds
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
                statusElement.textContent = 'Sequence completed! Click the "Check" button.';
                statusElement.className = 'puzzle-status';
            } else {
                statusElement.textContent = `${selectedSequence.length}/4 hieroglyph has been selected.`;
                statusElement.className = 'puzzle-status';
            }
        });
    });
}

// Global fonksiyonları window objesine ekle (HTML'den erişilebilir olması için)
window.closeHieroglyphInfo = closeHieroglyphInfo;
window.startCamelTour = startCamelTour;
window.stopCamelTour = stopCamelTour;
window.showTombPuzzle = showTombPuzzle;
window.closeTombPuzzle = closeTombPuzzle;
window.resetTombPuzzle = resetTombPuzzle;
window.checkTombSequence = checkTombSequence;

// Karakter animasyon yönetimi
// Karakter animasyon yönetimi
function updateCharacterAnimation() {
    if (!characterMixer || !selectedModel || selectedModel.name !== 'WalkingCharacter') return;
    
    const isMoving = keys.w || keys.s || keys.a || keys.d;
    
    if (isMoving && !wasMoving) {
        // Standing Idle.fbx'ten Female Walk.fbx'e geçiş
        if (characterAnimations.idle && characterAnimations.walk) {
            characterAnimations.idle.fadeOut(0.3);
            characterAnimations.walk.reset().fadeIn(0.3).play();
            currentAction = characterAnimations.walk;
            console.log('Karakter yürümeye başladı - Female Walk.fbx animasyonu çalıyor');
        }
        wasMoving = true;
    } else if (!isMoving && wasMoving) {
        // Female Walk.fbx'ten Standing Idle.fbx'e geçiş
        if (characterAnimations.walk && characterAnimations.idle) {
            characterAnimations.walk.fadeOut(0.3);
            characterAnimations.idle.reset().fadeIn(0.3).play();
            currentAction = characterAnimations.idle;
            console.log('Karakter durdu - Standing Idle.fbx animasyonu çalıyor');
        }
        wasMoving = false;
    }
}

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
    
    // Oda ışıklandırması    createChamberLighting();
    
    // Add to scene but make invisible initially
    hiddenChamberScene.visible = false;
    scene.add(hiddenChamberScene);
    
    console.log('Hidden chamber scene created');
}

function createChamberWalls() {
    // Main chamber walls - square shaped
    const wallHeight = 4;
    const wallThickness = 0.2;
    const roomSize = 8;
    
    const wallMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        map: createStoneTexture()    });
    
    // Wall geometry
    const wallGeometry = new THREE.BoxGeometry(roomSize, wallHeight, wallThickness);
    
    // Create 4 walls
    const walls = [
        { position: [0, wallHeight/2, -roomSize/2], rotation: [0, 0, 0] }, // Back wall
        { position: [0, wallHeight/2, roomSize/2], rotation: [0, 0, 0] },  // Front wall  
        { position: [-roomSize/2, wallHeight/2, 0], rotation: [0, Math.PI/2, 0] }, // Left wall
        { position: [roomSize/2, wallHeight/2, 0], rotation: [0, Math.PI/2, 0] }   // Right wall
    ];
    
    walls.forEach((wallConfig, index) => {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(...wallConfig.position);
        wall.rotation.set(...wallConfig.rotation);
        wall.castShadow = true;
        wall.receiveShadow = true;
        wall.name = `ChamberWall_${index}`;
        hiddenChamberScene.add(wall);    });
    
    // Create floor
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
    
    // Create ceiling
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = wallHeight;
    ceiling.name = 'ChamberCeiling';
    hiddenChamberScene.add(ceiling);
}

function createSarcophagus() {
    // Sarcophagus main body
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
    
    // Sarcophagus lid (as a separate object)
    const lidGeometry = new THREE.BoxGeometry(2.6, 0.2, 1.3);
    const lidMaterial = new THREE.MeshPhongMaterial({
        color: 0xDAA520,
        shininess: 80
    });
    
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.set(0, 0.9, -2);    lid.castShadow = true;
    lid.name = 'SarcophagusLid';
    
    // Add hieroglyph details
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
            emissive: 0xFFD700,
            transparent: true,
            opacity: 0.8
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
    
    // Brighter ambient light than main scene
    chamberAmbientLight = new THREE.AmbientLight(0xffffff, 1.2); // Brighter than main scene (from 0.6 to 1.2)
    chamberAmbientLight.name = 'ChamberAmbient';
    hiddenChamberScene.add(chamberAmbientLight);
    chamberLights.push(chamberAmbientLight);
    
    // Stronger directional light than main scene
    chamberMainLight = new THREE.DirectionalLight(0xffffff, 1.8); // Brighter than main scene (from 0.9 to 1.8)
    chamberMainLight.position.set(0, 8, 2); // Lighting from above the room
    chamberMainLight.castShadow = true;
    chamberMainLight.shadow.mapSize.width = 1024;
    chamberMainLight.shadow.mapSize.height = 1024;
    chamberMainLight.shadow.camera.near = 0.5;
    chamberMainLight.shadow.camera.far = 20;
    chamberMainLight.shadow.camera.left = -10;
    chamberMainLight.shadow.camera.right = 10;
    chamberMainLight.shadow.camera.top = 10;
    chamberMainLight.shadow.camera.bottom = -10;    hiddenChamberScene.add(chamberMainLight);
    chamberLights.push(chamberMainLight);
    
    // Brighter HemisphereLight than main scene
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x8B4513, 0.8); // Increased from 0.4 to 0.8
    hemiLight.position.set(0, 20, 0);
    hiddenChamberScene.add(hemiLight);
    chamberLights.push(hemiLight);
    
    // Brighter additional light sources than main scene
    const frontLight = new THREE.DirectionalLight(0xffffff, 0.8); // Increased from 0.4 to 0.8
    frontLight.position.set(0, 5, 15);
    hiddenChamberScene.add(frontLight);
    chamberLights.push(frontLight);    
    const additionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6); // Increased from 0.3 to 0.6
    additionalLight2.position.set(5, 6, -5);
    hiddenChamberScene.add(additionalLight2);
    chamberLights.push(additionalLight2);
    
    // Corner lights - softer
    const cornerLight1 = new THREE.PointLight(0xffffff, 0.8, 12);
    cornerLight1.position.set(-3, 3, -3);
    hiddenChamberScene.add(cornerLight1);
    chamberLights.push(cornerLight1);
    
    const cornerLight2 = new THREE.PointLight(0xffffff, 0.8, 12);
    cornerLight2.position.set(3, 3, -3);
    hiddenChamberScene.add(cornerLight2);
    chamberLights.push(cornerLight2);
    
    // Decorative torch lights (compatible level with main scene)    chamberData.ambientData.torchPositions.forEach((pos, index) => {
        // Point light - compatible with main scene
        const torchLight = new THREE.PointLight(0xFF7722, 1.0, 10, 1.5); // Softer level
        torchLight.position.set(pos.x, pos.y, pos.z);
        torchLight.castShadow = true;
        torchLight.shadow.mapSize.width = 256;
        torchLight.shadow.mapSize.height = 256;
        
        // Torch visual representation
        const torchGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1, 8);
        const torchMaterial = new THREE.MeshPhongMaterial({
            color: 0x654321
        });
        
        const torch = new THREE.Mesh(torchGeometry, torchMaterial);
        torch.position.set(pos.x, pos.y - 0.5, pos.z);
        
        // Flame effect - bigger and brighter
        const flameGeometry = new THREE.SphereGeometry(0.3, 8, 8); // From 0.25 to 0.3
        const flameMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFAA66, // Brighter color
            transparent: true,
            opacity: 0.8
        });
        
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(pos.x, pos.y + 0.3, pos.z);
          hiddenChamberScene.add(torchLight);
        hiddenChamberScene.add(torch);
        hiddenChamberScene.add(flame);
        
        chamberLights.push(torchLight);
        chamberTorchLights.push({ light: torchLight, flame: flame });
    }
    

function createStoneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create stone texture
    context.fillStyle = '#8B7355';
    context.fillRect(0, 0, 256, 256);
    
    // Rastgele noktalar ekle
    for (let i = 0; i < 50; i++) {
        context.fillStyle = '#654321';
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
    
    console.log('Gizli Oda turu başlatılıyor...');
    
    // Gizli oda sahnesi henüz oluşturulmadıysa oluştur
    if (!hiddenChamberScene) {
        createHiddenChamberScene();
    }
    
    hiddenChamberTourActive = true;
    
    // Orijinal sahne verilerini kaydet
    originalCameraPosition.copy(camera.position);    originalCameraTarget.copy(controls.target);
    console.log('Original camera position saved:', originalCameraPosition);
    console.log('Original camera target saved:', originalCameraTarget);
    
    // Hide main scene objects
    models.forEach(model => {
        if (model) model.visible = false;
    });
    plane.visible = false;
    sun.visible = false;
    console.log('Main scene objects hidden');
    
    // Show hidden chamber scene
    hiddenChamberScene.visible = true;
    console.log('Hidden chamber scene shown');
    
    // Show hidden chamber light controls
    showChamberLightControls();
    
    // ENABLE camera controls (free movement instead of automatic tour)
    controls.enabled = true;
    
    // Show overlay
    const overlay = document.getElementById('tombTourOverlay');
    if (overlay) {
        overlay.classList.add('tomb-tour-active');
        console.log('Tomb tour overlay shown');
    }
    
    // Keep scene lighting at compatible level with hidden chamber
    directionalLight.intensity = 0.9; // Same level as main scene
    ambientLight.intensity = 0.6; // Same level as main scene
    
    console.log('Hidden Chamber - Free Exploration Mode started!');
    
    // Set initial camera position
    camera.position.set(0, 4, 3);
    controls.target.set(0, 1, 0);
    controls.update();
    
    
}

function updateHiddenChamberTour() {
    if (!hiddenChamberTourActive) return;
      const elapsed = Date.now() - hiddenChamberStartTime;
    const totalDuration = chamberData.cameraPath.reduce((sum, path) => sum + path.duration, 0);
    
    // Stop when tour is completed
    if (elapsed >= totalDuration) {
        stopHiddenChamberTour();
        return;
    }
    
    // Find current path segment
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
    
    // Interpolate camera position
    if (currentPathIndex < chamberData.cameraPath.length - 1) {
        const nextSegment = chamberData.cameraPath[currentPathIndex + 1];
        
        // Smooth interpolation
        const easeProgress = easeInOutCubic(segmentProgress);
        
        // Position interpolation
        camera.position.lerpVectors(
            new THREE.Vector3(currentSegment.position.x, currentSegment.position.y, currentSegment.position.z),
            new THREE.Vector3(nextSegment.position.x, nextSegment.position.y, nextSegment.position.z),
            easeProgress        );
        
        // Target interpolation
        controls.target.lerpVectors(
            new THREE.Vector3(currentSegment.target.x, currentSegment.target.y, currentSegment.target.z),
            new THREE.Vector3(nextSegment.target.x, nextSegment.target.y, nextSegment.target.z),
            easeProgress
        );
    }
    
    // Update message
    document.getElementById('tombTourText').textContent = currentSegment.description;
    
    // Flame animation
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
              // Light intensity animation
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
    
    console.log('Hidden Chamber Exploration stopping...');
    
    hiddenChamberTourActive = false;
    
    // Hide overlay
    const overlay = document.getElementById('tombTourOverlay');
    if (overlay) {
        overlay.classList.remove('tomb-tour-active');
        overlay.style.display = 'none'; // Force hide
        console.log('Tomb tour overlay hidden');
    }
    
    // Show main scene objects again
    models.forEach(model => {
        if (model) {
            model.visible = true;
        }
    });
    if (plane) plane.visible = true;
    if (sun) sun.visible = true;
    console.log('Main scene objects shown again');
    
    // Hide hidden chamber scene
    if (hiddenChamberScene) {
        hiddenChamberScene.visible = false;
        console.log('Hidden chamber scene hidden');
    }
    
    // Hide hidden chamber light controls
    hideChamberLightControls();
    
    // Keep camera controls enabled (already enabled)
    controls.enabled = true;
    
    // Return scene background to original color
    scene.background = new THREE.Color(0x87CEEB);
    
    // Re-enable fog (if any)
    scene.fog = null; // or your original fog settings
    
    // Force renderer update
    renderer.setClearColor(0x87CEEB);
    
    // Return camera position to original (smooth transition)
    animateToOriginalPosition();
    
    // Return lights to main scene level
    if (directionalLight) directionalLight.intensity = 0.9;
    if (ambientLight) ambientLight.intensity = 0.6;
    
    // Force render
    renderer.render(scene, camera);
    
    console.log('Hidden Chamber Exploration completed!');
}

function animateToOriginalPosition() {
    console.log('Camera being returned to original position...');
    console.log('Starting position:', camera.position);
    console.log('Target position:', originalCameraPosition);
    
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
        } else {
            console.log('Camera animation completed');
            console.log('Final position:', camera.position);
        }
    }
    
    animateStep();
}

// Sarcophagus interactive function
function onSarcophagusClick() {
    if (!hiddenChamberTourActive || !sarcophagus) return;
    
    // Sarcophagus opening animation
    const lid = scene.getObjectByName('SarcophagusLid');
    if (lid) {
        // Slowly open the lid
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
        
        // Golden sparkle effect when sarcophagus opens
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
            -2 + (Math.random() - 0.5) * 1        );
        
        // Random movement vector
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
    
    // Sparkle animation
    function animateSparkles() {
        const currentTime = Date.now();
        
        sparkles.forEach((sparkle, index) => {
            const elapsed = currentTime - sparkle.userData.startTime;
            const progress = elapsed / sparkle.userData.life;
            
            if (progress >= 1) {
                hiddenChamberScene.remove(sparkle);
                sparkles.splice(index, 1);
                return;            }
            
            // Move
            sparkle.position.add(sparkle.userData.velocity);
            
            // Aging effect
            sparkle.material.opacity = 0.8 * (1 - progress);
            sparkle.scale.setScalar(1 - progress * 0.5);
        });
        
        if (sparkles.length > 0) {
            requestAnimationFrame(animateSparkles);
        }
    }
    
    animateSparkles();
}

// Hidden Chamber Light Control Functions
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
        }    });
    
    // Color control
    const colorPicker = document.getElementById('chamberLightColor');
    if (colorPicker) {
        colorPicker.addEventListener('input', () => {
            updateChamberLighting();
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetChamberLights');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetChamberLights();
        });
    }
}

function updateChamberLighting() {    if (!hiddenChamberScene || !hiddenChamberTourActive) return;
    
    // Main light intensity
    const mainIntensity = parseFloat(document.getElementById('chamberMainIntensity').value);
    if (chamberMainLight) {
        chamberMainLight.intensity = mainIntensity;
    }
    
    // Ambient light
    const ambientIntensity = parseFloat(document.getElementById('chamberAmbientIntensity').value);
    if (chamberAmbientLight) {
        chamberAmbientLight.intensity = ambientIntensity;
    }
    
    // Torch lights
    const torchIntensity = parseFloat(document.getElementById('chamberTorchIntensity').value);
    chamberTorchLights.forEach(light => {
        if (light && light.isPointLight) {
            light.intensity = torchIntensity;
        }
    });
    
    // Sarcophagus spot light
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
    // Ana sahne ile uyumlu varsayılan değerler
    document.getElementById('chamberMainIntensity').value = 0.9;
    document.getElementById('chamberMainIntensityValue').value = 0.9;
    document.getElementById('chamberAmbientIntensity').value = 0.6;
    document.getElementById('chamberAmbientIntensityValue').value = 0.6;
    document.getElementById('chamberTorchIntensity').value = 1.0;
    document.getElementById('chamberTorchIntensityValue').value = 1.0;
    document.getElementById('chamberSarcophagusIntensity').value = 1.5;
    document.getElementById('chamberSarcophagusIntensityValue').value = 1.5;
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
}

// Acil durum çıkış fonksiyonu - anlık geri dönüş
function emergencyExitHiddenChamber() {
    console.log('ACİL DURUM ÇIKIŞI - Anlık geri dönüş!');
    
    hiddenChamberTourActive = false;
    
    // Overlay'i anlık gizle
    const overlay = document.getElementById('tombTourOverlay');
    if (overlay) {
        overlay.classList.remove('tomb-tour-active');
        overlay.style.display = 'none';
    }
    
    // Ana sahne objelerini anlık göster
    models.forEach(model => {
        if (model) model.visible = true;
    });
    if (plane) plane.visible = true;
    if (sun) sun.visible = true;
    
    // Gizli oda sahnesini anlık gizle
    if (hiddenChamberScene) hiddenChamberScene.visible = false;
    
    // Kamera pozisyonunu anlık döndür
    camera.position.copy(originalCameraPosition);
    controls.target.copy(originalCameraTarget);
    controls.update();
    
    // Sahne ayarlarını orijinal haline döndür
    scene.background = new THREE.Color(0x87CEEB);
    renderer.setClearColor(0x87CEEB);
    
    // Işıkları orijinal haline döndür
    if (directionalLight) directionalLight.intensity = 0.9;
    if (ambientLight) ambientLight.intensity = 0.6;
    
    // Kontrolleri etkinleştir
    controls.enabled = true;
    
    console.log('Acil durum çıkışı tamamlandı!');
}

// Başlat
init();