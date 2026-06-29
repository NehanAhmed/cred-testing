import { HealthCheck } from "@/components/health-check"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">
          Cred API Testing
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Interactive manual testing interface for the Cred authentication API
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/auth"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
        >
          Authentication Module
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      <HealthCheck />
    </div>
  )
}
