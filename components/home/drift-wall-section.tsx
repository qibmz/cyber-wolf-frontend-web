import { DriftWall } from "@/components/drift-wall"

/**
 * DriftWall 流动图片墙区块（远程示例图片）。
 * turn 调小以减弱 3D 透视投影造成的视觉偏移。
 */
export function DriftWallSection() {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden pt-2 pb-12">
      <div className="h-[52vh] w-full">
        <DriftWall turn={-4} tilt={10} />
      </div>
    </section>
  )
}
