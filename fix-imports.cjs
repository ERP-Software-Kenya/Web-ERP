const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(fullPath, content);
}

// 1. App.tsx
replaceInFile('src/App.tsx', [
    ["import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';", "import { OnboardingProvider, useOnboarding } from './features/onboarding/context/OnboardingContext';"],
    ["import LandingPage from './pages/LandingPage';", "import LandingPage from './features/marketing/pages/LandingPage';"],
    ["import SSOCallback from './pages/SSOCallback';", "import SSOCallback from './features/auth/pages/SSOCallback';"],
    ["import Step1Account from './steps/Step1Account';", "import Step1Account from './features/onboarding/steps/Step1Account';"],
    ["import Step2OrgSetup from './steps/Step2OrgSetup';", "import Step2OrgSetup from './features/onboarding/steps/Step2OrgSetup';"],
    ["import Step3BusinessType from './steps/Step3BusinessType';", "import Step3BusinessType from './features/onboarding/steps/Step3BusinessType';"],
    ["import Step4TeamSize from './steps/Step4TeamSize';", "import Step4TeamSize from './features/onboarding/steps/Step4TeamSize';"],
    ["import Step5Modules from './steps/Step5Modules';", "import Step5Modules from './features/onboarding/steps/Step5Modules';"],
    ["import Step6HowYouSell from './steps/Step6HowYouSell';", "import Step6HowYouSell from './features/onboarding/steps/Step6HowYouSell';"],
    ["import Step7Pricing from './steps/Step7Pricing';", "import Step7Pricing from './features/onboarding/steps/Step7Pricing';"],
    ["import Step8Done from './steps/Step8Done';", "import Step8Done from './features/onboarding/steps/Step8Done';"],
    ["import { ThemeProvider } from './context/ThemeContext';", "import { ThemeProvider } from './features/theme/context/ThemeContext';"]
]);

// 2. SSOCallback.tsx
replaceInFile('src/features/auth/pages/SSOCallback.tsx', [
    ["from '../../context/OnboardingContext'", "from '../../onboarding/context/OnboardingContext'"]
]);

// 3. MarketingHeader.tsx
replaceInFile('src/features/marketing/components/MarketingHeader.tsx', [
    ["from '../ui/ThemeToggle'", "from '../../theme/components/ThemeToggle'"]
]);

// 4. LandingPage.tsx
replaceInFile('src/features/marketing/pages/LandingPage.tsx', [
    ["from '../components/layout/MarketingHeader'", "from '../components/MarketingHeader'"],
    ["from '../components/layout/MarketingFooter'", "from '../components/MarketingFooter'"],
    ["from '../context/OnboardingContext'", "from '../../onboarding/context/OnboardingContext'"]
]);

// 5. StepLayout.tsx
replaceInFile('src/features/onboarding/components/StepLayout.tsx', [
    ["from '../ProgressBar'", "from './ProgressBar'"],
    ["from '../../preview/ERPDashboardPreview'", "from '../../preview/components/ERPDashboardPreview'"],
    ["from '../ui/ThemeToggle'", "from '../../theme/components/ThemeToggle'"],
    ["from '../../context/OnboardingContext'", "from '../context/OnboardingContext'"]
]);

// 6. OnboardingContext.tsx
replaceInFile('src/features/onboarding/context/OnboardingContext.tsx', [
    ["from '../types'", "from '../../../types'"],
    ["setDataState(prev =>", "setDataState((prev: OnboardingData) =>"]
]);

// 7. Steps (1 to 8)
const steps = [
    'Step1Account.tsx', 'Step2OrgSetup.tsx', 'Step3BusinessType.tsx',
    'Step4TeamSize.tsx', 'Step5Modules.tsx', 'Step6HowYouSell.tsx',
    'Step7Pricing.tsx', 'Step8Done.tsx'
];

for (const step of steps) {
    replaceInFile(`src/features/onboarding/steps/${step}`, [
        ["from '../components/layout/StepLayout'", "from '../components/StepLayout'"],
        ["from '../components/ui/Input'", "from '../../../components/ui/Input'"],
        ["from '../components/ui/Select'", "from '../../../components/ui/Select'"],
        ["from '../types'", "from '../../../types'"],
        ["onChange={e =>", "onChange={(e: any) =>"],
        ["onKeyDown={e =>", "onKeyDown={(e: any) =>"],
        ["modules.map(m =>", "modules.map((m: any) =>"]
    ]);
}

// 8. Step7Pricing (Specific)
replaceInFile('src/features/onboarding/steps/Step7Pricing.tsx', [
    ["from '../components/ui/ThemeToggle'", "from '../../theme/components/ThemeToggle'"]
]);

// 9. ThemeToggle.tsx
replaceInFile('src/features/theme/components/ThemeToggle.tsx', [
    ["from '../../context/ThemeContext'", "from '../context/ThemeContext'"]
]);

console.log("Imports updated successfully!");
