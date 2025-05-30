# Interactive 3D Desert Scene

An interactive 3D desert scene built with Three.js featuring Egyptian monuments, character animations, and exploration mechanics.

## 🌟 Features

- **Interactive 3D Environment**: Explore a detailed desert landscape
- **Egyptian Monuments**: Pyramids, statues, and sphinx models
- **Character Animation System**: Walk, idle, and movement animations
- **Dynamic Lighting**: Sun positioning and chamber lighting controls
- **Oasis Discovery Mode**: Find hidden plants and water sources
- **Hieroglyph Interactions**: Learn about ancient Egyptian symbols
- **Modular Architecture**: Clean, organized, and maintainable code structure

## 🗂️ Project Structure

```
├── index_new.html          # Main HTML file (updated version)
├── package.json           # Project configuration
├── css/                   # Stylesheets (modular)
│   ├── base.css          # Base styles and resets
│   ├── components/       # Component-specific styles
│   │   ├── controls.css  # Control panel styles
│   │   ├── hieroglyphs.css # Hieroglyph system styles
│   │   └── oasis.css     # Oasis discovery styles
│   └── layouts/          # Layout-specific styles
│       └── panels.css    # Panel layouts
├── js/                   # JavaScript modules
│   ├── main.js          # Main application entry point
│   ├── config.js        # Global configuration
│   ├── controls/        # Input and character controls
│   │   ├── InputManager.js
│   │   └── CharacterController.js
│   ├── loaders/         # Model and asset loaders
│   │   └── ModelLoader.js
│   ├── modules/         # Core game modules
│   │   └── AnimationManager.js
│   ├── scenes/          # Scene and lighting management
│   │   ├── SceneManager.js
│   │   └── LightingManager.js
│   ├── ui/              # User interface management
│   │   └── UIManager.js
│   └── utils/           # Utility functions
│       └── Utils.js
└── models/              # 3D model assets
    ├── desert_terrain.fbx
    ├── Free_pyramid/
    ├── Statue_egypt1/
    ├── camel/
    └── ...
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser with WebGL support
- Local web server (for loading models)

### Installation

1. Clone or download the project
2. Install dependencies (optional):
   ```bash
   npm install
   ```

3. Start a local server:
   ```bash
   # Using npm (if installed)
   npm start
   
   # Or using Python
   python -m http.server 8080
   
   # Or using Node.js http-server
   npx http-server . -p 8080
   ```

4. Open `http://localhost:8080/index_new.html` in your browser

## 🎮 Controls

### Mouse Controls
- **Left Click + Drag**: Rotate camera around scene
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Click on Objects**: Select models for character control

### Keyboard Controls
- **W**: Move forward
- **A**: Move left  
- **S**: Move backward
- **D**: Move right

### UI Controls
- **Sun Controls**: Adjust sun position and lighting
- **Oasis Discovery**: Toggle exploration mode
- **Hieroglyph Panels**: Click to learn about ancient symbols
- **Chamber Lights**: Advanced lighting controls for indoor scenes

## 🎯 Features Overview

### Dynamic Lighting System
- Automatic sun movement with configurable speed
- Manual sun positioning controls
- Intensity adjustments
- Chamber lighting for indoor exploration

### Character Animation
- Idle and walking animations
- Smooth transitions between states
- Multiple character models support
- Speed-based animation selection

### Oasis Discovery Mode
- Find hidden plants (5 total)
- Discover water sources (3 total)
- Progress tracking
- Visual feedback with ripple effects

### Hieroglyph Education System
- Interactive symbol panels
- Educational descriptions
- Mini-puzzles for engagement
- Ancient Egyptian cultural content

## 🔧 Configuration

Main settings can be modified in `js/config.js`:

```javascript
export const CONFIG = {
    SCENE: {
        BACKGROUND_COLOR: 0x87CEEB,
        FOG_NEAR: 20,
        FOG_FAR: 100
    },
    LIGHTING: {
        SUN: {
            INITIAL_POSITION: { x: 10, y: 15, z: 10 },
            INTENSITY: 1.2
        }
    },
    ANIMATION: {
        MOVE_SPEED: 0.15,
        WALKING_SPEED: 0.05
    }
    // ... more settings
};
```

## 🏗️ Architecture

The project follows a modular architecture pattern:

- **SceneManager**: Handles Three.js scene initialization
- **LightingManager**: Manages all lighting systems
- **ModelLoader**: Loads and manages 3D models
- **AnimationManager**: Controls character animations
- **InputManager**: Handles user input
- **CharacterController**: Manages character movement
- **UIManager**: Controls user interface elements
- **Utils**: Common utility functions

## 🎨 Models and Assets

### Supported Formats
- FBX files for 3D models
- 3DS files for legacy models
- OBJ files for simple geometry
- PNG/JPG for textures

### Model Requirements
- Models should be optimized for web use
- Textures should be reasonably sized (1024x1024 max recommended)
- Animations should be embedded in FBX files

## 🐛 Troubleshooting

### Common Issues

**Models not loading:**
- Ensure you're running from a local server (not file://)
- Check model file paths in `CONFIG.MODELS.PATHS`
- Verify model files exist in the models directory

**Performance issues:**
- Reduce model complexity
- Lower texture resolutions
- Disable shadows if needed

**Browser compatibility:**
- Use modern browsers (Chrome, Firefox, Safari, Edge)
- Ensure WebGL is enabled
- Clear browser cache if issues persist

## 🔮 Future Enhancements

- [ ] More character models and animations
- [ ] Sound effects and ambient audio
- [ ] Additional puzzle mechanics
- [ ] Multiplayer support
- [ ] Mobile touch controls
- [ ] Virtual reality support
- [ ] Procedural desert generation

## 📝 License

This project is licensed under the MIT License - see the package.json file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the modular architecture
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For questions or issues, please refer to the troubleshooting section or create an issue in the project repository.
