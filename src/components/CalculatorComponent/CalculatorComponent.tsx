import { ChangeEvent, FC, useCallback, useEffect, useReducer, useState } from 'react';
import { fetchCalculatorSettings } from '../../api/api';
import { CalculatorSettings } from '../../types/types';
import { calculateCost, calculateSavings, getPhaseData } from '../../utils/calculatorUtils';
import CalculatorSavingBlock from '../global/CalculatorSavingBlock/CalculatorSavingBlock';
import CustomRadio from '../global/CustomRadio/CustomRadio';
import './style.scss';

const phaseOptions = [
  { label: '1-Ph (single-phase)', value: 'phase_1' },
  { label: '3-Ph (three-phase)', value: 'phase_3' }
];

const typeOptions = [
  { label: 'Tiled roof', value: 'tiled' },
  { label: 'Flat roof', value: 'flat' },
  { label: 'On the ground', value: 'ground' },
];

const initialState = {
  totalPower: '',
  annualOutput: '',
  payback: '',
  paybackWithSubsidy: '',
  economy10: '',
  economy20: '',
  totalCost: ''
};

type State = typeof initialState;
type Action = { type: keyof State; value: string };

const reducer = (state: State, action: Action): State => ({
  ...state,
  [action.type]: action.value
});

const CalculatorComponent: FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [phase, setPhase] = useState(phaseOptions[0].value);
  const [type, setType] = useState(typeOptions[0].value);  
  const [calculatorSettings, setCalculatorSettings] = useState<CalculatorSettings | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchData = async () => {
    try {
      const settings = await fetchCalculatorSettings();
      setCalculatorSettings(settings);
    } catch (error) {
      console.error("Error fetching calculator settings:", error);
      setError("Failed to load calculator settings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  }, []);
    
  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (amount) calculate();
    }

  const calculate = useCallback(() => {
    if (amount !== null && calculatorSettings) {
      const phaseData = calculatorSettings[phase as keyof CalculatorSettings];

      if (!Array.isArray(phaseData)) return;

      const { number, price } = getPhaseData(phaseData, amount);
      const totalPower = ((+number * +calculatorSettings.panel_power) / 1000).toFixed(2);
      const annualOutput = ((+number * +calculatorSettings.hours_per_year * +calculatorSettings.panel_power) / 1000).toFixed(0);
      const economy = +annualOutput * +calculatorSettings.cost_per_kwh;
      const totalCost = calculateCost(number, price, type, calculatorSettings).toFixed(0);
      const { payback, paybackWithSubsidy, economy10, economy20 } = calculateSavings(economy, totalCost, calculatorSettings.subsidy);

      dispatch({ type: 'totalPower', value: totalPower });
      dispatch({ type: 'annualOutput', value: annualOutput });
      dispatch({ type: 'payback', value: payback });
      dispatch({ type: 'paybackWithSubsidy', value: paybackWithSubsidy });
      dispatch({ type: 'economy10', value: economy10 });
      dispatch({ type: 'economy20', value: economy20 });
      dispatch({ type: 'totalCost', value: totalCost });
    }
  }, [amount, calculatorSettings, phase, type]);

  useEffect(() => {
    if (amount !== undefined) {
      calculate();
    }
  }, [amount, calculate]);

  return (
    <div className="calculatorComponent">  
      <div className="calculatorComponent__container">
        <div className="calculatorComponent__top">
          <div className="calculatorComponent__block calculatorComponent__block--left">
            <div className="calculatorComponent__titleBlock">
              <h3>Outcome calculator simulator</h3>
              {error && <h4 className="calculatorComponent__error">{error}</h4>}
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In imperdiet pretium risus ut.</p>
            </div>
            <div className="calculatorComponent__innerBlock">
              <div className="calculatorComponent__formBlock">
                <h3>Specify the average cost per invoice from EAC.</h3>
                <label className="calculatorComponent__label">
                  <p>For accurate calculations, use the average amount from the last six invoices/€</p>
                  <input
                    type="number"
                    name="amount"
                    value={amount ?? ''}
                    onChange={e => {
                      const value = e.target.value;
                      setAmount(value ? +value : 0);
                    }}
                    className="calculatorComponent__input"
                    required
                    disabled={Boolean(error) || loading}
                  />
                </label>
              </div>
              <div className="calculatorComponent__formBlock">
                <h3>Select the number of phases in your network as indicated on the invoice</h3>
                <div className="calculatorComponent__radioBlock">
                  {phaseOptions.map(({ label, value }) => (
                    <CustomRadio
                      key={label}
                      label={label}
                      name="phase"
                      value={value}
                      checked={phase === value}
                      change={handleChange(setPhase)}
                      disabled={Boolean(error) || loading}
                    />
                  ))}                
                </div>
              </div>
              <div className="calculatorComponent__formBlock">
                <h3>Specify the installation type</h3>
                <p>Select where the panels will be installed</p>
                <div className="calculatorComponent__radioBlock">
                  {typeOptions.map(({ label, value }) => (
                    <CustomRadio
                      key={label}
                      label={label}
                      name="type"
                      value={value}
                      checked={type === value}
                      change={handleChange(setType)}
                      disabled={Boolean(error) || loading}
                    />
                  ))}                
                </div>
              </div>            
            </div>
          </div>
          <div className="calculatorComponent__block calculatorComponent__block--right">
            <h3>Totals</h3>
            <CalculatorSavingBlock
              title="Total system power:"
              text="Optimal solar system power for your consumption."
              value={state.totalPower}
              unit="kW"
              left={true}
            />
            <CalculatorSavingBlock
              title="Expected annual output"
              text="The total amount of electricity the system will produce in a year."
              value={state.annualOutput}
              unit="kWh"
              left={true}
            />
            <CalculatorSavingBlock
              title="Payback period of the system."
              text="The period of time in which your system will fully pay for itself through saved costs."
              value={state.payback}
              unit="year"
              left={true}
            />
            <CalculatorSavingBlock
              title="Payback period (with subsidy consideration)."
              text="Payback period taking into account the government subsidy."
              value={state.paybackWithSubsidy}
              unit="year"
              left={true}
            />
          </div>
        </div>
        <div className="calculatorComponent__bottom">        
          <CalculatorSavingBlock
            title="Savings over 10 years"
            text="The total amount of savings over 10 years of operation. (Savings = your income from using solar energy.)"
            value={state.economy10}
            unit="€"
          />        
          <CalculatorSavingBlock
            title="Savings over 20 years"
            text="Your savings and income over 20 years of the system's operation."
            value={state.economy20}
            unit="€"
          />
          <CalculatorSavingBlock
            title="Total cost"
            text="The total amount, including all costs for equipment, installation, documentation, and taxes."
            value={state.totalCost}
            unit="€"
            vat={true}
            total={true}
          />
        </div>
      </div>
    </div>
  )
}

export default CalculatorComponent;  