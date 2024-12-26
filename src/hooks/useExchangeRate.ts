import { useState, useCallback } from 'react';

export function useExchangeRate() {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const fetchExchangeRate = useCallback(async () => {
    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();
      setExchangeRate(data.rate);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  }, []);

  return { exchangeRate, fetchExchangeRate };
}
