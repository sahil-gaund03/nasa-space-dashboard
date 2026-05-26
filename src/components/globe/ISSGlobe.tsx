"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ISSGlobeProps {
  lat: number;
  lng: number;
}

export function ISSGlobe({ lat, lng }: ISSGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const issMarkerRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Transparent background
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Light Sources
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x06b6d4, 1.5, 300);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0x7c3aed, 1, 300);
    secondaryLight.position.set(-100, -100, 100);
    scene.add(secondaryLight);

    // 3. Holographic Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeRef.current = globeGroup;

    // Radius of Earth
    const radius = 60;

    // Earth Sphere (Translucent base)
    const earthGeo = new THREE.SphereGeometry(radius, 40, 40);
    const earthMat = new THREE.MeshBasicMaterial({
      color: 0x0b1120,
      transparent: true,
      opacity: 0.8,
      wireframe: false,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Wireframe Grid Overlay (Holographic effect)
    const wireframeGeo = new THREE.SphereGeometry(radius + 0.5, 32, 24);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // Continent Outlines (Holographic dots/points representation)
    const pointsGeo = new THREE.SphereGeometry(radius + 0.1, 64, 48);
    const pointsMat = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.85,
      transparent: true,
      opacity: 0.4,
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(pointsMesh);

    // Orbit Ring Path for the ISS
    const orbitRadius = radius + 15;
    const orbitCurve = new THREE.EllipseCurve(
      0, 0,
      orbitRadius, orbitRadius,
      0, 2 * Math.PI,
      false,
      0
    );
    const orbitPoints = orbitCurve.getPoints(100).map(p => new THREE.Vector3(p.x, 0, p.y));
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.4,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    
    // Tilt the ISS orbit roughly like the real 51.6 degrees
    orbitLine.rotation.x = Math.PI / 3.5;
    orbitLine.rotation.y = Math.PI / 6;
    globeGroup.add(orbitLine);

    // 4. ISS Live Marker Mesh
    const markerGeo = new THREE.SphereGeometry(2, 8, 8);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.9,
    });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    
    // Glow ring for the ISS
    const glowGeo = new THREE.RingGeometry(2.5, 4, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const glowRing = new THREE.Mesh(glowGeo, glowMat);
    marker.add(glowRing);

    scene.add(marker);
    issMarkerRef.current = marker;

    // 5. Update Position Function
    const updateMarkerPosition = (lt: number, lg: number) => {
      const phi = (90 - lt) * (Math.PI / 180);
      const theta = (lg + 180) * (Math.PI / 180);

      // Distance from center of earth
      const d = radius + 12; 

      const x = -(d * Math.sin(phi) * Math.sin(theta));
      const y = d * Math.cos(phi);
      const z = d * Math.sin(phi) * Math.cos(theta);

      marker.position.set(x, y, z);
      
      // Orient glow ring to look outwards from Earth center
      glowRing.lookAt(new THREE.Vector3(0, 0, 0));
    };

    // Initialize position
    updateMarkerPosition(lat, lng);

    // 6. Animation Loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate Earth slowly
      if (globeGroup) {
        globeGroup.rotation.y += 0.0015;
        globeGroup.rotation.x += 0.0003;
      }

      // Pulse the ISS marker glow ring
      const time = Date.now() * 0.005;
      const scale = 1 + Math.sin(time) * 0.25;
      glowRing.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };
    
    animate();

    // 7. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update marker position when lat/lng updates
  useEffect(() => {
    if (issMarkerRef.current) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const d = 60 + 12; // radius + ISS altitude representation
      const x = -(d * Math.sin(phi) * Math.sin(theta));
      const y = d * Math.cos(phi);
      const z = d * Math.sin(phi) * Math.cos(theta);
      
      issMarkerRef.current.position.set(x, y, z);
    }
  }, [lat, lng]);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
export default ISSGlobe;
