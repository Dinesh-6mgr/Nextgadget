import { useSelector } from 'react-redux';

// Returns a formatter: price(99.9) => "Rs. 99.90"
const useCurrency = () => {
  const symbol = useSelector((s) => s.settings.currencySymbol) || '$';
  return (amount) => `${symbol}${Number(amount).toFixed(2)}`;
};

export default useCurrency;
