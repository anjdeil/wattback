import CalculatorComponent from "../components/CalculatorComponent/CalculatorComponent";
import './style.scss';

const CalculatorPage = () => {
    return (
        <div className="calculator container">
            <div className="calculator__block calculator__block--top">
                <h1>Solar power plant calculator – cost and benefit calculation.</h1>
                <p>How much does a solar system cost? When will it pay off? Our calculator will answer these questions and show you how to invest in energy independence with maximum benefit!</p>
            </div>
            <div className="calculator__container">
                <CalculatorComponent />
            </div>
            <div className="calculator__block calculator__block--bottom">
                <div>
                    <h3>Installing a solar system is not just savings, but also your income, freedom from rising prices, and a stable future. Your investment will pay off, turning solar energy into steady profit!</h3>
                    <p>Submit your application now and receive a personalized discount!</p>
                </div>
                <button className="button calculator__button">Submit an application</button>
            </div>
        </div>
    );
};

export default CalculatorPage;
