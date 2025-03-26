import { ChangeEvent, FC, useCallback, useEffect, useReducer, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchCalculatorSettings } from '../../api/api';
import translations from '../../translation/translation';
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
  const [max, setMax] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { pathname } = useLocation(); 
  const lang = pathname.split("/")[1];

  const t = translations[lang] || translations["en"];

  useEffect(() => {
      const fetchData = async () => {
    try {
      const settings = await fetchCalculatorSettings();
      setCalculatorSettings(settings);
    } catch (error) {
      console.error("Error fetching calculator settings:", error);
      setError(t.error);
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

      const { phaseValue, max } = getPhaseData(phaseData, amount);
      const totalPower = ((+phaseValue.number * +calculatorSettings.panel_power) / 1000).toFixed(2);
      const annualOutput = ((+phaseValue.number * +calculatorSettings.hours_per_year * +calculatorSettings.panel_power) / 1000).toFixed(0);
      const economy = +annualOutput * +calculatorSettings.cost_per_kwh;
      const totalCost = calculateCost(phaseValue.number, phaseValue.price, type, calculatorSettings).toFixed(0);
      const { payback, paybackWithSubsidy, economy10, economy20 } = calculateSavings(economy, totalCost, calculatorSettings.subsidy);
      setMax(max);
      
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
              <h3>{t.title}</h3>
              {error && <h4 className="calculatorComponent__error">{error}</h4>}
              <p>{t.subtitle}</p>
            </div>
            <div className="calculatorComponent__innerBlock">
              <div className="calculatorComponent__formBlock">
                <h3>{t.invoiceLabel}</h3>
                <label className="calculatorComponent__label">
                  <p>{t.invoiceText}</p>
                  <input
                    type="number"
                    name="amount"
                    value={amount ?? ''}
                    onChange={e => {
                      const value = e.target.value;
                      const parsedValue = value === '' ? NaN : +value;
                      setAmount(parsedValue);
                    }}
                    onFocus={() => {
                      if (amount === 0) setAmount(NaN);
                    }}
                      onBlur={() => {
                        if (isNaN(amount)) setAmount(0);
                    }}
                    className="calculatorComponent__input"
                    required
                    disabled={Boolean(error) || loading}
                  />
                </label>
              </div>
              <div className="calculatorComponent__formBlock">
                <h3>{t.phaseLabel}</h3>
                <div className="calculatorComponent__radioBlock">
                  {phaseOptions.map(({ value }) => (
                    <CustomRadio
                      key={value}
                      label={t[value]}
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
                <h3>{t.roofLabel}</h3>
                <p>{t.roofText}</p>
                <div className="calculatorComponent__radioBlock">
                  {typeOptions.map(({ value }) => (
                    <CustomRadio
                      key={value}
                      label={t[value]}
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
            <h3>{t.totals}</h3>
            <CalculatorSavingBlock
              title={t.totalPower}
              text={t.totalPowerText}
              value={state.totalPower}
              unit="kW"
              left={true}
              max={max}
              maxTitle={t[`${phase}Max`]}
            />
            <CalculatorSavingBlock
              title={t.annualOutput}
              text={t.annualOutputText}
              value={state.annualOutput}
              unit="kWh"
              left={true}
            />
            <CalculatorSavingBlock
              title={t.payback}
              text={t.paybackText}
              value={state.payback}
              unit="year"
              left={true}
            />
            <CalculatorSavingBlock
              title={t.paybackWithSubsidy}
              text={t.paybackWithSubsidyText}
              value={state.paybackWithSubsidy}
              unit="year"
              left={true}
            />
          </div>
        </div>
        <div className="calculatorComponent__bottom">        
          <CalculatorSavingBlock
            title={t.savings10}
            text={t.savings10Text}
            value={state.economy10}
            unit="€"
          />        
          <CalculatorSavingBlock
            title={t.savings20}
            text={t.savings20Text}
            value={state.economy20}
            unit="€"
          />
          <CalculatorSavingBlock
            title={t.totalCost}
            text={t.totalCostText}
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