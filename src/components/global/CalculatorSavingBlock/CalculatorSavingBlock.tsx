import { FC } from "react";
import './style.scss';

type CalculatorSavingBlockType = {
    title: string;
    text: string;
    value: string | undefined;
    unit: string;
    vat?: boolean;
    left?: boolean;
    total?: boolean;
}

const CalculatorSavingBlock: FC<CalculatorSavingBlockType> = ({ title, text, value, unit, vat = false, left = false, total = false}) => {
    const blockClass = `calculatorSavingBlock__block ${left ? 'calculatorSavingBlock__block--left' : ''}`;
    const mainClass = `calculatorSavingBlock ${left ? 'calculatorSavingBlock--left' : ''}`;
    const infoClass = `calculatorSavingBlock__info ${left ? 'calculatorSavingBlock__info--left' : ''}`;
    const totalClass = `calculatorSavingBlock__total ${total ? 'calculatorSavingBlock__total--border' : ''}`;
   
    const infoContent = value ? (
        <span className={infoClass}>
            {`${value} ${unit}${vat ? ' (VAT included)' : ''}`}
        </span>
    ) : (
        <div className={`${infoClass} skeleton-wave`} /> 
    );

    return (
        <div className={totalClass}>
            <div className={mainClass}>
                <h4>{title}</h4>
                <div className={blockClass}>
                    <p>{text}</p>
                    {infoContent}
                </div>
            </div>
        </div>
    )
}

export default CalculatorSavingBlock;