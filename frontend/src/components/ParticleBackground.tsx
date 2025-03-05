import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ParticleBackgroundProps {
  baseColor?: string;
  accentColor?: string;
  density?: number;
  speed?: number;
  starColor?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  baseColor = '#270057', // Deep purple
  accentColor = '#9d00ff', // Bright purple
  starColor = '#ffffff', // Star color
  density = 1000,
  speed = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Handle initial setup and window resize
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!containerRef.current || dimensions.width === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      dimensions.width / dimensions.height, 
      0.1, 
      1000
    );
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(dimensions.width, dimensions.height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);

    // Create main galaxy particles
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyParticleCount = Math.floor(density * 0.7); // 70% for galaxy structure
    
    const galaxyPositions = new Float32Array(galaxyParticleCount * 3);
    const galaxyColors = new Float32Array(galaxyParticleCount * 3);
    const galaxySizes = new Float32Array(galaxyParticleCount);

    const baseColorObj = new THREE.Color(baseColor);
    const accentColorObj = new THREE.Color(accentColor);
    const starColorObj = new THREE.Color(starColor);
    
    // Galaxy parameters
    const arms = 5; // Number of spiral arms
    const armWidth = 0.5; // Width of the spiral arms
    const revolutions = 3; // How many revolutions the arms make
    const randomness = 0.2; // Random displacement of particles
    const randomnessPower = 3; // Power of randomness
    const innerRadius = 0.4; // Empty space in the center
    const galaxyRadius = 15; // Radius of the galaxy
    
    // Create galaxy structure with spiral arms
    for (let i = 0; i < galaxyParticleCount; i++) {
      const i3 = i * 3;
      
      // Position parameters - using spiral pattern for galaxy
      const radius = Math.random() * galaxyRadius * (innerRadius + Math.random());
      const spinAngle = radius * revolutions;
      const branchAngle = ((i % arms) / arms) * Math.PI * 2;
      
      // Calculate spiral position with randomness
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * radius * 0.5; // Flatter in Z direction
      
      // Spiral positioning
      galaxyPositions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      galaxyPositions[i3 + 1] = randomY * 0.5; // Flatten the galaxy a bit
      galaxyPositions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color based on distance from center
      const distanceFromCenter = Math.sqrt(
        galaxyPositions[i3] * galaxyPositions[i3] + 
        galaxyPositions[i3 + 2] * galaxyPositions[i3 + 2]
      );
      
      const mixFactor = distanceFromCenter / galaxyRadius;
      
      // When closer to center, use accent color more; farther out, use base color
      const color = new THREE.Color().lerpColors(
        accentColorObj, 
        baseColorObj, 
        Math.min(mixFactor * 2, 1)
      );
      
      galaxyColors[i3] = color.r;
      galaxyColors[i3 + 1] = color.g;
      galaxyColors[i3 + 2] = color.b;

      // Size based on position - brighter stars in the arms
      const sizeMultiplier = Math.random() * 0.5 + 0.5; // Between 0.5 and 1
      galaxySizes[i] = Math.max(0.5, 
        sizeMultiplier * (1 - Math.pow(mixFactor, 2)) * 3
      );
    }
    
    // Create background stars
    const starsGeometry = new THREE.BufferGeometry();
    const starParticleCount = Math.floor(density * 0.3); // 30% for background stars
    
    const starPositions = new Float32Array(starParticleCount * 3);
    const starColors = new Float32Array(starParticleCount * 3);
    const starSizes = new Float32Array(starParticleCount);
    
    for (let i = 0; i < starParticleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a larger sphere surrounding the galaxy
      const radius = 20 + Math.random() * 80; // Outside the galaxy radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      
      // Create a shimmer effect with varying star colors
      const colorVariation = Math.random() * 0.3;
      starColors[i3] = starColorObj.r - colorVariation * 0.1; // Slightly less red
      starColors[i3 + 1] = starColorObj.g - colorVariation * 0.1; // Slightly less green
      starColors[i3 + 2] = starColorObj.b; // Full blue
      
      // Vary star sizes
      starSizes[i] = Math.random() * 1.5;
    }
    
    // Create a central bulge/core with denser particles
    const coreGeometry = new THREE.BufferGeometry();
    const coreParticleCount = Math.floor(density * 0.1); // 10% of particles for core
    
    const corePositions = new Float32Array(coreParticleCount * 3);
    const coreColors = new Float32Array(coreParticleCount * 3);
    const coreSizes = new Float32Array(coreParticleCount);
    
    for (let i = 0; i < coreParticleCount; i++) {
      const i3 = i * 3;
      
      // Position in a central sphere (bulge)
      const radius = Math.random() * 3; // Core radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      corePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      corePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6; // Flatten slightly
      corePositions[i3 + 2] = radius * Math.cos(phi) * 0.6; // Flatten slightly
      
      // Brighter core colors - intense version of accent color
      const intensifiedColor = new THREE.Color(accentColor).multiplyScalar(1.5);
      coreColors[i3] = intensifiedColor.r;
      coreColors[i3 + 1] = intensifiedColor.g;
      coreColors[i3 + 2] = intensifiedColor.b;
      
      // Larger core particles
      coreSizes[i] = 2 + Math.random() * 3;
    }

    // Set attributes for galaxy particles
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(galaxySizes, 1));
    
    // Set attributes for background stars
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    
    // Set attributes for core particles
    coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));
    coreGeometry.setAttribute('size', new THREE.BufferAttribute(coreSizes, 1));

    // Create particle material with custom shader for better glow effect
    const galaxyMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a circular point
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          if (dist > 0.5) {
            discard;
          }
          
          // Gradient from center to edge for glow effect
          float intensity = 1.0 - dist * 2.0;
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    // Create the galaxy spiral with specific material
    const galaxyParticles = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyParticles);
    
    // Create stars with the same material (they'll have different colors from the attributes)
    const starsMaterial = galaxyMaterial.clone();
    const starsParticles = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starsParticles);
    
    // Create galaxy core with more intense glow
    const coreMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          if (dist > 0.5) {
            discard;
          }
          
          // More intense glow for core particles
          float intensity = pow(1.0 - dist * 1.8, 1.5);
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    const coreParticles = new THREE.Points(coreGeometry, coreMaterial);
    scene.add(coreParticles);

    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(accentColor, 0.5);
    scene.add(ambientLight);
    
    // Add point light at galaxy center for extra glow
    const centerLight = new THREE.PointLight(accentColor, 1, 20);
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    // Animation
    let animationFrame: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate galaxy with different speeds based on distance from center
      galaxyParticles.rotation.y = elapsedTime * speed * 0.05;
      
      // Rotate background stars much slower
      starsParticles.rotation.y = elapsedTime * speed * 0.01;
      starsParticles.rotation.x = elapsedTime * speed * 0.005;
      
      // Slight wobble for the galaxy core
      coreParticles.rotation.y = elapsedTime * speed * 0.1;
      coreParticles.position.y = Math.sin(elapsedTime * 0.2) * 0.1;
      
      // Subtle camera movement for immersion
      camera.position.x = Math.sin(elapsedTime * 0.1) * 2;
      camera.position.y = Math.cos(elapsedTime * 0.1) * 2;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationFrame);
      galaxyGeometry.dispose();
      starsGeometry.dispose();
      coreGeometry.dispose();
      galaxyMaterial.dispose();
      starsMaterial.dispose();
      coreMaterial.dispose();
    };
  }, [dimensions, baseColor, accentColor, starColor, density, speed]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10"
      style={{
        background: `radial-gradient(ellipse at center, ${accentColor}20 0%, #000000 100%)`
      }}
    />
  );
};

export default ParticleBackground;