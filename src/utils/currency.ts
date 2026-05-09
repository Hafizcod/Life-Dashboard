// Currency configuration defaults
export interface CurrencyConfig {
  code: string;
  symbol: string;
  rate: number;
  locale: string;
}

export const DEFAULT_CURRENCY: CurrencyConfig = {
  code: 'IDR',
  symbol: 'Rp',
  rate: 1,
  locale: 'id-ID',
};

/**
 * Formats a numeric amount into a currency string.
 * @param amount The numeric amount to format.
 * @param currencyCode The currency code (e.g., 'IDR', 'USD').
 * @param locale The locale for formatting (default: 'id-ID').
 */
export const formatCurrency = (
  amount: number = 0,
  currencyCode: string = 'IDR',
  locale: string = 'id-ID'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: currencyCode === 'IDR' ? 0 : 2,
    }).format(amount);
  } catch (error) {
    return `${currencyCode} ${amount.toLocaleString()}`;
  }
};

/**
 * Converts an amount from one currency to another based on a rate.
 * In a real app, you'd fetch live rates. Here we mimic the old logic.
 */
export const convertCurrency = (
  amount: number,
  fromRate: number = 1,
  toRate: number = 1
): number => {
  if (!amount) return 0;
  // Convert to base (IDR) first, then to target
  const amountInBase = amount / fromRate;
  return amountInBase * toRate;
};
