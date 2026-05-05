"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import * as THREE from "three";

import { ProductImage } from "@/lib/types";

type RotationState = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildBoltGroup() {
  const group = new THREE.Group();

  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#c99b42"),
    metalness: 0.92,
    roughness: 0.26,
    clearcoat: 0.45,
    clearcoatRoughness: 0.28,
    reflectivity: 1
  });

  const darkerGoldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#9f7428"),
    metalness: 0.95,
    roughness: 0.34,
    clearcoat: 0.3
  });

  const darkHoleMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#433528"),
    metalness: 0.15,
    roughness: 0.72
  });

  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.3, 6), goldMaterial);
  head.rotation.z = Math.PI / 2;
  head.position.x = -1.18;
  group.add(head);

  const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.08, 36), darkerGoldMaterial);
  flange.rotation.z = Math.PI / 2;
  flange.position.x = -0.9;
  group.add(flange);

  const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.9, 44), goldMaterial);
  shank.rotation.z = Math.PI / 2;
  shank.position.x = 0.08;
  group.add(shank);

  const threadBody = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.92, 56), darkerGoldMaterial);
  threadBody.rotation.z = Math.PI / 2;
  threadBody.position.x = 1.35;
  group.add(threadBody);

  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.12, 42), darkerGoldMaterial);
  tip.rotation.z = Math.PI / 2;
  tip.position.x = 1.88;
  group.add(tip);

  for (let index = 0; index < 13; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.282, 0.026, 12, 36),
      darkerGoldMaterial
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.x = 0.88 + index * 0.08;
    group.add(ring);
  }

  const drilledHole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.68, 20),
    darkHoleMaterial
  );
  drilledHole.position.set(1.02, 0, 0);
  drilledHole.rotation.z = Math.PI / 2;
  group.add(drilledHole);

  group.rotation.set(-0.5, 0.65, -0.28);
  return group;
}

function BoltStage({
  zoom,
  rotation,
  setRotation,
  fullscreen = false
}: {
  zoom: number;
  rotation: RotationState;
  setRotation: (rotation: RotationState) => void;
  fullscreen?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; start: RotationState } | null>(null);
  const rotationRef = useRef(rotation);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7f1e8, 8.5, 16);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.4);

    const boltGroup = buildBoltGroup();
    scene.add(boltGroup);

    const fill = new THREE.HemisphereLight(0xfff5db, 0x4c2e1d, 2.4);
    scene.add(fill);

    const key = new THREE.DirectionalLight(0xfff4d6, 2.8);
    key.position.set(4, 5, 6);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xa8d6ff, 1.3);
    rim.position.set(-5, 2.2, -4);
    scene.add(rim);

    const bounce = new THREE.PointLight(0xffc978, 24, 18, 2);
    bounce.position.set(0, -1.5, 3.5);
    scene.add(bounce);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.65, 40),
      new THREE.MeshBasicMaterial({
        color: 0x2d2319,
        transparent: true,
        opacity: 0.16
      })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.18;
    shadow.scale.set(1.8, 0.82, 1);
    scene.add(shadow);

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(2.15, 3.75, 48),
      new THREE.MeshBasicMaterial({
        color: 0xffde95,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
      })
    );
    halo.position.z = -1.3;
    scene.add(halo);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) {
        return;
      }

      const { width, height } = parent.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement ?? canvas);

    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);

      const next = rotationRef.current;
      boltGroup.rotation.x += (next.x - boltGroup.rotation.x) * 0.12;
      boltGroup.rotation.y += (next.y - boltGroup.rotation.y) * 0.12;
      boltGroup.rotation.z += (-0.24 - boltGroup.rotation.z) * 0.12;

      const scale = zoomRef.current * (fullscreen ? 1.24 : 1);
      boltGroup.scale.setScalar(scale);
      halo.rotation.z += 0.0025;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((item) => item.dispose());
          } else {
            material.dispose();
          }
        }
      });
    };
  }, [fullscreen]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      start: rotationRef.current
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;

    setRotation({
      x: clamp(dragRef.current.start.x + dy * 0.01, -1.25, 0.7),
      y: clamp(dragRef.current.start.y + dx * 0.012, -1.5, 1.95)
    });
  }

  function releasePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId);
      dragRef.current = null;
    }
  }

  return (
    <div
      className={`product-viewer__stage ${fullscreen ? "is-fullscreen" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
    >
      <canvas ref={canvasRef} className="product-viewer__canvas" />
      <div className="product-viewer__hint">Drag to rotate the 3D AN3-5A model</div>
    </div>
  );
}

export function ProductViewer({
  src,
  images,
  alt,
  caption
}: {
  src: string;
  images?: ProductImage[];
  alt: string;
  caption: string;
}) {
  const gallery = useMemo(
    () =>
      images?.length
        ? images
        : [
            {
              src,
              alt,
              label: "Reference"
            }
          ],
    [alt, images, src]
  );

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState<RotationState>({ x: -0.46, y: 0.72 });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function resetView() {
    setRotation({ x: -0.46, y: 0.72 });
    setZoom(1);
  }

  const activeReference = gallery[activeImageIndex];

  return (
    <div className="product-viewer">
      <BoltStage zoom={zoom} rotation={rotation} setRotation={setRotation} />
      <div className="product-viewer__toolbar">
        <div className="product-viewer__thumbs">
          {gallery.map((image, index) => (
            <button
              key={image.src}
              type="button"
              className={`product-viewer__thumb ${index === activeImageIndex ? "is-active" : ""}`}
              onClick={() => setActiveImageIndex(index)}
            >
              <Image src={image.src} alt={image.alt} width={72} height={72} className="product-viewer__thumb-image" />
              <span>{image.label}</span>
            </button>
          ))}
        </div>
        <div className="pill-row">
          <button
            type="button"
            className="button-secondary"
            onClick={() => setZoom((value) => clamp(Number((value - 0.08).toFixed(2)), 0.8, 1.55))}
          >
            Zoom Out
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => setZoom((value) => clamp(Number((value + 0.08).toFixed(2)), 0.8, 1.55))}
          >
            Zoom In
          </button>
          <button type="button" className="button-secondary" onClick={() => setIsFullscreen(true)}>
            Fullscreen
          </button>
          <button type="button" className="button-secondary" onClick={resetView}>
            Reset View
          </button>
        </div>
        <div className="product-viewer__reference">
          <div>
            <strong>Reference image</strong>
            <p className="muted">
              The 3D render is modeled from the AN3-5A reference photos shown here, with proportions tuned to the product spec.
            </p>
          </div>
          <Image
            src={activeReference.src}
            alt={activeReference.alt}
            width={180}
            height={180}
            className="product-viewer__reference-image"
          />
        </div>
        <p className="muted">{caption}</p>
      </div>
      {isFullscreen ? (
        <div className="product-viewer__lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="product-viewer__backdrop"
            aria-label="Close fullscreen viewer"
            onClick={() => setIsFullscreen(false)}
          />
          <div className="product-viewer__lightbox-panel">
            <div className="product-viewer__lightbox-header">
              <strong>AN3-5A 3D Viewer</strong>
              <button type="button" className="button-secondary" onClick={() => setIsFullscreen(false)}>
                Close
              </button>
            </div>
            <BoltStage zoom={zoom} rotation={rotation} setRotation={setRotation} fullscreen />
          </div>
        </div>
      ) : null}
    </div>
  );
}
