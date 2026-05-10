import {
  ErrorComponent,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type RoutePendingStateProps = {
  title: string
  description: string
}

export function RoutePendingState({
  title,
  description,
}: RoutePendingStateProps) {
  return (
    <div className="p-4">
      <section className="flex min-h-55 flex-col items-center justify-center gap-3 rounded-lg border bg-card px-4 text-center">
        <Spinner className="size-6" />
        <div className="space-y-1">
          <h2 className="text-base font-medium">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </section>
    </div>
  )
}

export function RouteErrorState({ error, reset }: ErrorComponentProps) {
  return (
    <div className="p-4">
      <section className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-red-900">
            Unexpected error while loading this page
          </h2>
          <p className="text-sm text-red-800">
            Please retry. If the problem persists, check server logs.
          </p>
        </div>
        <ErrorComponent error={error} />
        <div className="flex items-center justify-end">
          <Button type="button" variant="outline" onClick={reset}>
            Retry
          </Button>
        </div>
      </section>
    </div>
  )
}
