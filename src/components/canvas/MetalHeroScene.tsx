"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  ShieldCheck,
  Zap,
  RotateCcw,
  Move,
  Layers,
  Sparkles,
  Maximize2,
  ZoomIn,
} from "lucide-react";

type MaterialFinish = "ss316" | "inconel625" | "titanium" | "glowing-alloy";
type MetalComponent = "pipe" | "flange" | "fitting";

export default function MetalHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<MaterialFinish>("ss316");
  const [activeElement, setActiveElement] = useState<MetalComponent>("pipe");
  const [fpsDisplay, setFpsDisplay] = useState(60);
  const [isInteracting, setIsInteracting] = useState(false);

  // References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const elementsGroupRef = useRef<THREE.Group | null>(null);
  const pipeMeshRef = useRef<THREE.Group | null>(null);
  const flangeMeshRef = useRef<THREE.Group | null>(null);
  const fittingMeshRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.2, 1.4, 4.4);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Official Three.js OrbitControls (True 360° Cursor & Touch Freedom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.5;
    controls.enablePan = false;
    controls.rotateSpeed = 0.85;
    // Allow full 360° azimuth and almost full 180° polar without clipping
    controls.minPolarAngle = 0.08;
    controls.maxPolarAngle = Math.PI - 0.08;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    controls.addEventListener("start", () => setIsInteracting(true));
    controls.addEventListener("end", () => setIsInteracting(false));

    // 4. Procedural Brushed Metal Normal Map
    function createBrushedMetalNormalMap() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "rgb(128, 128, 255)";
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 1800; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const len = Math.random() * 160 + 40;
        const noise = (Math.random() - 0.5) * 26;
        ctx.fillStyle = `rgb(${128 + noise}, ${128 + noise * 0.4}, 255)`;
        ctx.fillRect(x, y, len, 1.2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
      return texture;
    }

    // 5. Procedural Studio Reflection Cube Map
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
          grad.addColorStop(0.3, "#cbd5e1");
          grad.addColorStop(1, "#0B0F19");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(35, 35, 186, 50);
        } else if (side === "ny") {
          grad.addColorStop(0, "#020408");
          grad.addColorStop(1, "#0B0F19");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);
        } else {
          grad.addColorStop(0, "#1e293b");
          grad.addColorStop(0.5, "#0f172a");
          grad.addColorStop(1, "#030712");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          ctx.fillStyle = "rgba(0, 210, 255, 0.25)";
          ctx.fillRect(15, 0, 40, 256);
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

    // 6. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainKeyLight.position.set(5, 6, 4);
    scene.add(mainKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00d2ff, 2.2);
    cyanRimLight.position.set(-5, 2, -4);
    scene.add(cyanRimLight);

    const safetyRedLight = new THREE.DirectionalLight(0xe63946, 1.8);
    safetyRedLight.position.set(4, -4, 3);
    scene.add(safetyRedLight);

    // 7. LUXURY ANIMATED BACKGROUND (Holographic Lathe Rings & Precision Bokeh)
    const bgGroup = new THREE.Group();
    scene.add(bgGroup);

    // Lathe Coordinate Ring 1 (Cyan)
    const ring1Geo = new THREE.RingGeometry(2.35, 2.37, 96);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    bgGroup.add(ring1);

    // Lathe Coordinate Ring 2 (Safety Red)
    const ring2Geo = new THREE.RingGeometry(2.6, 2.62, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xe63946,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 5;
    bgGroup.add(ring2);

    // Precision Measurement Grid Ring
    const ring3Geo = new THREE.RingGeometry(2.85, 2.865, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.14,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    bgGroup.add(ring3);

    // Floating Luminous Metallurgy Dust Particles
    const particleCount = 160;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 9;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    bgGroup.add(particles);

    // 8. 3D METAL OBJECTS GROUP
    const elementsGroup = new THREE.Group();
    elementsGroupRef.current = elementsGroup;
    scene.add(elementsGroup);

    const baseMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.96,
      roughness: 0.18,
      envMap: envMap,
      normalMap: normalMap || undefined,
    });

    // Object A: Heavy-Wall Seamless Industrial Pipe (ASTM A312)
    const pipeGroup = new THREE.Group();
    pipeMeshRef.current = pipeGroup;

    const pipeOuterGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.7, 64, 1, true);
    const pipeInnerGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.7, 64, 1, true);
    const ringGeo = new THREE.RingGeometry(0.72, 0.85, 64);

    const pipeOuter = new THREE.Mesh(pipeOuterGeo, baseMetalMat);
    const pipeInnerMat = new THREE.MeshStandardMaterial({
      color: 0x666666,
      metalness: 0.92,
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
    // Initial slight diagonal tilt for immediate 3D depth
    pipeGroup.rotation.z = Math.PI / 8;
    pipeGroup.rotation.x = Math.PI / 10;
    elementsGroup.add(pipeGroup);

    // Object B: ASME B16.5 Forged Weld Neck Flange
    const flangeGroup = new THREE.Group();
    flangeMeshRef.current = flangeGroup;

    const flangeShape = new THREE.Shape();
    flangeShape.absarc(0, 0, 1.48, 0, Math.PI * 2, false);
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 0.72, 0, Math.PI * 2, true);
    flangeShape.holes.push(centerHole);

    // 8-Hole Bolt Circle
    const boltRadius = 1.18;
    const boltHoleRadius = 0.088;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const bx = Math.cos(a) * boltRadius;
      const by = Math.sin(a) * boltRadius;
      const boltHole = new THREE.Path();
      boltHole.absarc(bx, by, boltHoleRadius, 0, Math.PI * 2, true);
      flangeShape.holes.push(boltHole);
    }

    const flangeGeo = new THREE.ExtrudeGeometry(flangeShape, {
      depth: 0.25,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      curveSegments: 48,
    });
    const flangeMesh = new THREE.Mesh(flangeGeo, baseMetalMat);
    flangeMesh.position.z = -0.125;

    const neckGeo = new THREE.CylinderGeometry(0.78, 0.98, 0.7, 64, 1, true);
    const neckMesh = new THREE.Mesh(neckGeo, baseMetalMat);
    neckMesh.rotation.x = Math.PI / 2;
    neckMesh.position.z = 0.45;

    flangeGroup.add(flangeMesh, neckMesh);
    flangeGroup.rotation.x = Math.PI / 4;
    flangeGroup.visible = false;
    elementsGroup.add(flangeGroup);

    // Object C: Precision Double-Ferrule Tube Fitting
    const fittingGroup = new THREE.Group();
    fittingMeshRef.current = fittingGroup;

    const hexRadius = 0.72;
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = Math.cos(a) * hexRadius;
      const y = Math.sin(a) * hexRadius;
      if (i === 0) hexShape.moveTo(x, y);
      else hexShape.lineTo(x, y);
    }
    const fittingHole = new THREE.Path();
    fittingHole.absarc(0, 0, 0.36, 0, Math.PI * 2, true);
    hexShape.holes.push(fittingHole);

    const hexGeo = new THREE.ExtrudeGeometry(hexShape, {
      depth: 0.9,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
    });
    const hexMesh = new THREE.Mesh(hexGeo, baseMetalMat);
    hexMesh.position.z = -0.45;

    const stemGeo = new THREE.CylinderGeometry(0.44, 0.44, 1.9, 48);
    const stemMesh = new THREE.Mesh(stemGeo, baseMetalMat);
    stemMesh.rotation.x = Math.PI / 2;

    fittingGroup.add(hexMesh, stemMesh);
    fittingGroup.rotation.x = Math.PI / 4;
    fittingGroup.visible = false;
    elementsGroup.add(fittingGroup);

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 10. Render Loop
    let frameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      // FPS tracking
      frameCount++;
      if (time - lastTime >= 1000) {
        setFpsDisplay(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      // Update OrbitControls smoothly
      controls.update();

      // Slow background rings animation (purely atmospheric)
      ring1.rotation.z += 0.0018;
      ring2.rotation.z -= 0.0024;
      ring3.rotation.z += 0.001;

      // Particle float
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.0012;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Materials when Finish Changes
  useEffect(() => {
    if (!pipeMeshRef.current || !flangeMeshRef.current || !fittingMeshRef.current) return;

    let targetColor = 0xd8d8d8;
    let targetMetalness = 0.96;
    let targetRoughness = 0.18;
    let emissiveColor = 0x000000;
    let emissiveIntensity = 0;

    if (activeFinish === "inconel625") {
      targetColor = 0xc2a67a; // Rich high-nickel bronze/gold sheen
      targetMetalness = 0.94;
      targetRoughness = 0.24;
    } else if (activeFinish === "titanium") {
      targetColor = 0x8ea2b0; // Cool aerospace titanium blue-gray
      targetMetalness = 0.9;
      targetRoughness = 0.3;
    } else if (activeFinish === "glowing-alloy") {
      targetColor = 0xff3b00; // Thermal induction glow
      targetMetalness = 0.82;
      targetRoughness = 0.26;
      emissiveColor = 0xff4000;
      emissiveIntensity = 0.95;
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

  const handleResetCamera = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    cameraRef.current.position.set(2.2, 1.4, 4.4);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[660px] flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-[#090D16] shadow-2xl">
      {/* 1. ANIMATED ATMOSPHERIC BACKGROUND LAYERS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Pulsing luxury radial glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[110px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[110px] animate-pulse" />

        {/* Blueprint coordinate matrix */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Concentric subtle target rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-cyan-500/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-red-500/15 pointer-events-none" />
      </div>

      {/* 2. Full 360° Interactive WebGL Canvas */}
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 touch-none ${
          isInteracting ? "cursor-grabbing" : "cursor-grab"
        }`}
      />

      {/* 3. TOP TELEMETRY HUD BAR */}
      <div className="relative z-10 w-full p-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300 pointer-events-auto shadow-lg">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">WEBGL PBR 2.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">{fpsDisplay} FPS</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">FULL 360° CAD ORBIT</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/85 border border-white/10 backdrop-blur-md text-[11px] font-mono text-slate-300 pointer-events-auto shadow-lg">
          <ZoomIn className="h-3 w-3 text-cyan-400" />
          <span>SCROLL WHEEL TO ZOOM IN/OUT</span>
        </div>
      </div>

      {/* 4. DRAG INSTRUCTION PILL (Floating in mid-air with pointer-events-none) */}
      <div className="relative z-10 mx-auto pointer-events-none px-4">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 text-xs font-mono text-slate-200 backdrop-blur-md shadow-2xl shadow-cyan-500/10">
          <Move className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>Click &amp; Drag in ANY direction for complete 360° CAD view</span>
        </div>
      </div>

      {/* 5. UNIFIED LUXURY COCKPIT TOOLBAR (Clean, non-overlapping responsive layout) */}
      <div className="relative z-10 w-full p-3 sm:p-4 pointer-events-auto">
        <div className="w-full glass-panel bg-slate-950/92 border border-white/15 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col gap-3">
          {/* Row 1: Component Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-cyan-400" />
              Industrial Component:
            </span>

            <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setActiveElement("pipe")}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeElement === "pipe"
                    ? "bg-[#E63946] text-white shadow-md shadow-red-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Seamless Pipe
              </button>
              <button
                type="button"
                onClick={() => setActiveElement("flange")}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeElement === "flange"
                    ? "bg-[#E63946] text-white shadow-md shadow-red-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Weld Flange
              </button>
              <button
                type="button"
                onClick={() => setActiveElement("fitting")}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeElement === "fitting"
                    ? "bg-[#E63946] text-white shadow-md shadow-red-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Tube Fitting
              </button>
            </div>
          </div>

          {/* Row 2: Alloy Metallurgy Finishes + Reset Camera Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" />
                Alloy:
              </span>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveFinish("ss316")}
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
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
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
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
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
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
                  className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    activeFinish === "glowing-alloy"
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold safety-glow"
                      : "bg-slate-900/90 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Forged Glow
                </button>
              </div>
            </div>

            {/* Reset Camera to Default Isometric Angle */}
            <button
              type="button"
              onClick={handleResetCamera}
              className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all self-end sm:self-auto"
              title="Reset 360° Orbit Camera"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span>Reset 3D View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
