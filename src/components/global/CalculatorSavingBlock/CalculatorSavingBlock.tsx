import { FC } from "react";
import './style.scss';

type CalculatorSavingBlockType = {
    title: string;
    text: string;
    value: number;
    unit: string;
    vat?: boolean;
    left?: boolean;
}

const CalculatorSavingBlock: FC<CalculatorSavingBlockType> = ({ title, text, value, unit, vat = false, left = false}) => {
    const blockClass = `calculatorSavingBlock__block ${left ? 'calculatorSavingBlock__block--left' : ''}`;
    const mainClass = `calculatorSavingBlock ${left ? 'calculatorSavingBlock--left' : ''}`;
    const infoClass = `calculatorSavingBlock__info ${left ? 'calculatorSavingBlock__info--left' : ''}`;
   
    return (
        <div className={mainClass}>
            <h4>{title}</h4>
            <div className={blockClass}>
                <p>{text}</p>
                <span className={infoClass}>{`${value}${unit}${vat ? '(VAT included)' : ''}`}</span>
            </div>
        </div>
    )
}

export default CalculatorSavingBlock;