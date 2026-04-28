type logLevel = "info" | "warn" | "error"

const writeLog = (level: string, message: string, metadata?: Record<string, unknown>) => {
    const payload = {
        level,
        message,
        timestamp: new Date().toISOString(),
        ...(metadata || {})
    }

    const serialized = JSON.stringify(payload)

    if (level === "error") {
        console.error(serialized);
        return;
    }

    if (level === "warn") {
        console.warn(serialized);
        return;
    }

    console.log(serialized);
}

export const logger = {
    info: (message: string, metadata?: Record<string, unknown>) => writeLog("info", message, metadata),
    warn: (message: string, metadata?: Record<string, unknown>) => writeLog("warn", message, metadata),
    error: (message: string, metadata?: Record<string, unknown>) => writeLog("error", message, metadata),
}