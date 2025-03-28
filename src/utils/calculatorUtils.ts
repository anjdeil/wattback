import { CalculatorSettings, PhaseData } from "../types/types";

export const getPhaseData = (
    phaseData: PhaseData[],
    inputAmount: number
): { phaseValue: PhaseData; max: boolean } => {
    const reversedData = [...phaseData].reverse();
    const foundPhase = reversedData.find(({ monthly_consumption_cost_from }) => inputAmount > +monthly_consumption_cost_from) || phaseData[0];

    return {
        phaseValue: foundPhase,
        max: foundPhase === reversedData[0] && inputAmount > +reversedData[0].monthly_consumption_cost_from
    };
};

export const calculateCost = (number: string, price: string, type: string, calculatorSettings: CalculatorSettings) => {
    let cost;

    switch (type) {
        case 'flat':
            cost = (+number * +calculatorSettings.add_pay_for_flat) + +price;
            break;
        case 'ground':
            cost = (+number * +calculatorSettings.add_pay_for_ground + +calculatorSettings.add_pay_for_ground) + +price;
            break;
        default:
            cost = +price;
    }

    return cost / 1.19;
};

export const calculateSavings = (economy: number, price: string, subsidy: string) => ({
    payback: (+price / economy).toFixed(1),
    paybackWithSubsidy: ((+price - +subsidy) / economy).toFixed(1),
    economy10: (economy * 10 - +price + +subsidy).toFixed(0),
    economy20: (economy * 20 - +price + +subsidy).toFixed(0)
});
