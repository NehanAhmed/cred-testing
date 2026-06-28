"use client"

import { useCallback, useEffect, useState } from "react"
import { getProfile } from "@/lib/api/profile"
import type { UserData } from "@/lib/api/auth"

export function useAuthState() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getProfile().then((result) => {
      if (cancelled) {
        return
      }

      if (result.kind === "success") {
        setUser(result.body.data)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const checkAuth = useCallback(async () => {
    const result = await getProfile()
    if (result.kind === "success") {
      setUser(result.body.data)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
    return result
  }, [])

  const clearAuth = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    clearAuth,
  }
}
