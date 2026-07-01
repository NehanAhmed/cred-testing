import { OAuthSection } from "@/components/oauth-section"
import Link from "next/link"
import { ChevronLeftIcon } from "lucide-react"

export default function OAuthPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
      <div>
        <Link
          href="/"
          className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" />
          Back to Health Check
        </Link>
        <h1 className="text-2xl font-medium tracking-tight">OAuth Module</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Test Google and GitHub OAuth 2.0 Authorization Code grant flows
        </p>
      </div>
      <OAuthSection />
    </div>
  )
}
