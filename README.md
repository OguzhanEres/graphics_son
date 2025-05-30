# Interactive 3D Desert Scene

An interactive 3D desert scene built with Three.js featuring Egyptian monuments, character animations, and exploration mechanics.

## 🌟 Features

- **Interactive 3D Environment**: Explore a detailed desert landscape with camera controls
- **Egyptian Monuments**: Pyramids, statues, and sphinx models with realistic textures
- **Character Animation System**: Multiple character models with walking and idle animations
- **Dynamic Lighting**: Sun positioning and chamber lighting controls with auto-rotation
- **Hieroglyph Puzzle System**: Interactive panels with educational content
- **Tomb Exploration**: Chamber lighting system for underground exploration

## 🗂️ Project Structure

```
├── index.html             # Main HTML file with embedded styles
├── script.js              # Main JavaScript application (monolithic)
├── package.json          # Project configuration and dependencies
├── README.md             # Project documentation
├── aa.png                # UI asset
├── bb.png                # UI asset
└── models/               # 3D model assets directory
    ├── desert_terrain.fbx           # Main terrain model
    ├── Female Stop And Start Walking.fbx  # Character animation
    ├── Female Walk.fbx              # Character walking animation
    ├── Standing Idle.fbx            # Character idle animation
    ├── Walking.fbx                  # Character walking animation
    ├── kosma.fbx                    # Character model
    ├── sabit.fbx                    # Character model
    ├── camel-3ds.3DS               # Legacy camel model
    ├── uploads_files_3835558_untitled.fbx  # Additional model
    ├── Free_pyramid/               # Pyramid models and textures
    │   ├── fbxPyra.fbx
    │   └── textures/               # Pyramid texture files
    ├── Statue_egypt1/              # Egyptian statue model
    │   ├── fbxStatue.fbx
    │   └── textures/               # Statue texture files
    ├── camel/                      # Camel model with textures
    │   ├── Camel.fbx
    │   └── camel1.png
    ├── yeni_camel/                 # New camel model
    │   ├── source/
    │   └── textures/
    └── sphe/                       # Additional models
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser with WebGL support
- Local web server (required for loading FBX/3DS models due to CORS)

### Installation

1. Clone or download the project files
2. Install dependencies (optional for development):
   ```bash
   npm install
   ```

3. Start a local server:
   ```bash
   # Using npm (if package.json is available)
   npm start
   
   # Or using Node.js http-server
   npx http-server . -p 8080
   
   # Or using Python
   python -m http.server 8080
   ```

4. Open `http://localhost:8080/index.html` in your browser

## 🎮 Controls

### Camera Controls
- **Left Click + Drag**: Rotate camera around the scene
- **Right Click + Drag**: Pan camera view
- **Scroll Wheel**: Zoom in/out
- **Click on Models**: Select characters for movement control

### Character Movement
- **W**: Move forward
- **A**: Move left  
- **S**: Move backward
- **D**: Move right
- **Movement triggers walking animations automatically**

### UI Controls
- **Sun Controls Panel**: 
  - Auto-rotate toggle for dynamic day/night cycle
  - Speed slider for sun rotation
  - Manual X, Y, Z position sliders
  - Light intensity adjustment
- **Hieroglyph Panels**: Click to reveal ancient Egyptian symbol information
- **Chamber Lights Panel**: 
  - Multiple light source controls
  - Color picker for ambient lighting
  - Position controls for chamber exploration

## 🎯 Game Features

### Hieroglyph Education System
- **Interactive Panels**: Click on hieroglyph symbols to learn
- **Ancient Wisdom**: Educational descriptions of Egyptian symbols
- **Cultural Learning**: Immersive way to explore ancient Egyptian culture

### Character Animation System
- **Multiple Characters**: Various character models with unique animations
- **State Management**: Automatic switching between idle and walking states
- **Speed-Based Animation**: Animation speed matches movement speed
- **Smooth Transitions**: Seamless animation blending

### Lighting System
- **Dynamic Sun**: Realistic sun movement with shadows
- **Chamber Lighting**: Multiple light sources for indoor exploration
- **Intensity Controls**: Adjustable lighting for different moods
- **Color Customization**: RGB color picker for ambient lighting

## 🔧 Technical Details

### Architecture
The current application uses a **monolithic architecture** with all functionality contained in `script.js`:

- **Scene Management**: Three.js scene initialization and rendering loop
- **Model Loading**: FBX and 3DS loader integration for 3D assets
- **Animation System**: Character animation management with mixers and actions
- **Input Handling**: Keyboard and mouse event management
- **UI Controls**: Dynamic panel controls with real-time updates
- **Game Logic**: Hieroglyph puzzles, and tour systems

### Key Technologies
- **Three.js**: 3D graphics and WebGL rendering
- **FBXLoader**: Loading animated character models
- **TDSLoader**: Support for legacy 3DS models
- **OrbitControls**: Camera control system
- **ES6 Modules**: Modern JavaScript module system

### Configuration
Key settings are defined at the top of `script.js`:

```javascript
// Movement speeds
const moveSpeed = 0.15; // For general models
const walkingCharacterSpeed = 0.05; // For walking characters

// Model counts for loading
const totalModels = 7; // Total expected models to load

// Animation system
let characterAnimations = {
    idle: null,        // Standing Idle.fbx
    walk: null         // Female Walk.fbx
};
```

## 🎨 3D Assets

### Model Formats Supported
- **FBX**: Primary format for animated models and terrain
- **3DS**: Legacy format support for older models
- **Embedded Textures**: Automatic texture loading from model files

### Model Categories
- **Terrain**: `desert_terrain.fbx` - Main landscape
- **Characters**: Multiple FBX files with embedded animations
- **Architecture**: Pyramids and statues with texture materials
- **Props**: Camels and decorative elements

### Texture Assets
- High-resolution texture maps in model directories
- Automatic material loading from FBX embedded data
- Support for diffuse, normal, and roughness maps

## 🐛 Troubleshooting

### Common Issues

**Models not loading:**
- Ensure you're running from a local server (not `file://`)
- Check browser console for specific loading errors
- Verify model file paths and existence
- Ensure FBX files are not corrupted

**Performance issues:**
- Check model polygon counts (large FBX files may be heavy)
- Monitor browser memory usage
- Disable unused animations if experiencing lag
- Consider reducing texture quality for older devices

**Animation problems:**
- Verify FBX files contain embedded animations
- Check animation mixer initialization in console
- Ensure character models have proper bone structures

**Browser compatibility:**
- Use modern browsers with WebGL 2.0 support
- Enable hardware acceleration in browser settings
- Clear browser cache if experiencing loading issues
- Check for Three.js version compatibility

### Debug Mode
Enable debug logging by modifying the loading callbacks in `script.js`:

```javascript
// Add detailed logging for troubleshooting
console.log('Loading model:', modelPath);
console.log('Animation available:', mixer.clipAction);
```

## 🔮 Future Development

### Planned Features
- [ ] **Modular Architecture**: Break down monolithic `script.js` into organized modules
- [ ] **Additional Character Models**: More diverse character animations and behaviors
- [ ] **Sound System**: Ambient desert sounds and interactive audio feedback
- [ ] **Advanced Puzzles**: More complex hieroglyph and tomb puzzles
- [ ] **Day/Night Cycle**: Realistic time progression with dynamic lighting
- [ ] **Weather Effects**: Sand storms, wind, and atmospheric effects
- [ ] **Mobile Support**: Touch controls and responsive design
- [ ] **Multiplayer Mode**: Collaborative desert exploration
- [ ] **Quest System**: Structured goals and achievements
- [ ] **Inventory System**: Collectible items and tools

### Technical Improvements
- [ ] **Performance Optimization**: LOD (Level of Detail) for models
- [ ] **Texture Streaming**: Dynamic loading of high-resolution textures
- [ ] **Shadow Mapping**: Improved shadow quality and performance
- [ ] **Post-Processing**: Visual effects and color grading
- [ ] **WebXR Support**: Virtual and Augmented Reality compatibility

### Content Expansion
- [ ] **More Monuments**: Additional Egyptian architectural elements
- [ ] **Historical Accuracy**: Research-based cultural content
- [ ] **Educational Integration**: School curriculum compatibility
- [ ] **Language Support**: Multi-language hieroglyph descriptions

## 📝 Development Notes

### Code Structure
The current monolithic approach in `script.js` contains:
- Scene initialization (lines 1-100)
- Model loading system (lines 100-500)
- Animation management (lines 500-800)
- Input handling (lines 800-1000)
- UI system (lines 1000-1500)
- Game logic (lines 1500-2000)
- Rendering loop (lines 2000+)

### Recommended Refactoring
For future maintainability, consider splitting into:
```
js/
├── core/
│   ├── Engine.js          # Scene, camera, renderer setup
│   └── AssetLoader.js     # Model and texture loading
├── systems/
│   ├── AnimationManager.js # Character animation system
│   ├── LightingSystem.js  # Dynamic lighting management
│   └── InputManager.js    # Keyboard and mouse handling
├── game/
│   ├── PuzzleManager.js   # Hieroglyph and tomb puzzles
│   └── OasisSystem.js     # Discovery mechanics
└── ui/
    └── UIManager.js       # Panel controls and HUD
```

## 📧 License & Credits

This project is licensed under the MIT License - see the `package.json` file for details.

### Model Credits
- Egyptian models may require attribution to original creators
- Texture assets from various sources (check individual model directories)
- Three.js library and examples (MIT License)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Test your changes thoroughly with various browsers
4. Ensure models load correctly and animations work
5. Submit a pull request with detailed description

### Development Guidelines
- Follow ES6+ JavaScript standards
- Test with local server setup
- Verify model loading and animation functionality
- Check browser console for errors
- Test on multiple devices and browsers

## 📞 Support

For technical issues:
1. Check the troubleshooting section above
2. Verify local server setup
3. Check browser console for error messages
4. Ensure all model files are present and accessible

For questions about Egyptian history or cultural content, please consult appropriate educational resources.
