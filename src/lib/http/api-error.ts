export interface ApiErrorInput {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

export function createApiError(input: ApiErrorInput): Response {
  return Response.json(
    {
      error: {
        code: input.code,
        message: input.message,
        details: input.details ?? {}
      }
    },
    { status: input.status }
  );
}
