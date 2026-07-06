import { getApiBaseUrl, joinApiUrl } from "@/lib/config/apiBaseUrl";

const CONTENT_LOADER_ENDPOINT_PATH = "/api/v1/website/content";

export async function fetchContentFromBackend(): Promise<unknown> {
  const baseUrl = getApiBaseUrl();
  const endpointUrl = joinApiUrl(baseUrl, CONTENT_LOADER_ENDPOINT_PATH);

  const response = await fetch(endpointUrl, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Content request failed: ${response.status}`);
  }

  return response.json();
}