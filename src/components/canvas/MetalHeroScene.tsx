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
  ZoomIn,
  Boxes,
  Split,
  Eye,
  Play,
} from "lucide-react";
import { useAmbience } from "@/hooks/useAmbience";

export type Product3DModel =
  | "pipes"
  | "tubes"
  | "coils"
  | "sheets"
  | "plates"
  | "bars"
  | "flanges"
  | "fittings";

export type MaterialFinish =
  | "ss316-mirror"
  | "inconel625"
  | "titanium-satin"
  | "forged-glow"
  | "carbon-matte";

interface MetalHeroSceneProps {
  initialModel?: Product3DModel;
  compactControls?: boolean;
}

export default function MetalHeroScene({
  initialModel = "pipes",
  compactControls = false,
}: MetalHeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<Product3DModel>(initialModel);
  const [activeFinish, setActiveFinish] = useState<MaterialFinish>("ss316-mirror");
  const [fpsDisplay, setFpsDisplay] = useState(60);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const { setIsCinemaOpen } = useAmbience();

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const elementsGroupRef = useRef<THREE.Group | null>(null);
  const modelMeshesRef = useRef<Record<string, THREE.Group | THREE.Mesh>>({});

  // Explode animation references (target and current positions)
  const animPartsRef = useRef<
    Array<{
      mesh: THREE.Object3D;
      assembledPos: THREE.Vector3;
      explodedPos: THREE.Vector3;
    }>
  >([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(2.4, 1.5, 4.6);
    cameraRef.current = camera;

    // 2. High-Performance PBR WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 3. Official Three.js OrbitControls (Full 360° CAD Freedom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enableZoom = true;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.5;
    controls.enablePan = false;
    controls.rotateSpeed = 0.85;
    controls.minPolarAngle = 0.05;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    controls.addEventListener("start", () => setIsInteracting(true));
    controls.addEventListener("end", () => setIsInteracting(false));

    // 4. Ultra-Realistic Anisotropic Brushed Metal Normal Map (1024x1024 with Lathe Striations)
    function createBrushedMetalNormalMap() {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "rgb(128, 128, 255)"; // Neutral PBR normal
      ctx.fillRect(0, 0, 1024, 1024);

      // Lathe circular and axial striations
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const len = Math.random() * 220 + 60;
        const noise = (Math.random() - 0.5) * 32;
        ctx.fillStyle = `rgb(${128 + noise}, ${128 + noise * 0.3}, 255)`;
        ctx.fillRect(x, y, len, 1.2);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(6, 6);
      return texture;
    }

    // 5. Procedural Roughness Variation Map (Simulates micro-grain satin sheen)
    function createRoughnessMap() {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.fillStyle = "#333333";
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 1500; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const val = Math.floor(Math.random() * 50 + 35);
        ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
        ctx.fillRect(x, y, Math.random() * 80 + 20, 1.5);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    }

    // 6. HDR Industrial Studio Environment Map
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
          grad.addColorStop(0.2, "#cbd5e1");
          grad.addColorStop(1, "#05070B");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          // Overhead luminaire banks
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(30, 30, 196, 50);
        } else if (side === "ny") {
          grad.addColorStop(0, "#010204");
          grad.addColorStop(1, "#05070B");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);
        } else {
          grad.addColorStop(0, "#1e293b");
          grad.addColorStop(0.4, "#0f172a");
          grad.addColorStop(1, "#030509");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 256, 256);

          // Specular rim light bars
          ctx.fillStyle = "rgba(0, 210, 255, 0.22)";
          ctx.fillRect(15, 0, 40, 256);
        }
        canvasList.push(c);
      });

      const cubeTex = new THREE.CubeTexture(canvasList);
      cubeTex.needsUpdate = true;
      return cubeTex;
    }

    const normalMap = createBrushedMetalNormalMap();
    const roughnessMap = createRoughnessMap();
    const envMap = createProceduralStudioEnvironment();
    scene.environment = envMap;

    // 7. Elite 5-Point Studio Softbox & Dual Volumetric Rim Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambientLight);

    // Key Light: High-Intensity Directional Studio Softbox (Upper Front Right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
    keyLight.position.set(4.5, 6.5, 4.5);
    scene.add(keyLight);

    // Fill Light: Soft Skylight (Front Left)
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.8);
    fillLight.position.set(-5, 2.5, 3.5);
    scene.add(fillLight);

    // Overhead Softbox: Top-Down Vertical Illumination
    const overheadLight = new THREE.DirectionalLight(0xffffff, 2.5);
    overheadLight.position.set(0, 8, 0);
    scene.add(overheadLight);

    // Volumetric Rim Light A: Cool Steel-Blue (Rear Left Edge Highlight)
    const rimCyan = new THREE.DirectionalLight(0x38bdf8, 3.8);
    rimCyan.position.set(-5.5, 2.5, -4.5);
    scene.add(rimCyan);

    // Volumetric Rim Light B: Sharp Safety-Red / Amber (Rear Right Edge Highlight)
    const rimRed = new THREE.DirectionalLight(0xef4444, 2.4);
    rimRed.position.set(4.5, -2, -4);
    scene.add(rimRed);

    // 8. Luxury Studio Stage Turntable Pedestal
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // Circular Turntable Plinth
    const pedestalGeo = new THREE.CylinderGeometry(2.35, 2.42, 0.08, 96);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.95,
      roughness: 0.22,
      envMap: envMap,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -1.45, 0);
    stageGroup.add(pedestal);

    // Concentric Turntable Rim Glow Ring
    const stageRingGeo = new THREE.RingGeometry(2.34, 2.37, 96);
    const stageRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const stageRing = new THREE.Mesh(stageRingGeo, stageRingMat);
    stageRing.rotation.x = Math.PI / 2;
    stageRing.position.set(0, -1.405, 0);
    stageGroup.add(stageRing);

    // Concentric Inner Stage Track
    const innerTrackGeo = new THREE.RingGeometry(1.6, 1.615, 96);
    const innerTrackMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const innerTrack = new THREE.Mesh(innerTrackGeo, innerTrackMat);
    innerTrack.rotation.x = Math.PI / 2;
    innerTrack.position.set(0, -1.405, 0);
    stageGroup.add(innerTrack);

    // Holographic Ambient Particulates
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    stageGroup.add(particles);

    // 9. PROCEDURAL 3D MODELS (ALL 8 CORE PRODUCTS + EXPLODED VIEW SUPPORT)
    const elementsGroup = new THREE.Group();
    elementsGroupRef.current = elementsGroup;
    scene.add(elementsGroup);

    const baseMetalMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.98,
      roughness: 0.12,
      envMap: envMap,
      normalMap: normalMap || undefined,
      roughnessMap: roughnessMap || undefined,
    });

    const meshes: Record<string, THREE.Group | THREE.Mesh> = {};
    const animParts: Array<{
      mesh: THREE.Object3D;
      assembledPos: THREE.Vector3;
      explodedPos: THREE.Vector3;
    }> = [];

    // -------------------------------------------------------------
    // Model 1: PIPES (Industrial Heavy-Wall Seamless Pipe ASTM A312)
    // -------------------------------------------------------------
    const pipeGroup = new THREE.Group();
    const pipeOuterGeo = new THREE.CylinderGeometry(0.85, 0.85, 2.8, 64, 1, true);
    const pipeInnerGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.8, 64, 1, true);
    const pipeRingGeo = new THREE.RingGeometry(0.72, 0.85, 64);

    const pipeOuter = new THREE.Mesh(pipeOuterGeo, baseMetalMat);
    const pipeInner = new THREE.Mesh(
      pipeInnerGeo,
      new THREE.MeshStandardMaterial({
        color: 0x666666,
        metalness: 0.9,
        roughness: 0.35,
        side: THREE.BackSide,
        envMap: envMap,
      })
    );
    const pipeTop = new THREE.Mesh(pipeRingGeo, baseMetalMat);
    pipeTop.rotation.x = -Math.PI / 2;
    pipeTop.position.y = 1.4;

    const pipeBottom = new THREE.Mesh(pipeRingGeo, baseMetalMat);
    pipeBottom.rotation.x = Math.PI / 2;
    pipeBottom.position.y = -1.4;

    pipeGroup.add(pipeOuter, pipeInner, pipeTop, pipeBottom);
    pipeGroup.rotation.z = Math.PI / 7;
    pipeGroup.rotation.x = Math.PI / 9;
    meshes["pipes"] = pipeGroup;
    elementsGroup.add(pipeGroup);

    // Explode definition for Pipe: Bevel rings slide out
    animParts.push(
      { mesh: pipeTop, assembledPos: new THREE.Vector3(0, 1.4, 0), explodedPos: new THREE.Vector3(0, 2.1, 0) },
      { mesh: pipeBottom, assembledPos: new THREE.Vector3(0, -1.4, 0), explodedPos: new THREE.Vector3(0, -2.1, 0) }
    );

    // -------------------------------------------------------------
    // Model 2: TUBES (Thin-Wall High-Precision Instrumentation Tube)
    // -------------------------------------------------------------
    const tubeGroup = new THREE.Group();
    const tubeOuterGeo = new THREE.CylinderGeometry(0.48, 0.48, 3.2, 64, 1, true);
    const tubeInnerGeo = new THREE.CylinderGeometry(0.42, 0.42, 3.2, 64, 1, true);
    const tubeRingGeo = new THREE.RingGeometry(0.42, 0.48, 64);

    const tubeOuter = new THREE.Mesh(tubeOuterGeo, baseMetalMat);
    const tubeInner = new THREE.Mesh(
      tubeInnerGeo,
      new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9, roughness: 0.3, side: THREE.BackSide, envMap: envMap })
    );
    const tubeTop = new THREE.Mesh(tubeRingGeo, baseMetalMat);
    tubeTop.rotation.x = -Math.PI / 2;
    tubeTop.position.y = 1.6;

    const tubeBottom = new THREE.Mesh(tubeRingGeo, baseMetalMat);
    tubeBottom.rotation.x = Math.PI / 2;
    tubeBottom.position.y = -1.6;

    tubeGroup.add(tubeOuter, tubeInner, tubeTop, tubeBottom);
    tubeGroup.rotation.z = -Math.PI / 6;
    tubeGroup.rotation.x = Math.PI / 8;
    tubeGroup.visible = false;
    meshes["tubes"] = tubeGroup;
    elementsGroup.add(tubeGroup);

    // -------------------------------------------------------------
    // Model 3: COILS (Massive Rolled Steel Slit Master Coil)
    // -------------------------------------------------------------
    const coilGroup = new THREE.Group();
    const coilShape = new THREE.Shape();
    coilShape.absarc(0, 0, 1.4, 0, Math.PI * 2, false);
    const coilHole = new THREE.Path();
    coilHole.absarc(0, 0, 0.6, 0, Math.PI * 2, true);
    coilShape.holes.push(coilHole);

    const coilGeo = new THREE.ExtrudeGeometry(coilShape, {
      depth: 1.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      curveSegments: 64,
    });
    const coilMesh = new THREE.Mesh(coilGeo, baseMetalMat);
    coilMesh.position.z = -0.55;

    const strapGeo = new THREE.TorusGeometry(1.41, 0.02, 16, 64);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.3 });
    const strap1 = new THREE.Mesh(strapGeo, strapMat);
    strap1.position.z = -0.28;
    const strap2 = new THREE.Mesh(strapGeo, strapMat);
    strap2.position.z = 0.28;

    coilGroup.add(coilMesh, strap1, strap2);
    coilGroup.rotation.x = Math.PI / 4;
    coilGroup.rotation.y = Math.PI / 6;
    coilGroup.visible = false;
    meshes["coils"] = coilGroup;
    elementsGroup.add(coilGroup);

    // Explode definition for Coil: Straps slide apart
    animParts.push(
      { mesh: strap1, assembledPos: new THREE.Vector3(0, 0, -0.28), explodedPos: new THREE.Vector3(0, 0, -0.85) },
      { mesh: strap2, assembledPos: new THREE.Vector3(0, 0, 0.28), explodedPos: new THREE.Vector3(0, 0, 0.85) }
    );

    // -------------------------------------------------------------
    // Model 4: SHEETS (Stack of Mirror-Polished Stainless Sheets)
    // -------------------------------------------------------------
    const sheetGroup = new THREE.Group();
    const sheetCount = 5;
    for (let i = 0; i < sheetCount; i++) {
      const sGeo = new THREE.BoxGeometry(2.3, 0.04, 1.6);
      const sMesh = new THREE.Mesh(sGeo, baseMetalMat);
      sMesh.position.y = (i - 2) * 0.12;
      sheetGroup.add(sMesh);

      animParts.push({
        mesh: sMesh,
        assembledPos: new THREE.Vector3(0, (i - 2) * 0.12, 0),
        explodedPos: new THREE.Vector3(0, (i - 2) * 0.45, 0),
      });
    }
    sheetGroup.rotation.x = Math.PI / 5;
    sheetGroup.rotation.y = -Math.PI / 6;
    sheetGroup.visible = false;
    meshes["sheets"] = sheetGroup;
    elementsGroup.add(sheetGroup);

    // -------------------------------------------------------------
    // Model 5: PLATES (Heavy Structural & Boiler Quality Plate ASTM A516)
    // -------------------------------------------------------------
    const plateGroup = new THREE.Group();
    const plateGeo = new THREE.BoxGeometry(2.5, 0.35, 1.7);
    const plateMesh = new THREE.Mesh(plateGeo, baseMetalMat);
    plateGroup.add(plateMesh);
    plateGroup.rotation.x = Math.PI / 4;
    plateGroup.rotation.y = Math.PI / 6;
    plateGroup.visible = false;
    meshes["plates"] = plateGroup;
    elementsGroup.add(plateGroup);

    // -------------------------------------------------------------
    // Model 6: ROUND BARS (Precision Centerless Ground Bright Bar)
    // -------------------------------------------------------------
    const barGroup = new THREE.Group();
    const barGeo = new THREE.CylinderGeometry(0.55, 0.55, 3.0, 64);
    const barMesh = new THREE.Mesh(barGeo, baseMetalMat);
    barGroup.add(barMesh);
    barGroup.rotation.z = Math.PI / 3;
    barGroup.rotation.x = Math.PI / 8;
    barGroup.visible = false;
    meshes["bars"] = barGroup;
    elementsGroup.add(barGroup);

    // -------------------------------------------------------------
    // Model 7: FLANGES (ASME B16.5 Forged Weld Neck Flange)
    // -------------------------------------------------------------
    const flangeGroup = new THREE.Group();
    const flangeShape = new THREE.Shape();
    flangeShape.absarc(0, 0, 1.48, 0, Math.PI * 2, false);
    const fCenterHole = new THREE.Path();
    fCenterHole.absarc(0, 0, 0.72, 0, Math.PI * 2, true);
    flangeShape.holes.push(fCenterHole);

    const boltRadius = 1.18;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const bx = Math.cos(a) * boltRadius;
      const by = Math.sin(a) * boltRadius;
      const bHole = new THREE.Path();
      bHole.absarc(bx, by, 0.088, 0, Math.PI * 2, true);
      flangeShape.holes.push(bHole);
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

    // Gasket disc ring
    const gasketGeo = new THREE.RingGeometry(0.72, 1.15, 64);
    const gasketMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.6 });
    const gasketMesh = new THREE.Mesh(gasketGeo, gasketMat);
    gasketMesh.position.z = -0.13;

    flangeGroup.add(flangeMesh, neckMesh, gasketMesh);
    flangeGroup.rotation.x = Math.PI / 4;
    flangeGroup.visible = false;
    meshes["flanges"] = flangeGroup;
    elementsGroup.add(flangeGroup);

    // Explode definition for Flange: Weld Neck separates from Gasket & Flange face
    animParts.push(
      { mesh: neckMesh, assembledPos: new THREE.Vector3(0, 0, 0.45), explodedPos: new THREE.Vector3(0, 0, 1.2) },
      { mesh: gasketMesh, assembledPos: new THREE.Vector3(0, 0, -0.13), explodedPos: new THREE.Vector3(0, 0, -0.8) }
    );

    // -------------------------------------------------------------
    // Model 8: FITTINGS (Precision Double-Ferrule Tube Fitting Assembly)
    // -------------------------------------------------------------
    const fittingGroup = new THREE.Group();
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
    // Main Body
    const hexMesh = new THREE.Mesh(hexGeo, baseMetalMat);
    hexMesh.position.z = -0.45;

    // Front Ferrule (Cone)
    const frontFerruleGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.25, 48);
    const ferruleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.2 });
    const frontFerrule = new THREE.Mesh(frontFerruleGeo, ferruleMat);
    frontFerrule.rotation.x = Math.PI / 2;
    frontFerrule.position.z = 0.58;

    // Back Ferrule (Precision Ring)
    const backFerruleGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.18, 48);
    const backFerrule = new THREE.Mesh(backFerruleGeo, ferruleMat);
    backFerrule.rotation.x = Math.PI / 2;
    backFerrule.position.z = 0.85;

    // Outer Compression Nut
    const nutShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = Math.cos(a) * 0.74;
      const y = Math.sin(a) * 0.74;
      if (i === 0) nutShape.moveTo(x, y);
      else nutShape.lineTo(x, y);
    }
    const nutHole = new THREE.Path();
    nutHole.absarc(0, 0, 0.44, 0, Math.PI * 2, true);
    nutShape.holes.push(nutHole);

    const nutGeo = new THREE.ExtrudeGeometry(nutShape, {
      depth: 0.65,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
    });
    const nutMesh = new THREE.Mesh(nutGeo, baseMetalMat);
    nutMesh.position.z = 0.95;

    // Insert Instrumentation Tube
    const stemGeo = new THREE.CylinderGeometry(0.42, 0.42, 2.2, 48);
    const stemMesh = new THREE.Mesh(stemGeo, baseMetalMat);
    stemMesh.rotation.x = Math.PI / 2;
    stemMesh.position.z = -0.3;

    fittingGroup.add(hexMesh, frontFerrule, backFerrule, nutMesh, stemMesh);
    fittingGroup.rotation.x = Math.PI / 4;
    fittingGroup.visible = false;
    meshes["fittings"] = fittingGroup;
    elementsGroup.add(fittingGroup);

    // Explode definition for Fitting: Multi-part disassembly
    animParts.push(
      { mesh: frontFerrule, assembledPos: new THREE.Vector3(0, 0, 0.58), explodedPos: new THREE.Vector3(0, 0, 1.25) },
      { mesh: backFerrule, assembledPos: new THREE.Vector3(0, 0, 0.85), explodedPos: new THREE.Vector3(0, 0, 1.75) },
      { mesh: nutMesh, assembledPos: new THREE.Vector3(0, 0, 0.95), explodedPos: new THREE.Vector3(0, 0, 2.35) },
      { mesh: stemMesh, assembledPos: new THREE.Vector3(0, 0, -0.3), explodedPos: new THREE.Vector3(0, 0, -1.35) }
    );

    modelMeshesRef.current = meshes;
    animPartsRef.current = animParts;

    // 10. Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 11. 60 FPS Render Loop with Smooth Explosion Lerp
    let frameId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = (time: number) => {
      frameId = requestAnimationFrame(animate);

      frameCount++;
      if (time - lastTime >= 1000) {
        setFpsDisplay(frameCount);
        frameCount = 0;
        lastTime = time;
      }

      controls.update();

      // Smooth Lerp for Exploded / Assembled View
      animPartsRef.current.forEach((part) => {
        const target = isExploded ? part.explodedPos : part.assembledPos;
        part.mesh.position.lerp(target, 0.08);
      });

      // Background stage turntable tracks
      stageRing.rotation.z += 0.0015;
      innerTrack.rotation.z -= 0.002;

      // Bokeh particle float
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.001;
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
  }, [isExploded]);

  // Update Materials when Finish Changes
  useEffect(() => {
    let targetColor = 0xdddddd;
    let targetMetalness = 0.98;
    let targetRoughness = 0.12;
    let emissiveColor = 0x000000;
    let emissiveIntensity = 0;

    if (activeFinish === "ss316-mirror") {
      targetColor = 0xf8fafc; // Luminous Chrome / 316L mirror polish
      targetMetalness = 0.99;
      targetRoughness = 0.04;
    } else if (activeFinish === "inconel625") {
      targetColor = 0xd9be8e; // High-nickel champagne gold alloy
      targetMetalness = 0.96;
      targetRoughness = 0.16;
    } else if (activeFinish === "titanium-satin") {
      targetColor = 0x98adbe; // Satin titanium blue-gray luster
      targetMetalness = 0.92;
      targetRoughness = 0.20;
    } else if (activeFinish === "forged-glow") {
      targetColor = 0xff3b00; // Thermal induction core
      targetMetalness = 0.82;
      targetRoughness = 0.22;
      emissiveColor = 0xff3b00;
      emissiveIntensity = 1.25;
    } else if (activeFinish === "carbon-matte") {
      targetColor = 0x475569; // Precision graphite ASTM A106 carbon steel
      targetMetalness = 0.88;
      targetRoughness = 0.35;
    }

    Object.values(modelMeshesRef.current).forEach((groupOrMesh) => {
      groupOrMesh.traverse((child) => {
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
    });
  }, [activeFinish]);

  // Toggle active 3D model
  useEffect(() => {
    Object.entries(modelMeshesRef.current).forEach(([key, mesh]) => {
      mesh.visible = key === activeModel;
    });
  }, [activeModel]);

  const handleResetCamera = () => {
    if (!controlsRef.current || !cameraRef.current) return;
    cameraRef.current.position.set(2.4, 1.5, 4.6);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const productTabs: { id: Product3DModel; label: string }[] = [
    { id: "pipes", label: "Pipes" },
    { id: "tubes", label: "Tubes" },
    { id: "coils", label: "Coils" },
    { id: "sheets", label: "Sheets" },
    { id: "plates", label: "Plates" },
    { id: "bars", label: "Round Bars" },
    { id: "flanges", label: "Flanges" },
    { id: "fittings", label: "Fittings" },
  ];

  return (
    <div className="relative w-full h-full min-h-[580px] lg:min-h-[660px] flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#05070B]/70 backdrop-blur-xl shadow-2xl">
      {/* 1. CINEMATIC ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* 2. Full 360° Interactive WebGL Canvas */}
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 touch-none ${
          isInteracting ? "cursor-grabbing" : "cursor-grab"
        }`}
      />

      {/* 3. TOP TELEMETRY HUD */}
      <div className="relative z-10 w-full p-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-xl text-[11px] font-mono text-slate-300 pointer-events-auto shadow-lg">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">WEBGL PBR 2.0</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">{fpsDisplay} FPS</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">PBR ANISOTROPIC</span>
        </div>

        {/* REMOTION BRAND FILM & EXPLODE VIEW BUTTONS */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsCinemaOpen(true)}
            className="min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 group"
          >
            <Play className="h-3.5 w-3.5 fill-red-400 group-hover:scale-110 transition-transform" />
            <span>Brand Film (Remotion)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExploded((prev) => !prev)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-xl ${
              isExploded
                ? "bg-[#FF3B30] text-white shadow-red-500/30 border border-red-400"
                : "bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-white/15"
            }`}
          >
            <Split className="h-3.5 w-3.5" />
            <span>{isExploded ? "Exploded CAD: Active" : "Explode Assembly"}</span>
          </button>
        </div>
      </div>

      {/* 4. DRAG HINT PILL */}
      <div className="relative z-10 mx-auto pointer-events-none px-4">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/75 border border-cyan-500/25 text-xs font-mono text-slate-200 backdrop-blur-xl shadow-2xl">
          <Move className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span>Full 360&deg; Orbit &bull; Click &amp; Drag Anywhere on Canvas</span>
        </div>
      </div>

      {/* 5. FROSTED GLASS DYNAMIC COCKPIT CONTROLS */}
      <div className="relative z-10 w-full p-3 sm:p-4 pointer-events-auto">
        <div className="w-full glass-panel bg-slate-950/90 border border-white/15 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col gap-3 backdrop-blur-2xl">
          {/* Row 1: Product 3D Models Selector (Unless compact mode requested) */}
          {!compactControls && (
            <div className="space-y-1.5 pb-2.5 border-b border-white/10">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-cyan-400" />
                  Select 3D Metal Product Model:
                </span>
                <span className="text-slate-500 font-normal">8 Certified Shapes</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-white/5">
                {productTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveModel(tab.id)}
                    className={`min-h-[40px] px-2 py-1.5 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center leading-tight ${
                      activeModel === tab.id
                        ? "bg-[#FF3B30] text-white shadow-lg shadow-red-500/30 scale-[1.02]"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Row 2: Metallurgy Shader Finishes + Reset Camera Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" />
                Finish:
              </span>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "ss316-mirror", label: "Mirror Stainless", style: "bg-slate-100 text-slate-950 font-bold" },
                  { id: "inconel625", label: "Inconel 625", style: "bg-gradient-to-r from-amber-300 to-amber-500 text-slate-950 font-bold" },
                  { id: "titanium-satin", label: "Titanium Gr.5", style: "bg-gradient-to-r from-cyan-300 to-sky-400 text-slate-950 font-bold" },
                  { id: "carbon-matte", label: "Matte Carbon", style: "bg-slate-700 text-white font-bold" },
                  { id: "forged-glow", label: "Induction Glow", style: "bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold safety-glow" },
                ].map((fin) => (
                  <button
                    key={fin.id}
                    type="button"
                    onClick={() => setActiveFinish(fin.id as MaterialFinish)}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                      activeFinish === fin.id
                        ? `${fin.style} shadow-md`
                        : "bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {fin.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetCamera}
              className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all self-end sm:self-auto"
              title="Reset 360° Orbit View"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
              <span>Reset Angle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
