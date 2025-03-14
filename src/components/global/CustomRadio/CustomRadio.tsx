import { FC } from "react";
import './style.scss';

type CustomRadioType = {
    label: string;
    name: string;
    value: string;
    checked: boolean;
    change: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}

const CustomRadio: FC<CustomRadioType> = ({ label, name, value, checked, change, disabled = false }) => {
    return (
        <label className="customRadio">                  
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={change}
                className="customRadio__radio"
                aria-hidden={true}
                disabled={disabled}
            />
            <span className="customRadio__circle"></span>
            <span>{label}</span>            
        </label>
    )
}

export default CustomRadio;