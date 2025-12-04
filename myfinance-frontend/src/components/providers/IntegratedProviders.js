import React from 'react';
import { TransactionProvider } from '../../context/TransactionContext';
import { CategoryProvider } from '../../context/CategoryContext';
import { BudgetProvider, useBudget } from '../../context/BudgetContext';
import { PreferencesProvider } from '../../context/PreferencesContext';

// Wrapper that provides TransactionProvider with budget refresh callback
const TransactionProviderWithBudgetIntegration = ({ children }) => {
    const { refreshAllBudgetData } = useBudget();

    return (
        <TransactionProvider onBudgetRefreshNeeded={refreshAllBudgetData}>
            {children}
        </TransactionProvider>
    );
};

// Combined providers component that properly integrates budget and transaction contexts
const IntegratedProviders = ({ children }) => {
    return (
        <PreferencesProvider>
            <CategoryProvider>
                <BudgetProvider>
                    <TransactionProviderWithBudgetIntegration>
                        {children}
                    </TransactionProviderWithBudgetIntegration>
                </BudgetProvider>
            </CategoryProvider>
        </PreferencesProvider>
    );
};

export default IntegratedProviders;