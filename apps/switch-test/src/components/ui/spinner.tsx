import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { omit } from "ramda"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...omit(
        ["children", "ref"],
        props,
      )} /* not sure why only I have TS error with ShadCN components ...*/
    />
  )
}

export { Spinner }
