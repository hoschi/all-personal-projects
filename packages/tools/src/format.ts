const result = await Bun.spawn(["bunx", "prettier", "--write", "."], {
    stdio: ["ignore", "pipe", "inherit"] as const,
});

process.exit(result.exitCode);

export { };
