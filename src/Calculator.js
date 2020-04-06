import React from 'react';

const statesConst = {
    initial: 0,
    number: 1,
    operator: 2,
    negativeOperand: 3,
    evaluated: 4
};

function isLastSign(str) {
    return str.endsWith('+') || str.endsWith('-') || str.endsWith('*') || str.endsWith('/');
}

const buttons = [
    {buttonId: "clear", name: "AC"},
    {buttonId: "divide", name: "/"},
    {buttonId: "seven", name: "7"},
    {buttonId: "eight", name: "8"},
    {buttonId: "nine", name: "9"},
    {buttonId: "multiply", name: "*"},
    {buttonId: "four", name: "4"},
    {buttonId: "five", name: "5"},
    {buttonId: "six", name: "6"},
    {buttonId: "subtract", name: "-"},
    {buttonId: "one", name: "1"},
    {buttonId: "two", name: "2"},
    {buttonId: "three", name: "3"},
    {buttonId: "add", name: "+"},
    {buttonId: "zero", name: "0"},
    {buttonId: "decimal", name: "."},
    {buttonId: "equals", name: "="}];

function FormulaValue(props) {
    return <div id="formula">{props.formula}</div>;
}

function OutputValue(props) {
    return <div id="display">{props.output}</div>;
}

function Clickable(props) {
    return (<button className="clickable" id={props.buttonId} onClick={props.onClick}>{props.name}</button>);
}

function Display(props) {
    return <div id="tablo">
        <FormulaValue formula={props.formula}/>
        <OutputValue output={props.output}/>
    </div>;
}

export default class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            output: "0",
            formula: "",
            calculatorState: statesConst.initial,
            decimalOperandFlag: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        let buttonItem = buttons.find((item) => {
            if (item.buttonId === event.target.id) {
                return true;
            }
        });
        /* handle only button click event*/
        let calculatorState = this.state.calculatorState;
        let output = this.state.output;
        let formula = this.state.formula;
        let decimalOperandFlag = this.state.decimalOperandFlag;
        if (undefined !== buttonItem) {
            switch (event.target.id) {
                case "clear":
                    output = "0";
                    formula = "";
                    calculatorState = statesConst.initial;
                    decimalOperandFlag = false;
                    break;
                case "equals":
                    if (this.state.calculatorState === statesConst.evaluated) {
                        break;
                    }
                    output = Math.round(eval(this.state.formula) * 10000) / 10000;
                    formula = this.state.formula + buttonItem.name + output;
                    calculatorState = statesConst.evaluated;
                    break;
                case "decimal":
                    if (this.state.calculatorState === statesConst.evaluated) {
                        break;
                    }
                    calculatorState = statesConst.number;
                    decimalOperandFlag = true;
                    if (!this.state.decimalOperandFlag) {
                        switch (this.state.calculatorState) {
                            case statesConst.initial:
                            case statesConst.operator:
                            case statesConst.negativeOperand:
                                formula = this.state.formula + '0.';
                                output = '0.';
                                break;
                            case statesConst.number:
                                formula = this.state.formula + '.';
                                output = this.state.output + '.';
                                break;
                        }
                    }
                    break;
                case "add":
                case "multiply":
                case "divide":
                    calculatorState = statesConst.operator;
                    decimalOperandFlag = false;
                    if (this.state.calculatorState === statesConst.evaluated) {
                        formula = this.state.output + buttonItem.name;
                        break;
                    }
                    if (this.state.calculatorState === statesConst.initial) {
                        formula = '0';
                    } else if (this.state.calculatorState === statesConst.operator || statesConst.negativeOperand === this.state.calculatorState) {
                        formula = this.state.formula.slice(0, -1);
                        console.log(formula);
                        if (isLastSign(formula)) {
                            formula = formula.slice(0, -1);
                            console.log(formula);
                        }
                        formula += buttonItem.name;
                        break;
                    }
                    formula = this.state.formula + buttonItem.name;
                    break;
                case "subtract":
                    decimalOperandFlag = false;
                    calculatorState = statesConst.negativeOperand;
                    if (this.state.calculatorState === statesConst.evaluated) {
                        formula = this.state.output + buttonItem.name;
                        break;
                    }
                    if (this.state.calculatorState === statesConst.initial) {
                        formula = '0';
                    } else if (this.state.calculatorState === statesConst.negativeOperand) {
                        formula = this.state.formula(0, -1) + buttonItem.name;
                        break;
                    }
                    formula = this.state.formula + buttonItem.name;
                    break;
                default:
                    if (this.state.calculatorState === statesConst.evaluated) {
                        break;
                    }
                    calculatorState = statesConst.number;
                    switch (this.state.calculatorState) {
                        case statesConst.initial:
                            output = buttonItem.name;
                            formula = buttonItem.name;
                            break;
                        case statesConst.number:
                            if (this.state.output !== '0') {
                                output = this.state.output + buttonItem.name;
                                formula = this.state.formula + buttonItem.name;
                            } else {
                                output = buttonItem.name;
                                formula = this.state.formula.slice(0, -1) + buttonItem.name;
                            }
                            break;
                        case statesConst.operator:
                            output = buttonItem.name;
                            formula = this.state.formula + buttonItem.name;
                            break;
                        case statesConst.negativeOperand:
                            output = '-' + buttonItem.name;
                            formula = this.state.formula + buttonItem.name;
                            break;
                    }
            }
            this.setState(
                {
                    output: output,
                    formula: formula,
                    calculatorState: calculatorState,
                    decimalOperandFlag: decimalOperandFlag
                });
        }
    }

    render() {
        const buttonMap = buttons.map((item) => {
            return <Clickable buttonId={item.buttonId} name={item.name} onClick={this.handleClick}/>;
        });
        return (<div className="calculator">
            <Display output={this.state.output} formula={this.state.formula}/>
            {buttonMap}
        </div>);
    }
}