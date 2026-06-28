import { HealthCheck } from "@/components/health-check"

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
      <HealthCheck />
    </div>
  )
}
