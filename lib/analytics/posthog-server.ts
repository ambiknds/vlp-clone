import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

/**
 * Returns a server-side PostHog client singleton using posthog-node.
 * Follows PostHog Next.js App Router guidelines:
 * - flushAt: 1, flushInterval: 0 for serverless/short-lived functions
 * - Clean shutdown after capture
 */
export function getPostHogServerClient(): PostHog | null {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    return null;
  }

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}

/**
 * Captures an event on the server side using posthog-node.
 * Strictly adheres to zero PII policy: only Clerk user ID or anonymous distinctId is used.
 */
export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties: Record<string, unknown> = {}
) {
  try {
    const client = getPostHogServerClient();
    if (!client) return;

    client.capture({
      distinctId: distinctId || "anonymous",
      event,
      properties: {
        $lib: "posthog-node",
        ...properties,
      },
    });

    await client.shutdown();
  } catch (error) {
    // Fail non-blockingly so telemetry never breaks the user request
    console.error("PostHog server capture error:", error);
  }
}
