"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getProfile } from "@/lib/api/profile"
import type { UserData } from "@/lib/api/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type OAuthState =
  | { status: "processing" }
  | { status: "success"; user: UserData }
  | { status: "error"; error: string }

function OAuthCallbackInner() {
  const searchParams = useSearchParams()

  const [state, setState] = useState<OAuthState>(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      return { status: "error", error: errorParam }
    }
    return { status: "processing" }
  })

  useEffect(() => {
    if (state.status !== "processing") {
      return
    }

    let cancelled = false

    getProfile().then((result) => {
      if (cancelled) {
        return
      }

      if (result.kind === "success") {
        setState({ status: "success", user: result.body.data })
      } else if (result.kind === "api-error") {
        setState({ status: "error", error: result.body.message })
      } else {
        setState({
          status: "error",
          error: "Authentication failed. Please try again.",
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [state.status])

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>OAuth Callback</CardTitle>
        </CardHeader>
        <CardContent>
          {state.status === "processing" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Verifying authentication...
            </div>
          )}

          {state.status === "success" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="default">Authenticated</Badge>
              </div>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Username:</span>{" "}
                  {state.user.username}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {state.user.email}
                </p>
              </div>
            </div>
          )}

          {state.status === "error" && (
            <div className="space-y-2">
              <Badge variant="destructive">Authentication Failed</Badge>
              <p className="text-sm text-destructive">{state.error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const dynamic = "force-dynamic"

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>OAuth Callback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Loading...
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  )
}
