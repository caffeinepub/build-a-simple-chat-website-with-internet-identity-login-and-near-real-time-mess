export const MAX_MESSAGE_LENGTH = 500;

export interface ValidationResult {
  valid: boolean;
  error?: string;
  trimmed?: string;
}

export function validateMessage(content: string): ValidationResult {
  const trimmed = content.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Message cannot be empty',
    };
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
    };
  }

  return {
    valid: true,
    trimmed,
  };
}

