export class CliSafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliSafetyError";
  }
}

export function sanitizedErrorMessage(error: unknown): string {
  if (error instanceof CliSafetyError) {
    return error.message;
  }
  return "Operation failed safely; no unverified changes were accepted.";
}
