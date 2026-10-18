"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ShieldCheck,
  Zap,
  RotateCcw,
  Move,
  Layers,
  Sparkles,
  Compass,
} from "lucide-react";

type MaterialFinish = "ss316" | "inconel625" | "titanium" | "glowing-alloy";
type MetalComponent = "pipe" | "flange" | "fitting";

export default function MetalHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<MaterialFinish>("ss316");
  const [activeElement, setActiveElement] = useState<MetalComponent>("pipe");
  const [fpsDisplay, setFpsDisplay] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [rotationAngles, setRotationAngles] = useState({ x: 18, y: 35 });

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsGroupRef = useRef<THREE.Group | null>(null);
  const backgroundGroupRef = useRef<THREE.Group | null>(null);

  const pipeMeshRef = useRef<THREE.Group | null>(null);
  const flangeMeshRef = useRef<THREE.Group | null>(null);
  const fittingMeshRef = useRef<THREE.Group | null>(null);

  // Rotation physics & cursor drag tracking
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    currentRotX: 0.32,
    currentRotY: 0.62,
    targetRotX: 0.32,
    targetRotY: 0.62,
    velX: 0,
    velY: 0,
  });

  // Lights reference for dynamic highlights
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. Procedural Brushed Metal Normal Map
    function createBrushedMetalNormalMap() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "rgb(128, 128, 255)";
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const len = Math.random() * 150 + 40;
        const noise = (Math.random() - 0.5) * 22;
        ctx.fillStyle = `rgb(${128 + noise}, ${128 + noise * 0.4}, 255)`;
        ctx.fillRect(x, y, len, 1.2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
      return texture;
    }

    // 3. Procedural Studio Cube Reflection Map
    function createProceduralStudioEnvironment() {
      const sides = ["px", "nx", "py", "ny", "pz", "nz"];
      const canvasList: HTMLCanvasElement[] = [];

      sides.forEach((side) => {
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        const grad = ctx.createLinearGradient(0, 0, 256, 256);
        if (side === "py") {
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.25, "#a8c0d8");
          grad.addColorStop(1, "#0B0F19");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          // Top high-bay lamp reflection
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(40, 40, 176, 45);
        } else if (side === "ny") {
          grad.addColorStop(0, "#010307");
          grad.addColorStop(1, "#080c14");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);
        } else {
          grad.addColorStop(0, "#1e293b");
          grad.addColorStop(0.5, "#0f172a");
          grad.addColorStop(1, "#030712");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          // Electric cyan rim highlights
          ctx.fillStyle = "rgba(0, 210, 255, 0.2)";
          ctx.fillRect(15, 0, 35, 256);
        }
        canvasList.push(c);
      });

      const cubeTex = new THREE.CubeTexture(canvasList);
      cubeTex.needsUpdate = true;
      return cubeTex;
    }

    const normalMap = createBrushedMetalNormalMap();
    const envMap = createProceduralStudioEnvironment();
    scene.environment = envMap;

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    mainKeyLight.position.set(4, 5, 4);
    keyLightRef.current = mainKeyLight;
    scene.add(mainKeyLight);

    const coolRimLight = new THREE.DirectionalLight(0x00d2ff, 2.0);
    coolRimLight.position.set(-5, 2, -3);
    rimLightRef.current = coolRimLight;
    scene.add(coolRimLight);

    const redAccentLight = new THREE.DirectionalLight(0xe63946, 1.4);
    redAccentLight.position.set(3, -4, 2);
    scene.add(redAccentLight);

    // 5. ANIMATED LUXURY BACKGROUND (Holographic Coordinate Rings & Floating Bokeh)
    const backgroundGroup = new THREE.Group();
    backgroundGroupRef.current = backgroundGroup;
    scene.add(backgroundGroup);

    // Coordinate Ring 1 (Horizontal Lathe Ring)
    const ring1Geo = new THREE.RingGeometry(2.2, 2.22, 96);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    backgroundGroup.add(ring1);

    // Coordinate Ring 2 (Tilted Orbit Ring)
    const ring2Geo = new THREE.RingGeometry(2.45, 2.47, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xe63946,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    backgroundGroup.add(ring2);

    // Outer Blueprint Compass Ring with Dashes
    const ring3Geo = new THREE.RingGeometry(2.7, 2.715, 64);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.12,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    backgroundGroup.add(ring3);

    // Floating Luminous Metallic Dust / Bokeh Particles
    const particleCount = 140;
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 9;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 7;

      particleVel[i * 3] = (Math.random() - 0.5) * 0.003;
      particleVel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      particleVel[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    backgroundGroup.add(particles);

    // 6. BUILD PROCEDURAL 3D METAL COMPONENTS
    const elementsGroup = new THREE.Group();
    elementsGroupRef.current = elementsGroup;
    scene.add(elementsGroup);

    // Component A: Seamless Pipe (ASTM A312)
    const pipeGroup = new THREE.Group();
    pipeMeshRef.current = pipeGroup;

    const baseMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd6d6d6,
      metalness: 0.96,
      roughness: 0.2,
      envMap: envMap,
      normalMap: normalMap || undefined,
    });

    const pipeOuterGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.7, 64, 1, true);
    const pipeInnerGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.7, 64, 1, true);
    const ringGeo = new THREE.RingGeometry(0.72, 0.85, 64);

    const pipeOuter = new THREE.Mesh(pipeOuterGeo, baseMetalMat);
    const pipeInnerMat = new THREE.MeshStandardMaterial({
      color: 0x777777,
      metalness: 0.9,
      roughness: 0.35,
      side: THREE.BackSide,
      envMap: envMap,
    });
    const pipeInner = new THREE.Mesh(pipeInnerGeo, pipeInnerMat);

    const ringTop = new THREE.Mesh(ringGeo, baseMetalMat);
    ringTop.rotation.x = -Math.PI / 2;
    ringTop.position.y = 1.35;

    const ringBottom = new THREE.Mesh(ringGeo, baseMetalMat);
    ringBottom.rotation.x = Math.PI / 2;
    ringBottom.position.y = -1.35;

    pipeGroup.add(pipeOuter, pipeInner, ringTop, ringBottom);
    elementsGroup.add(pipeGroup);

    // Component B: ASME B16.5 Forged Weld Neck Flange
    const flangeGroup = new THREE.Group();
    flangeMeshRef.current = flangeGroup;

    const flangeShape = new THREE.Shape();
    flangeShape.absarc(0, 0, 1.45, 0, Math.PI * 2, false);
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 0.7, 0, Math.PI * 2, true);
    flangeShape.holes.push(centerHole);

    const boltRadius = 1.15;
    const boltHoleRadius = 0.085;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const bx = Math.cos(a) * boltRadius;
      const by = Math.sin(a) * boltRadius;
      const boltHole = new THREE.Path();
      boltHole.absarc(bx, by, boltHoleRadius, 0, Math.PI * 2, true);
      flangeShape.holes.push(boltHole);
    }

    const flangeGeo = new THREE.ExtrudeGeometry(flangeShape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      curveSegments: 48,
    });
    const flangeMesh = new THREE.Mesh(flangeGeo, baseMetalMat);
    flangeMesh.position.z = -0.12;

    const neckGeo = new THREE.CylinderGeometry(0.76, 0.96, 0.65, 64, 1, true);
    const neckMesh = new THREE.Mesh(neckGeo, baseMetalMat);
    neckMesh.rotation.x = Math.PI / 2;
    neckMesh.position.z = 0.42;

    flangeGroup.add(flangeMesh, neckMesh);
    flangeGroup.visible = false;
    elementsGroup.add(flangeGroup);

    // Component C: Double-Ferrule Compression Tube Fitting
    const fittingGroup = new THREE.Group();
    fittingMeshRef.current = fittingGroup;

    const hexRadius = 0.68;
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = Math.cos(a) * hexRadius;
      const y = Math.sin(a) * hexRadius;
      if (i === 0) hexShape.moveTo(x, y);
      else hexShape.lineTo(x, y);
    }
    const fittingHole = new THREE.Path();
    fittingHole.absarc(0, 0, 0.35, 0, Math.PI * 2, true);
    hexShape.holes.push(fittingHole);

    const hexGeo = new THREE.ExtrudeGeometry(hexShape, {
      depth: 0.85,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
    });
    const hexMesh = new THREE.Mesh(hexGeo, baseMetalMat);
    hexMesh.position.z = -0.42;

    const stemGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.85, 48);
    const stemMesh = new THREE.Mesh(stemGeo, baseMetalMat);
    stemMesh.rotation.x = Math.PI / 2;

    fittingGroup.add(hexMesh, stemMesh);
    fittingGroup.visible = false;
    elementsGroup.add(fittingGroup);

    // Initialize default angle
    elementsGroup.rotation.x = dragRef.current.currentRotX;
    elementsGroup.rotation.y = dragRef.current.currentRotY;

    // 7. DIRECT CURSOR ROTATION (POINTER / TOUCH DRAGGING - NO FORCED AUTO SPIN)
    const onPointerDown = (e: PointerEvent) => {
      dragRef.current.isDown = true;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
      setIsDragging(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isDown) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;

      // Sensitivity factor for natural feel
      const sensitivity = 0.007;
      dragRef.current.targetRotY += deltaX * sensitivity;
      dragRef.current.targetRotX += deltaY * sensitivity;

      // Constrain vertical pitch to avoid upside-down flip
      dragRef.current.targetRotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, dragRef.current.targetRotX));

      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const onPointerUp = () => {
      dragRef.current.isDown = false;
      setIsDragging(false);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 8. HIGH-FPS RENDER LOOP WITH DIRECT INERTIAL DAMPING
    let frameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let angleUpdateTimer = 0;

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      // FPS Counter
      frameCount++;
      if (time - lastTime >= 1000) {
        setFpsDisplay(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      // Smooth inertia lerp for DIRECT cursor rotation
      dragRef.current.currentRotX += (dragRef.current.targetRotX - dragRef.current.currentRotX) * 0.12;
      dragRef.current.currentRotY += (dragRef.current.targetRotY - dragRef.current.currentRotY) * 0.12;

      if (elementsGroupRef.current) {
        elementsGroupRef.current.rotation.x = dragRef.current.currentRotX;
        elementsGroupRef.current.rotation.y = dragRef.current.currentRotY;
      }

      // Update degrees display every 10 frames
      angleUpdateTimer++;
      if (angleUpdateTimer % 10 === 0) {
        const degX = Math.round(((dragRef.current.currentRotX * 180) / Math.PI) % 360);
        const degY = Math.round(((dragRef.current.currentRotY * 180) / Math.PI) % 360);
        setRotationAngles({ x: degX, y: degY });
      }

      // Animated Background Elements
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.003;
      ring3.rotation.z += 0.001;

      // Animate floating particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.0015;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle dynamic light tracking
      if (keyLightRef.current) {
        keyLightRef.current.position.x = 4 + Math.sin(time * 0.0008) * 1.5;
      }

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Materials when Finish Changes
  useEffect(() => {
    if (!pipeMeshRef.current || !flangeMeshRef.current || !fittingMeshRef.current) return;

    let targetColor = 0xd6d6d6;
    let targetMetalness = 0.96;
    let targetRoughness = 0.2;
    let emissiveColor = 0x000000;
    let emissiveIntensity = 0;

    if (activeFinish === "inconel625") {
      targetColor = 0xbfa377; // Warm high-nickel bronze/gold sheen
      targetMetalness = 0.93;
      targetRoughness = 0.26;
    } else if (activeFinish === "titanium") {
      targetColor = 0x90a4ae; // Cool blue-gray satin titanium
      targetMetalness = 0.9;
      targetRoughness = 0.32;
    } else if (activeFinish === "glowing-alloy") {
      targetColor = 0xff3e00; // Glowing induction-heated thermal alloy
      targetMetalness = 0.82;
      targetRoughness = 0.28;
      emissiveColor = 0xff4500;
      emissiveIntensity = 0.9;
    }

    const updateMeshGroup = (group: THREE.Group) => {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.color.setHex(targetColor);
          mat.metalness = targetMetalness;
          mat.roughness = targetRoughness;
          if (mat.emissive) {
            mat.emissive.setHex(emissiveColor);
            mat.emissiveIntensity = emissiveIntensity;
          }
          mat.needsUpdate = true;
        }
      });
    };

    updateMeshGroup(pipeMeshRef.current);
    updateMeshGroup(flangeMeshRef.current);
    updateMeshGroup(fittingMeshRef.current);
  }, [activeFinish]);

  // Toggle active 3D component
  useEffect(() => {
    if (pipeMeshRef.current) pipeMeshRef.current.visible = activeElement === "pipe";
    if (flangeMeshRef.current) flangeMeshRef.current.visible = activeElement === "flange";
    if (fittingMeshRef.current) fittingMeshRef.current.visible = activeElement === "fitting";
  }, [activeElement]);

  const handleResetAngle = () => {
    dragRef.current.targetRotX = 0.32;
    dragRef.current.targetRotY = 0.62;
  };

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[660px] flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[#090D16] shadow-2xl">
      {/* 1. ANIMATED ATMOSPHERIC BACKGROUND LAYERS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Breathing glowing radial gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] animate-pulse" />

        {/* Blueprint CAD coordinates crosshair overlay */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Central holographic circular target ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-red-500/10 pointer-events-none" />
      </div>

      {/* 2. 3D WebGL Canvas Layer with Responsive Grab Cursor */}
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      />

      {/* 3. TOP TELEMETRY HUD BAR (Never overlaps with bottom controls) */}
      <div className="relative z-10 w-full p-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300 pointer-events-auto shadow-lg">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">WEBGL PBR 2.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">{fpsDisplay} FPS</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-medium">60 FPS LOCKED</span>
        </div>

        {/* Real-time Cursor Drag Coordinates Telemetry */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300 pointer-events-auto shadow-lg">
          <Move className="h-3 w-3 text-cyan-400" />
          <span>CURSOR ORBIT:</span>
          <span className="text-cyan-300 font-bold">X: {rotationAngles.x}°</span>
          <span className="text-red-400 font-bold">Y: {rotationAngles.y}°</span>
        </div>
      </div>

      {/* 4. DRAG-TO-INSPECT HINT PILL (Floating Center-Top) */}
      <div className="relative z-10 mx-auto pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/75 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md shadow-xl">
          <Move className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
          <span>Drag cursor directly on 3D metal to inspect 360°</span>
        </div>
      </div>

      {/* 5. UNIFIED LUXURY COCKPIT TOOLBAR (Clean, non-overlapping responsive flow) */}
      <div className="relative z-10 w-full p-4 pointer-events-auto">
        <div className="w-full glass-panel bg-slate-950/90 border border-white/15 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-3">
          {/* Row 1: Component Selector (Segmented Tab Bar) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-cyan-400" />
              Industrial Component
            </span>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setActiveElement("pipe")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeElement === "pipe"
                    ? "bg-[#E63946] text-white shadow-md shadow-red-500/30 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Seamless Pipe
              </button>
              <button
                type="button"
                onClick={() => setActiveElement("flange")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeElement === "flange"
                    ? "bg-[#E63946] text-white shadow-md shadow-red-500/30 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Weld Flange
              </button>
              <button
                type="button"
                onClick={() => setActiveElement("fitting")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeElement === "fitting"
                    ? "bg-[#E63946] text-white shadow-md shadow-red-500/30 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tube Fitting
              </button>
            </div>
          </div>

          {/* Row 2: Alloy Metallurgy Finishes + Reset Angle CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" />
                Alloy:
              </span>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveFinish("ss316")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeFinish === "ss316"
                      ? "bg-slate-200 text-slate-950 font-bold shadow-sm"
                      : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  SS 316L
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFinish("inconel625")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeFinish === "inconel625"
                      ? "bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-bold shadow-sm"
                      : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Inconel 625
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFinish("titanium")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeFinish === "titanium"
                      ? "bg-gradient-to-r from-cyan-300 to-sky-400 text-slate-950 font-bold shadow-sm"
                      : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Titanium Gr.5
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFinish("glowing-alloy")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeFinish === "glowing-alloy"
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold safety-glow"
                      : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Forged Glow
                </button>
              </div>
            </div>

            {/* Reset Camera / Angle Button */}
            <button
              type="button"
              onClick={handleResetAngle}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all self-end sm:self-auto"
              title="Reset Model Angles to Isometric"
            >
              <RotateCcw className="h-3 w-3 text-cyan-400" />
              <span>Reset 3D Angle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
