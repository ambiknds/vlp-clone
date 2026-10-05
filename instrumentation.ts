import { SeverityNumber } from "@opentelemetry/api-logs"
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http"
import { resourceFromAttributes } from "@opentelemetry/resources"
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs"

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

let loggerProvider: LoggerProvider | undefined
let posthogLogsLogger: ReturnType<LoggerProvider["getLogger"]> | undefined

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return
  }

  if (!projectToken) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured",
      )
    }
    return
  }

  if (!host) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured",
      )
    }
    return
  }

  loggerProvider = new LoggerProvider({
    resource: resourceFromAttributes({ "service.name": "vertex-lms" }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${host}/i/v1/logs`,
          headers: {
            Authorization: `Bearer ${projectToken}`,
            "Content-Type": "application/json",
          },
        }),
      }),
    ],
  })
  posthogLogsLogger = loggerProvider.getLogger("vertex-lms.posthog")
}

export function logSanityFetchCompleted(revalidate: number | false) {
  posthogLogsLogger?.emit({
    body: "sanity_fetch_completed",
    severityNumber: SeverityNumber.INFO,
    attributes: {
      cache_revalidation_seconds: revalidate === false ? 0 : revalidate,
    },
  })
}

export function logSanityFetchFailed() {
  posthogLogsLogger?.emit({
    body: "sanity_fetch_failed",
    severityNumber: SeverityNumber.ERROR,
  })
}

export async function flushPostHogLogs() {
  await loggerProvider?.forceFlush()
}
