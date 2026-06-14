export type HealthResult = {
  service: "api";
  status: "ok";
  timestamp: string;
};

export function getHealth(): HealthResult {
  return {
    service: "api",
    status: "ok",
    timestamp: new Date().toISOString(),
  };
}

