"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShieldCheck, Eye, RefreshCw, Zap, Compass } from "lucide-react";

type MaterialFinish = "ss316" | "inconel625" | "titanium" | "glowing-alloy";

export default function MetalHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFinish, setActiveFinish] = useState<MaterialFinish>("ss316");
  const [activeElement, setActiveElement] = useState<"pipe" | "flange" | "fitting">("pipe");
  const [isInspecting, setIsInspecting] = useState(false);
  const [fpsDisplay, setFpsDisplay] = useState(60);

  // References for scene state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const elementsGroupRef = useRef<THREE.Group | null>(null);
  const pipeMeshRef = useRef<THREE.Group | null>(null);
  const flangeMeshRef = useRef<THREE.Group | null>(null);
  const fittingMeshRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 2. Procedural Brushed Metal Normal Map Generator
    function createBrushedMetalNormalMap() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "rgb(128, 128, 255)"; // Neutral normal
      ctx.fillRect(0, 0, 512, 512);

      // Fine brushed horizontal striations
      for (let i = 0; i < 1200; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const len = Math.random() * 120 + 30;
        const noise = (Math.random() - 0.5) * 18;
        ctx.fillStyle = `rgb(${128 + noise}, ${128 + noise * 0.5}, 255)`;
        ctx.fillRect(x, y, len, 1.2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    }

    // 3. Procedural Studio Cube Environment Map
    function createProceduralStudioEnvironment() {
      const sides = ["px", "nx", "py", "ny", "pz", "nz"];
      const canvasList: HTMLCanvasElement[] = [];

      sides.forEach((side) => {
        const c = document.createElement("canvas");
        c.width = 256;
        c.height = 256;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        // Dark industrial ambiance with overhead high-bay industrial flood lights
        const grad = ctx.createLinearGradient(0, 0, 256, 256);
        if (side === "py") {
          // Top ceiling light
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.3, "#94A3B8");
          grad.addColorStop(1, "#0B0F19");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          // Overhead luminaire strip
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(40, 40, 176, 50);
        } else if (side === "ny") {
          grad.addColorStop(0, "#020408");
          grad.addColorStop(1, "#0B0F19");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);
        } else {
          // Sides with metallic rim lighting
          grad.addColorStop(0, "#1E293B");
          grad.addColorStop(0.5, "#0F172A");
          grad.addColorStop(1, "#050811");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          ctx.fillStyle = "rgba(0, 210, 255, 0.15)";
          ctx.fillRect(10, 0, 40, 256);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainKeyLight.position.set(4, 5, 4);
    scene.add(mainKeyLight);

    const coolRimLight = new THREE.DirectionalLight(0x00d2ff, 1.8);
    coolRimLight.position.set(-5, 3, -3);
    scene.add(coolRimLight);

    const safetyWarmLight = new THREE.DirectionalLight(0xe63946, 1.2);
    safetyWarmLight.position.set(2, -3, 3);
    scene.add(safetyWarmLight);

    // 5. Build Procedural Industrial Metal Elements
    const elementsGroup = new THREE.Group();
    elementsGroupRef.current = elementsGroup;
    scene.add(elementsGroup);

    // Element A: Seamless Heavy-Wall Industrial Pipe Assembly
    const pipeGroup = new THREE.Group();
    pipeMeshRef.current = pipeGroup;

    // Outer Cylinder
    const pipeOuterGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.8, 64, 1, true);
    // Inner Hollow Cylinder
    const pipeInnerGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.8, 64, 1, true);
    // Bevel End Caps (Rings)
    const ringGeo = new THREE.RingGeometry(0.72, 0.85, 64);

    const baseMetalMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.22,
      envMap: envMap,
      normalMap: normalMap || undefined,
    });

    const pipeOuter = new THREE.Mesh(pipeOuterGeo, baseMetalMat);
    const pipeInnerMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.9,
      roughness: 0.4,
      side: THREE.BackSide,
      envMap: envMap,
    });
    const pipeInner = new THREE.Mesh(pipeInnerGeo, pipeInnerMat);

    const ringTop = new THREE.Mesh(ringGeo, baseMetalMat);
    ringTop.rotation.x = -Math.PI / 2;
    ringTop.position.y = 1.4;

    const ringBottom = new THREE.Mesh(ringGeo, baseMetalMat);
    ringBottom.rotation.x = Math.PI / 2;
    ringBottom.position.y = -1.4;

    pipeGroup.add(pipeOuter, pipeInner, ringTop, ringBottom);
    pipeGroup.rotation.z = Math.PI / 6;
    pipeGroup.rotation.x = Math.PI / 8;
    elementsGroup.add(pipeGroup);

    // Element B: ASME B16.5 Forged Weld Neck Flange
    const flangeGroup = new THREE.Group();
    flangeMeshRef.current = flangeGroup;

    // Flange Disc with Center Bore
    const flangeShape = new THREE.Shape();
    flangeShape.absarc(0, 0, 1.45, 0, Math.PI * 2, false);
    const centerHole = new THREE.Path();
    centerHole.absarc(0, 0, 0.7, 0, Math.PI * 2, true);
    flangeShape.holes.push(centerHole);

    // Bolt holes (8-hole pattern standard for 4" Class 300)
    const boltRadius = 1.15;
    const boltHoleRadius = 0.085;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bx = Math.cos(angle) * boltRadius;
      const by = Math.sin(angle) * boltRadius;
      const boltHole = new THREE.Path();
      boltHole.absarc(bx, by, boltHoleRadius, 0, Math.PI * 2, true);
      flangeShape.holes.push(boltHole);
    }

    const flangeGeo = new THREE.ExtrudeGeometry(flangeShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      curveSegments: 48,
    });
    const flangeMesh = new THREE.Mesh(flangeGeo, baseMetalMat);
    flangeMesh.position.z = -0.11;

    // Weld Neck Taper Cone
    const neckGeo = new THREE.CylinderGeometry(0.78, 0.95, 0.6, 64, 1, true);
    const neckMesh = new THREE.Mesh(neckGeo, baseMetalMat);
    neckMesh.rotation.x = Math.PI / 2;
    neckMesh.position.z = 0.4;

    flangeGroup.add(flangeMesh, neckMesh);
    flangeGroup.position.set(0, 0, 0);
    flangeGroup.visible = false;
    elementsGroup.add(flangeGroup);

    // Element C: Double-Ferrule Compression Fitting Body & Nuts
    const fittingGroup = new THREE.Group();
    fittingMeshRef.current = fittingGroup;

    // Hexagonal Body
    const hexRadius = 0.65;
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
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
    });
    const hexMesh = new THREE.Mesh(hexGeo, baseMetalMat);
    hexMesh.position.z = -0.4;

    // Threaded Stem & Compression Nuts
    const stemGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.8, 48);
    const stemMesh = new THREE.Mesh(stemGeo, baseMetalMat);
    stemMesh.rotation.x = Math.PI / 2;

    fittingGroup.add(hexMesh, stemMesh);
    fittingGroup.visible = false;
    elementsGroup.add(fittingGroup);

    // Floating Engineering Coordinate Particles / Metallurgy Atoms
    const particlesCount = 80;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Mouse Interaction & Responsive Camera Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.6;
    };

    window.addEventListener("mousemove", handleMouseMove);

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

    // 7. High-FPS Render Loop with Precision Lerp
    let frameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      // FPS Calculation
      frameCount++;
      if (time - lastTime >= 1000) {
        setFpsDisplay(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      // Smooth mouse camera parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x * 1.5;
      camera.position.y = 1.2 + mouseRef.current.y * 1.0;
      camera.lookAt(0, 0, 0);

      // Continuous slow industrial rotation
      if (elementsGroupRef.current) {
        elementsGroupRef.current.rotation.y += 0.005;
        if (isInspecting) {
          elementsGroupRef.current.rotation.x += 0.003;
        }
      }

      // Slowly rotate particles
      particles.rotation.y -= 0.001;

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isInspecting]);

  // Update Materials when Finish Changes
  useEffect(() => {
    if (!pipeMeshRef.current || !flangeMeshRef.current || !fittingMeshRef.current) return;

    let targetColor = 0xcccccc;
    let targetMetalness = 0.95;
    let targetRoughness = 0.22;
    let emissiveColor = 0x000000;
    let emissiveIntensity = 0;

    if (activeFinish === "inconel625") {
      targetColor = 0xb89c72; // Warm high-nickel alloy bronze/gold sheen
      targetMetalness = 0.92;
      targetRoughness = 0.28;
    } else if (activeFinish === "titanium") {
      targetColor = 0x8a9ba8; // Cool blue-gray satin titanium
      targetMetalness = 0.88;
      targetRoughness = 0.35;
    } else if (activeFinish === "glowing-alloy") {
      targetColor = 0xff3b14; // Red-orange heat treated induction forging
      targetMetalness = 0.8;
      targetRoughness = 0.3;
      emissiveColor = 0xff4500;
      emissiveIntensity = 0.85;
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

  // Toggle visible 3D component
  useEffect(() => {
    if (pipeMeshRef.current) pipeMeshRef.current.visible = activeElement === "pipe";
    if (flangeMeshRef.current) flangeMeshRef.current.visible = activeElement === "flange";
    if (fittingMeshRef.current) fittingMeshRef.current.visible = activeElement === "fitting";
  }, [activeElement]);

  return (
    <div className="relative w-full h-full min-h-[560px] lg:min-h-[640px] flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-radial from-slate-900/60 via-[#0B0F19] to-[#0B0F19]">
      {/* 3D WebGL Canvas Injection */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry & Precision Metallurgy Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-300 pointer-events-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">WEBGL 2.0 PBR</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400">{fpsDisplay} FPS</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">ANISOTROPIC SHADING</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md text-xs font-mono text-slate-300 pointer-events-auto">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>EN 10204 3.1 / 3.2 VERIFIED</span>
        </div>
      </div>

      {/* Element Selector Controls (Left Side) */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2 pointer-events-auto">
        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 mb-1 flex items-center gap-1.5">
          <Compass className="h-3 w-3 text-cyan-400" />
          3D Component Focus
        </span>
        <div className="flex flex-col gap-1.5 p-1 rounded-xl bg-slate-950/85 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveElement("pipe")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
              activeElement === "pipe"
                ? "bg-slate-800 text-white border-l-2 border-[#E63946] shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Seamless Pipe (ASTM A312)
          </button>
          <button
            onClick={() => setActiveElement("flange")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
              activeElement === "flange"
                ? "bg-slate-800 text-white border-l-2 border-[#E63946] shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Weld Neck Flange (ASME B16.5)
          </button>
          <button
            onClick={() => setActiveElement("fitting")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left transition-all ${
              activeElement === "fitting"
                ? "bg-slate-800 text-white border-l-2 border-[#E63946] shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            Double-Ferrule Fitting
          </button>
        </div>
      </div>

      {/* Material Alloy Switcher & Inspection Toggle (Right Side) */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-2 pointer-events-auto">
        <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 mb-1 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-[#E63946]" />
          Alloy Metallurgy
        </span>
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-950/85 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveFinish("ss316")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeFinish === "ss316"
                ? "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-950 font-bold"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            SS 316L
          </button>
          <button
            onClick={() => setActiveFinish("inconel625")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeFinish === "inconel625"
                ? "bg-gradient-to-r from-amber-200 to-amber-500 text-slate-950 font-bold"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Inconel 625
          </button>
          <button
            onClick={() => setActiveFinish("titanium")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeFinish === "titanium"
                ? "bg-gradient-to-r from-cyan-200 to-blue-400 text-slate-950 font-bold"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Titanium Gr.5
          </button>
          <button
            onClick={() => setActiveFinish("glowing-alloy")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              activeFinish === "glowing-alloy"
                ? "bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold safety-glow"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Forged Induction Glow
          </button>
        </div>

        {/* Dynamic Interactive Orbit Inspection */}
        <button
          onClick={() => setIsInspecting((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-md transition-all ${
            isInspecting
              ? "bg-[#E63946] border-[#E63946] text-white shadow-lg shadow-red-500/20"
              : "bg-slate-950/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-900"
          }`}
        >
          {isInspecting ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Inspection Rotation: Active</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
              <span>Free Orbit Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
