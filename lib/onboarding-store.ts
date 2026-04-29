const STORAGE_KEY = 'captura_onboarding_data';

export interface PortalOnboardingData {
  email?: string;
  cpfCnpj?: string;
  documentType?: 'cpf' | 'cnpj';
  planType?: 'free' | 'pro' | 'business';
  paymentMethod?: 'card' | 'pix';
  cardData?: {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
  };
}

export interface ApiOnboardingData {
  email?: string;
  apiKey?: string;
}

export interface OnboardingData {
  flow: 'portal' | 'api';
  portalData?: PortalOnboardingData;
  apiData?: ApiOnboardingData;
  lastUpdated?: number;
}

function getStorageKey(flow: 'portal' | 'api'): string {
  return `${STORAGE_KEY}_${flow}`;
}

export function saveOnboardingData(
  flow: 'portal' | 'api',
  data: PortalOnboardingData | ApiOnboardingData
): void {
  if (typeof window === 'undefined') return;

  const key = getStorageKey(flow);
  const current = getOnboardingData(flow);
  const updated = {
    ...current,
    ...data,
    lastUpdated: Date.now(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save onboarding data:', error);
  }
}

export function getOnboardingData(
  flow: 'portal' | 'api'
): PortalOnboardingData | ApiOnboardingData {
  if (typeof window === 'undefined') return {};

  const key = getStorageKey(flow);
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to read onboarding data:', error);
    return {};
  }
}

export function clearOnboardingData(flow: 'portal' | 'api'): void {
  if (typeof window === 'undefined') return;

  const key = getStorageKey(flow);
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear onboarding data:', error);
  }
}

export function getStepData(
  flow: 'portal' | 'api',
  step: string
): Record<string, any> {
  const data = getOnboardingData(flow);
  const flowData = flow === 'portal' ? data : data;
  return flowData || {};
}

export function saveStepData(
  flow: 'portal' | 'api',
  step: string,
  stepData: Record<string, any>
): void {
  const current = getOnboardingData(flow);
  const updated = {
    ...current,
    ...stepData,
    lastUpdated: Date.now(),
  };
  saveOnboardingData(flow, updated);
}
