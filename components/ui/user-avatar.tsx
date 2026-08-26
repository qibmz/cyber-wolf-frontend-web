"use client"

import type { User } from "@/api/endpoints/api.schemas"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GeneratedAvatar } from "@/components/ui/generated-avatar"

function getAvatarUrl(photo: unknown): string | undefined {
  if (typeof photo === "string" && photo) return photo
  if (photo && typeof photo === "object" && "url" in photo) {
    const url = (photo as { url?: unknown }).url
    if (typeof url === "string" && url) return url
  }
  return undefined
}

/**
 * 用户头像：有上传照片则优先显示照片；
 * 否则基于邮箱/钱包地址生成确定性头像；
 * 都没有时回退首字母。
 */
export function UserAvatar({
  user,
  size = 32,
  className,
}: {
  user: User
  size?: number
  className?: string
}) {
  const displayName = user.nickname?.trim() || user.email || ""
  const avatarUrl = getAvatarUrl(user.photo)
  // 种子优先级：钱包地址 -> 邮箱 -> 昵称
  const seed = user.walletAddress || user.email || user.nickname || ""

  if (avatarUrl) {
    return (
      <Avatar className={className}>
        <AvatarImage src={avatarUrl} alt={displayName || "avatar"} />
        <AvatarFallback>
          {displayName.slice(0, 1).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
    )
  }

  if (seed) {
    return <GeneratedAvatar seed={seed} size={size} className={className} />
  }

  return (
    <Avatar className={className}>
      <AvatarFallback>
        {displayName.slice(0, 1).toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  )
}
