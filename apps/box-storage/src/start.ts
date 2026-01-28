import { createStart } from "@tanstack/react-start"
import { authMiddleware } from "./lib/middleware"

const start = createStart(authMiddleware)

export default start
