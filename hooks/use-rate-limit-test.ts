"use client"

import { useState, useCallback, useRef } from "react"
import type { ApiResult } from "@/lib/api-client"
import type { RateLimiterDef } from "@/lib/api/rate-limit"
import { fireRequest } from "@/lib/api/rate-limit"

export type SingleRequestResult = {
  index: number
  status: number
  kind: ApiResult<unknown>["kind"]
  body: unknown
}

export type RateLimitSummary = {
  total: number
  succeeded: number
  rateLimited: number
  other: number
}

export function useRateLimitTest(def: RateLimiterDef) {
  const [results, setResults] = useState<SingleRequestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const abortRef = useRef(false)

  const fire = useCallback(
    async (count: number) => {
      abortRef.current = false
      setIsRunning(true)
      setResults([])

      const collected: SingleRequestResult[] = []

      for (let i = 0; i < count; i++) {
        if (abortRef.current) break

        const res = await fireRequest(def)

        if (abortRef.current) break

        collected.push({
          index: i + 1,
          status: "status" in res ? res.status : 0,
          kind: res.kind,
          body: "body" in res ? res.body : "error" in res ? res.error : null,
        })

        setResults([...collected])
      }

      setIsRunning(false)
    },
    [def]
  )

  const reset = useCallback(() => {
    abortRef.current = true
    setResults([])
    setIsRunning(false)
  }, [])

  const summary: RateLimitSummary = {
    total: results.length,
    succeeded: results.filter((r) => r.kind === "success").length,
    rateLimited: results.filter((r) => r.kind === "rate-limit").length,
    other: results.filter(
      (r) => r.kind !== "success" && r.kind !== "rate-limit"
    ).length,
  }

  const firstRateLimited = results.find((r) => r.kind === "rate-limit") as
    SingleRequestResult | undefined

  return {
    results,
    isRunning,
    summary,
    firstRateLimited,
    fire,
    reset,
    abort: () => {
      abortRef.current = true
    },
  }
}
