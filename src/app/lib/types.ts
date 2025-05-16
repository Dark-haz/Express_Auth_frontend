export interface ApiResponse<T> {
    isSuccess: boolean;
    errorMessages: string[];
    statusCode: number;
    result?: T;
  }