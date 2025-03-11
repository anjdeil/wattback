import { ChangeEvent, FC, useState } from 'react';
import CalculatorSavingBlock from '../global/CalculatorSavingBlock/CalculatorSavingBlock';
import CustomRadio from '../global/CustomRadio/CustomRadio';
import './style.scss';

const phaseOptions = ['1-Ph (single-phase)', '3-Ph (three-phase)'];
const typeOptions = ['Tiled roof', 'Flat roof', 'On the ground'];

const CalculatorComponent: FC = () => {
  const [amount, setAmount] = useState<number | undefined>();
  const [phase, setPhase] = useState(phaseOptions[0]);
  const [type, settype] = useState(typeOptions[0]);

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  }

  const handleChangePhase = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhase(e.target.value);
  };

  const handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    settype(e.target.value);
  };

  const calculate = () => {
    console.log('Calculattion...');
  }

  return (
    <div className="calculatorComponent">
      <div className="calculatorComponent__top">
        <div className="calculatorComponent__block calculatorComponent__block--left">
          <div className="calculatorComponent__titleBlock">
            <h3>Outcome calculator simulator</h3>
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
                  value={amount}
                  onChange={handleChangeAmount}
                  className="calculatorComponent__input"
                  required
                />
              </label>
            </div>
            <div className="calculatorComponent__formBlock">
              <h3>Select the number of phases in your network as indicated on the invoice</h3>
              <div className="calculatorComponent__radioBlock">
                {phaseOptions.map((option) => (
                  <CustomRadio
                    key={option}
                    label={option}
                    name="phase"
                    value={option}
                    checked={phase === option}
                    change={handleChangePhase}
                  />
                ))}                
              </div>
            </div>
            <div className="calculatorComponent__formBlock">
              <h3>Specify the installation type</h3>
              <p>Select where the panels will be installed</p>
              <div className="calculatorComponent__radioBlock">
                {typeOptions.map((option) => (
                  <CustomRadio
                    key={option}
                    label={option}
                    name="type"
                    value={option}
                    checked={type === option}
                    change={handleChangeType}
                  />
                ))}                
              </div>
            </div>
            <div className="calculatorComponent__label calculatorComponent__label--bottom">
              <p>Click "Calculate" to see the suitable system and your savings. It's that simple!</p>
              <button className="button calculatorComponent__button" onClick={calculate}>Calculate</button>
            </div>
          </div>
        </div>
        <div className="calculatorComponent__block calculatorComponent__block--right">
          <h2>Totals</h2>
          <CalculatorSavingBlock
            title="Total system power:"
            text="Optimal solar system power for your consumption."
            value={3.96}
            unit="kW"
            left={true}
          />
          <CalculatorSavingBlock
            title="Expected annual output"
            text="The total amount of electricity the system will produce in a year."
            value={6336}
            unit="kWh"
            left={true}
          />
          <CalculatorSavingBlock
            title="Payback period of the system."
            text="The period of time in which your system will fully pay for itself through saved costs."
            value={2.9}
            unit="€"
            left={true}
          />
          <CalculatorSavingBlock
            title="Payback period (with subsidy consideration)."
            text="Payback period taking into account the government subsidy."
            value={2.1}
            unit="€"
            left={true}
          />
        </div>
      </div>
      <div className="calculatorComponent__bottom">        
        <CalculatorSavingBlock
          title="Savings over 10 years"
          text="The total amount of savings over 10 years of operation. (Savings = your income from using solar energy.)"
          value={15008}
          unit="€"
        />        
        <CalculatorSavingBlock
          title="Savings over 20 years"
          text="Your savings and income over 20 years of the system's operation."
          value={34016}
          unit="€"
        />        
        <CalculatorSavingBlock
          title="Total cost"
          text="The total amount, including all costs for equipment, installation, documentation, and taxes."
          value={5770}
          unit="€"
          vat={true}
        />
      </div>
    </div>
  )
}

export default CalculatorComponent;  