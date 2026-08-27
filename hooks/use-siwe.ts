"use client"

import { useCallback } from "react"
import { useChainId, useSignMessage } from "wagmi"
import { createSiweMessage } from "viem/siwe"

import { authWalletControllerNonceV1 } from "@/api/endpoints/auth"

export interface SiweAuthPayload {
  address: string
  message: string
  signature: string
  nonce: string
}

/**
 * 生成 SIWE（EIP-4361）登录 / 绑定所需的载荷。
 * 流程：获取 nonce -> 组装消息 -> 钱包签名。
 * 登录与「绑定钱包」共用此流程。
 */
export function useSiweAuth() {
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()

  return useCallback(
    async (address: string): Promise<SiweAuthPayload> => {
      const nonceRes = await authWalletControllerNonceV1()
      const nonce = nonceRes.data.nonce

      const message = createSiweMessage({
        address: address as `0x${string}`,
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: "1",
        statement: "Sign in to Cyber Wolf",
        issuedAt: new Date(),
      })

      const signature = await signMessageAsync({ message })
      return { address, message, signature, nonce }
    },
    [chainId, signMessageAsync]
  )
}
