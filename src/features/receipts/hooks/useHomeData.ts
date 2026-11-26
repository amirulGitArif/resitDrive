import { ReceiptRepository } from '../../../database/repositories';
import { useFocusData } from '../../../hooks/useFocusData';
import { getCurrentTaxYear } from '../../../utils/date';

export function useHomeData() {
  return useFocusData(async () => {
    const taxYear = getCurrentTaxYear();
    const [stats, recent] = await Promise.all([
      ReceiptRepository.getStats(taxYear),
      ReceiptRepository.getRecent(5),
    ]);
    return { stats, recent };
  });
}
