export const fetchCalculatorSettings = async () => {
    const response = await fetch('https://dodgerblue-sparrow-988860.hostingersite.com/wp-json/v1/calculator-settings');

    if (response.ok) {
        return await response.json();
    } else {
        console.error('Failed to fetch settings');
        throw new Error('Failed to fetch settings: ' + response.statusText);
    }
};
