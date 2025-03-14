import { CalculatorSettings, PhaseData } from "../types/types";

export const getPhaseData = (phaseData: PhaseData[], inputAmount: number): PhaseData =>
    phaseData.find(({ monthly_consumption_cost_from }, i, arr) =>
        inputAmount >= +monthly_consumption_cost_from &&
        (!arr[i + 1] || inputAmount < +arr[i + 1].monthly_consumption_cost_from)
    ) || phaseData[0];

export const calculateCost = (number: string, price: string, type: string, calculatorSettings: CalculatorSettings) => {
    switch (type) {
        case 'flat':
            return (+number * +calculatorSettings.add_pay_for_flat) + +price;
        case 'ground':
            return (+number * +calculatorSettings.add_pay_for_ground) + +price;
        default:
            return +price;
    }
};

export const calculateSavings = (economy: number, price: string, subsidy: string) => ({
    payback: (+price / economy).toFixed(1),
    paybackWithSubsidy: ((+price - +subsidy) / economy).toFixed(1),
    economy10: (economy * 10 - +price + +subsidy).toFixed(0),
    economy20: (economy * 20 - +price + +subsidy).toFixed(0)
});
