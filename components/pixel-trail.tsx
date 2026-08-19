"use client"

import { useMemo } from "react"
import {
  Canvas,
  useThree,
  type CanvasProps,
  type ThreeEvent,
} from "@react-three/fiber"
import { shaderMaterial, useTrailTexture } from "@react-three/drei"
import * as THREE from "three"

interface GooeyFilterProps {
  id?: string
  strength?: number
}

interface SceneProps {
  gridSize: number
  trailSize: number
  maxAge: number
  interpolate: number
  easingFunction: (x: number) => number
  pixelColor: string
}

interface PixelTrailProps {
  gridSize?: number
  trailSize?: number
  maxAge?: number
  interpolate?: number
  easingFunction?: (x: number) => number
  canvasProps?: Partial<CanvasProps>
  glProps?: WebGLContextAttributes & { powerPreference?: string }
  gooeyFilter?: { id: string; strength: number }
  color?: string
  className?: string
}

const GooeyFilter: React.FC<GooeyFilterProps> = ({
  id = "goo-filter",
  strength = 10,
}) => {
  return (
    <svg className="goo-filter-container" aria-hidden>
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={strength}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

const DotMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    mouseTrail: null,
    gridSize: 100,
    pixelColor: new THREE.Color("#ffffff"),
  },
  /* glsl vertex shader */ `
    varying vec2 vUv;
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl fragment shader */ `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    float sdfCircle(vec2 p, float r) {
        return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 gridUv = fract(uv * gridSize);
      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      float trail = texture2D(mouseTrail, gridUvCenter).r;

      gl_FragColor = vec4(pixelColor, trail);
    }
  `
)

function Scene({
  gridSize,
  trailSize,
  maxAge,
  interpolate,
  easingFunction,
  pixelColor,
}: SceneProps) {
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)

  // 创建时直接设置像素颜色（避免修改 hook 返回值触发 immutability 规则）
  const dotMaterial = useMemo(() => {
    const material = new DotMaterial()
    material.uniforms.pixelColor.value = new THREE.Color(pixelColor)
    return material
  }, [pixelColor])

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: trailSize,
    maxAge: maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction || ((x: number) => x),
  }) as [THREE.Texture | null, (e: ThreeEvent<PointerEvent>) => void]

  if (trail) {
    // three.js 纹理的最近邻采样等配置，属必要命令式操作
    // eslint-disable-next-line react-hooks/immutability
    trail.minFilter = THREE.NearestFilter
    // eslint-disable-next-line react-hooks/immutability
    trail.magFilter = THREE.NearestFilter
    // eslint-disable-next-line react-hooks/immutability
    trail.wrapS = THREE.ClampToEdgeWrapping
    // eslint-disable-next-line react-hooks/immutability
    trail.wrapT = THREE.ClampToEdgeWrapping
  }

  const scale = Math.max(viewport.width, viewport.height) / 2

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={onMove}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        gridSize={gridSize}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        mouseTrail={trail}
      />
    </mesh>
  )
}

/**
 * PixelTrail 像素拖尾（reactbits 移植版，React Three Fiber 实现）。
 * 鼠标移动产生像素网格点亮拖尾效果。
 */
export function PixelTrail({
  gridSize = 40,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  easingFunction = (x: number) => x,
  canvasProps = {},
  glProps = {
    antialias: false,
    powerPreference: "high-performance",
    alpha: true,
  },
  gooeyFilter,
  color = "#ffffff",
  className = "",
}: PixelTrailProps) {
  return (
    <>
      {gooeyFilter && (
        <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} />
      )}
      <Canvas
        {...canvasProps}
        gl={glProps}
        fallback={null}
        className={`pixel-canvas ${className}`}
        style={gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : undefined}
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          pixelColor={color}
        />
      </Canvas>
    </>
  )
}
