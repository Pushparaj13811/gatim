export class ApiError extends Error {
    constructor(
      message: string,
      public status?: number,
      public code?: string
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  export function handleApiError(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        return 'Network error. Please check your connection.';
      }
      return error.message;
    }
    return 'An unexpected error occurred';
  }