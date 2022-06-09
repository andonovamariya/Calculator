import { useState } from "react";

import Wrapper from "./UI/Wrapper";
import Screen from "./UI/Screen";
import ButtonBox from "./UI/ButtonBox";
import Button from "./UI/Button";

const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) =>
  String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const mathOperations = (a, b, sign) =>
  sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

const App = () => {
  const [calculator, setCalculator] = useState({
    sign: "",
    number: 0,
    result: 0,
  });

  const numberClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;

    if (removeSpaces(calculator.number).length < 16) {
      setCalculator({
        ...calculator,
        number:
        removeSpaces(calculator.number) % 1 === 0 && !calculator.number.toString().includes(".")
        ? toLocaleString(Number(removeSpaces(calculator.number + value)))
        : toLocaleString(calculator.number + value),
        result: !calculator.sign ? 0 : calculator.result,
      });
    }
  };

  const commaClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;

    setCalculator({
      ...calculator,
      number: !calculator.number.toString().includes(".")
        ? calculator.number + value
        : calculator.number,
    });
  };

  const signClickHandler = (event) => {
    event.preventDefault();
    const value = event.target.innerHTML;

    setCalculator({
      ...calculator,
      sign: value,
      result: !calculator.number
        ? calculator.result
        : !calculator.result
        ? calculator.number
        : toLocaleString(
            mathOperations(
              Number(removeSpaces(calculator.result)),
              Number(removeSpaces(calculator.number)),
              calculator.sign
            )
          ),
      number: 0,
    });
  };

  const equalsClickHandler = () => {
    if (calculator.sign && calculator.number) {
      setCalculator({
        ...calculator,
        result:
          calculator.number === "0" && calculator.sign === "/"
            ? "Can't divide with 0"
            : toLocaleString(
                mathOperations(
                  Number(removeSpaces(calculator.result)),
                  Number(removeSpaces(calculator.number)),
                  calculator.sign
                )
              ),
        sign: "",
        number: 0,
      });
    }
  };

  const invertClickHandler = () => {
    setCalculator({
      ...calculator,
      number: calculator.number
        ? toLocaleString(removeSpaces(calculator.number) * -1)
        : 0,
      result: calculator.result
        ? toLocaleString(removeSpaces(calculator.result) * -1)
        : 0,
      sign: "",
    });
  };

  const percentClickHandler = () => {
    let number = calculator.number
      ? parseFloat(removeSpaces(calculator.number))
      : 0;
    let result = calculator.result
      ? parseFloat(removeSpaces(calculator.result))
      : 0;

    setCalculator({
      ...calculator,
      number: (number /= Math.pow(100, 1)),
      result: (result /= Math.pow(100, 1)),
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setCalculator({
      ...calculator,
      sign: "",
      number: 0,
      result: 0,
    });
  };

  return (
    <Wrapper>
      <Screen
        value={calculator.number ? calculator.number : calculator.result}
      />
      <ButtonBox>
        {btnValues.flat().map((btn, i) => {
          return (
            <Button
            key={i}
            className={btn === "=" ? "equals" : ""}
            value={btn}
            onClick={
              btn === "C"
                ? resetClickHandler
                : btn === "+-"
                ? invertClickHandler
                : btn === "%"
                ? percentClickHandler
                : btn === "="
                ? equalsClickHandler
                : btn === "/" || btn === "X" || btn === "-" || btn === "+"
                ? signClickHandler
                : btn === "."
                ? commaClickHandler
                : numberClickHandler
              }
            />
          );
        })}
      </ButtonBox>
    </Wrapper>
  );
};

export default App;
