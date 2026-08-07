export type BusinessType = 'Retail' | 'Wholesale' | 'Manufacturing' | 'Services' | 'E-commerce' | 'Other' | '';
export type TeamSize = 'Just me' | '2–10' | '11–50' | '51–200' | '200+' | '';
export type SalesMethod = 'In-store / POS' | 'Online' | 'Both (In-store + Online)' | 'B2B Sales' | '';

export interface OnboardingData {
  // Step 1 — Account
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  // Step 2 — Org
  orgName: string;
  industry: string;
  country: string;

  // Step 3 — Business type
  businessType: BusinessType;

  // Step 4 — Team size
  teamSize: TeamSize;

  // Step 5 — Modules
  modules: string[];

  // Step 6 — Sales method
  salesMethod: SalesMethod;

  // Step 7 — Plan
  plan: 'starter' | 'growth' | 'enterprise' | '';
  billing: 'monthly' | 'annual';
}

export interface Plan {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  desc: string;
  monthlyPrice: number;
  annualPrice: number;
  featured: boolean;
  features: { text: string; included: boolean }[];
  btnLabel: string;
  btnStyle: 'outline' | 'solid' | 'primary';
}
