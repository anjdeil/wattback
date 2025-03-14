export type PhaseData = {
    monthly_consumption_cost_from: string;
    annual_consumption_wh_from: string;
    number: string;
    price: string;
}

export type CalculatorSettings = {
    panel_power: string;
    cost_per_kwh: string;
    hours_per_year: string;
    subsidy: string;
    add_pay_for_flat: string;
    add_pay_for_ground: string;
    phase_1: PhaseData[];
    phase_3: PhaseData[];
}
