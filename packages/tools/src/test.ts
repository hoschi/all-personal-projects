const result = await Bun.spawn(["bun", "test"], {
    stdio: ["ignore", "pipe", "inherit"] as const,
});

if (result.exitCode !== 0 && result.exitCode !== 1) {
    console.error("No tests found. Make sure tests exist in the project.");
    process.exit(1);
}

process.exit(result.exitCode);

export { };
