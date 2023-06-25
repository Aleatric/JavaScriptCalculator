document.addEventListener("DOMContentLoaded", function () {
    const display = document.getElementById("display");
    const clearBtn = document.getElementById("clear");
    const decimalBtn = document.getElementById("decimal");
    const equalsBtn = document.getElementById("equals");
    const numberBtns = Array.from(document.querySelectorAll("#calculator button")).filter(btn => 
        btn.id !== 'clear' && btn.id !== 'decimal' && btn.id !== 'add' && btn.id !== 'subtract' && btn.id !== 'multiply' && btn.id !== 'divide' && btn.id !== 'equals'
    );
    const operatorBtns = Array.from(document.querySelectorAll("#calculator button")).filter(btn => 
        btn.id === 'add' || btn.id === 'subtract' || btn.id === 'multiply' || btn.id === 'divide'
    );

    let currentValue = "";
    let currentOperator = "";
    let previousValue = "";
    let shouldResetDisplay = false;

    const keyMappings = {
        "48": "zero",
        "49": "one",
        "50": "two",
        "51": "three",
        "52": "four",
        "53": "five",
        "54": "six",
        "55": "seven",
        "56": "eight",
        "57": "nine",
        "190": "decimal",
        "67": "clear",
        "191": "divide",
        "88": "multiply",
        "189": "subtract",
        "187": "add",
        "13": "equals"
    };

    function updateDisplay(value) {
        const valueWithCommas = parseFloat(value).toLocaleString();
        display.textContent = valueWithCommas;
    }

    function clearCalculator() {
        const currentlyPressedOperatorBtn = document.querySelector('.operator.pressed');
        if (currentlyPressedOperatorBtn) {
            currentlyPressedOperatorBtn.classList.remove('pressed');
        }
        currentValue = "";
        currentOperator = "";
        previousValue = "";
        updateDisplay("0");
    }

    function handleNumberClick(e) {
        const currentlyPressedOperatorBtn = document.querySelector('.operator.pressed');
        if (currentlyPressedOperatorBtn) {
            currentlyPressedOperatorBtn.classList.remove('pressed');
        }
        const digit = e.target.textContent;

        if (currentValue.replace(/,/g, '').length >= 13) return;

        if (currentValue === "0" && digit === "0") {
            return;
        }

        if (digit === "." && currentValue.includes(".")) {
            return;
        }

        if (shouldResetDisplay) {
            currentValue = "";
            shouldResetDisplay = false;
        }

        currentValue += digit;
        updateDisplay(currentValue);
    }

    function handleOperatorClick(e) {
        const currentlyPressedOperatorBtn = document.querySelector('.operator.pressed');
        if (currentlyPressedOperatorBtn) {
            currentlyPressedOperatorBtn.classList.remove('pressed');
        }
        e.target.classList.add('pressed');
    
        if (currentOperator !== "" && previousValue !== "" && currentValue !== "") {
            performOperation();
            previousValue = currentValue;
            currentValue = "";
        } else if (currentOperator === "" && previousValue === "" && currentValue !== "") {
            previousValue = currentValue;
            currentValue = "";
        }
    
        currentOperator = e.target.id;
        shouldResetDisplay = true;
    }

    function handleEqualsClick() {
        if (currentOperator !== "" && previousValue !== "" && currentValue !== "") {
            performOperation();
            currentOperator = "";
            previousValue = "";
        }
    }

    function performOperation() {
        const previous = parseFloat(previousValue);
        const current = parseFloat(currentValue);
    
        if (isNaN(previous) || isNaN(current)) {
            return;
        }
    
        let result;
        switch (currentOperator) {
            case "add":
                result = previous + current;
                break;
            case "subtract":
                result = previous - current;
                break;
            case "multiply":
                result = previous * current;
                break;
            case "divide":
                if (current === 0) {
                    result = "Error";
                } else {
                    result = previous / current;
                }
                break;
            default:
                return;
        }
    
        if (typeof result === "number") {
            result = result.toFixed(4);
        }
    
        currentValue = result.toString();
        updateDisplay(currentValue);
        shouldResetDisplay = true;
    }

    function handleKeyPress(e) {
        const key = e.keyCode.toString();
        const buttonId = keyMappings[key];

        if (buttonId) {
            if (buttonId === "clear") {
                clearCalculator();
            } else if (buttonId === "equals") {
                handleEqualsClick();
            } else if (buttonId === "decimal") {
                handleNumberClick({target: document.getElementById(buttonId)});
            } else if (["add", "subtract", "multiply", "divide"].includes(buttonId)) {
                handleOperatorClick({target: document.getElementById(buttonId)});
            } else {
                handleNumberClick({target: document.getElementById(buttonId)});
            }
        }
    }

    clearBtn.addEventListener("click", clearCalculator);
    decimalBtn.addEventListener("click", handleNumberClick);
    equalsBtn.addEventListener("click", handleEqualsClick);

    numberBtns.forEach(function (btn) {
        btn.addEventListener("click", handleNumberClick);
    });

    operatorBtns.forEach(function (btn) {
        btn.addEventListener("click", handleOperatorClick);
    });

    document.addEventListener("keydown", handleKeyPress);
});