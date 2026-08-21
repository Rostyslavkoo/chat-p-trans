export const MESSAGE_MAX_LENGTH = 1000;

const MIN_PHONE_DIGITS = 9;
const MAX_PHONE_DIGITS = 15;

export interface PreChatErrors {
  phone?: string;
  message?: string;
}

/**
 * Validates the pre-chat form. Phone rules follow E.164: digits only once
 * separators are stripped, at most 15 of them. A leading "+" is allowed.
 */
export function validatePreChat(input: { phone: string; message: string }): PreChatErrors {
  const errors: PreChatErrors = {};

  const digits = input.phone.replace(/[\s()-]/g, "").replace(/^\+/, "");
  const isPhoneShaped = /^\d+$/.test(digits);

  if (!input.phone.trim()) {
    errors.phone = "Введіть номер телефону";
  } else if (!isPhoneShaped || digits.length < MIN_PHONE_DIGITS || digits.length > MAX_PHONE_DIGITS) {
    errors.phone = `Введіть номер у міжнародному форматі (до ${MAX_PHONE_DIGITS} цифр)`;
  }

  if (!input.message.trim()) {
    errors.message = "Повідомлення обов'язкове";
  }

  return errors;
}
