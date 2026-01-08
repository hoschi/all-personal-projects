const result = await Bun.spawn(["bunx", "prettier", "--check", "."], {
    stdio: ["ignore", "pipe", "inherit"] as const,
});

process.exit(result.exitCode);

export { };
