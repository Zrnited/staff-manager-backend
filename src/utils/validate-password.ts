// utils/validate-password.ts
export type PasswordCheck = {
  valid: boolean;
  errors: string[];
};

const MIN_LENGTH = 8;
const MAX_LENGTH = 128; // stops huge inputs from making hashing expensive

const COMMON_PASSWORDS = new Set([
  "password", "password1", "password123", "12345678", "123456789",
  "qwerty123", "iloveyou", "admin123", "welcome1", "letmein123",
]);

export function validatePassword(
  password: string,
  context: { email?: string; name?: string } = {},
): PasswordCheck {
  const errors: string[] = [];

  if (typeof password !== "string" || password.length === 0) {
    return { valid: false, errors: ["Password is required"] };
  }

  if (password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters`);
  }
  if (password.length > MAX_LENGTH) {
    errors.push(`Password must be at most ${MAX_LENGTH} characters`);
  }
  if (!/[a-z]/.test(password)) errors.push("Password must include a lowercase letter");
  if (!/[A-Z]/.test(password)) errors.push("Password must include an uppercase letter");
  if (!/\d/.test(password)) errors.push("Password must include a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Password must include a special character");
  if (/\s/.test(password)) errors.push("Password must not contain spaces");

  const lower = password.toLowerCase();

  if (COMMON_PASSWORDS.has(lower)) {
    errors.push("Too common, choose a password less guessable");
  }

  const emailName = context.email?.split("@")[0]?.toLowerCase();
  if (emailName && emailName.length >= 3 && lower.includes(emailName)) {
    errors.push("Password must not contain your email name");
  }

  const firstName = context.name?.trim().split(/\s+/)[0]?.toLowerCase();
  if (firstName && firstName.length >= 3 && lower.includes(firstName)) {
    errors.push("Password must not contain your name");
  }

  return { valid: errors.length === 0, errors };
}