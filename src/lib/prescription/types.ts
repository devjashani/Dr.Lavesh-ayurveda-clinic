export interface PrescribedMedicine {
  id: string;
  order: number;
  name: string;
  dosage?: string;
  timing?: string;
  duration?: string;
  addedAt: string;
}

export interface ConsultationPrescription {
  bookingId: string;
  medicines: PrescribedMedicine[];
  clinicalAdvice: string;
  updatedAt: string;
}

/**
 * Normalizes and re-numbers an ordered list of prescribed medicines (1, 2, 3...).
 */
export function normalizeMedicineOrder(items: PrescribedMedicine[]): PrescribedMedicine[] {
  return items
    .filter((item) => item && typeof item.name === 'string' && item.name.trim().length > 0)
    .map((item, idx) => ({
      id: item.id || `med-${idx + 1}`,
      order: idx + 1,
      name: item.name.trim(),
      dosage: item.dosage?.trim() || '',
      timing: item.timing?.trim() || '',
      duration: item.duration?.trim() || '',
      addedAt: item.addedAt || new Date().toISOString(),
    }));
}
