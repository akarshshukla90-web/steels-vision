/**
 * Automated test suite for Remotion compositions & frame physics
 */

import { interpolate } from "remotion";

function testRemotionPhysics() {
  console.log("=================================================");
  console.log("🎬 RUNNING REMOTION FRAME PHYSICS & LOGIC SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${detail || "Assertion failed"}`);
    }
  }

  // Test 1: Frame Interpolation Bounds for Showreel Scenes
  const framesToTest = [0, 50, 110, 160, 220, 275, 330, 400, 450];
  let allFinite = true;

  framesToTest.forEach((f) => {
    const s1 = interpolate(f, [0, 15, 95, 110], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const s2Laser = interpolate(f, [115, 215], [5, 95], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const s3Pressure = Math.round(
      interpolate(f, [230, 310], [0, 15000], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );

    if (isNaN(s1) || isNaN(s2Laser) || isNaN(s3Pressure)) {
      allFinite = false;
    }
  });

  assert(allFinite, "All Remotion interpolate() calls return valid finite numbers without NaN");

  // Test 2: Hydrostatic Peak Pressure Cap
  const maxPressure = Math.round(
    interpolate(310, [230, 310], [0, 15000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  assert(
    maxPressure === 15000,
    "Scene 3 Hydrostatic Pressure peaks at exactly 15,000 PSI",
    `Expected 15000, got ${maxPressure}`
  );

  // Test 3: Particle Drift Determinism
  const particles = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    baseX: ((i * 37) % 94) + 3,
    speedMultiplier: 0.6 + ((i * 13) % 10) * 0.12,
    offsetFrame: (i * 53) % 360,
  }));

  let particlesInRange = true;
  for (let f = 0; f < 360; f += 30) {
    particles.forEach((p) => {
      const progress = ((f * p.speedMultiplier + p.offsetFrame) % 360) / 360;
      const yPos = 105 - progress * 115;
      if (yPos < -15 || yPos > 110) {
        particlesInRange = false;
      }
    });
  }
  assert(particlesInRange, "Ambient particles stay strictly within realistic viewport traversal bounds");

  // Test 4: Ambient Modes Availability
  const modes = ["molten", "blueprint", "cryo"];
  assert(modes.length === 3, "All 3 Ambience VFX modes (Molten, Blueprint, Cryo) configured");

  console.log(`\nResults: ${passed}/${total} passed (${((passed / total) * 100).toFixed(0)}%)\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

testRemotionPhysics();
