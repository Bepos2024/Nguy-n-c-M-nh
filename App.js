/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./App.css";

function App() {
  const [displayValue, setDisplayValue] = useState("0");
  const [expression, setExpression] = useState("");

  const handleButtonClick = useCallback(
    (value) => {
      switch (value) {
        case "=":
          calculateResult();
          break;
        case "C":
          clearDisplay();
          break;
        case "DEL":
          deleteCharacter();
          break;
        case "%":
          calculatePercentage();
          break;
        default:
          updateDisplay(value);
          break;
      }
    },
    [expression, displayValue]
  );

  const calculateResult = useCallback(() => {
    try {
      const result = evaluateExpression(expression);
      setDisplayValue(result.toString());
      setExpression("");
    } catch (error) {
      setDisplayValue("Error");
      setExpression("");
    }
  }, [expression]);

  const evaluateExpression = useCallback((expression) => {
    const operators = ["+", "-", "*", "/"];
    const parts = [];
    let currentPart = "";

    for (let char of expression) {
      if (operators.includes(char)) {
        parts.push(parseFloat(currentPart), char);
        currentPart = "";
      } else {
        currentPart += char;
      }
    }

    parts.push(parseFloat(currentPart));

    let result = parts[0];

    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i];
      const operand = parts[i + 1];
      switch (operator) {
        case "+":
          result += operand;
          break;
        case "-":
          result -= operand;
          break;
        case "*":
          result *= operand;
          break;
        case "/":
          if (operand === 0) {
            throw new Error("Divide by zero error");
          }
          result /= operand;
          break;
        default:
          throw new Error(`Unknown operator: ${operator}`);
      }
    }

    return result;
  }, []);

  const clearDisplay = useCallback(() => {
    setDisplayValue("0");
    setExpression("");
  }, []);

  const deleteCharacter = useCallback(() => {
    if (expression.length > 0) {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      setDisplayValue(newExpression === "" ? "0" : newExpression);
    }
  }, [expression]);

  const calculatePercentage = useCallback(() => {
    if (expression !== "") {
      const percentage = (parseFloat(expression) / 100).toString();
      setExpression(percentage);
      setDisplayValue(percentage);
    }
  }, [expression]);

  const updateDisplay = useCallback(
    (value) => {
      if (displayValue === "0" || displayValue === "Error") {
        setDisplayValue(value);
        setExpression(value);
      } else {
        setDisplayValue((prevDisplayValue) => prevDisplayValue + value);
        setExpression((prevExpression) => prevExpression + value);
      }
    },
    [displayValue]
  );

  const buttons = useMemo(() => {
    return [
      ["C", "DEL", "%", "/"],
      ["7", "8", "9", "*"],
      ["4", "5", "6", "-"],
      ["1", "2", "3", "+"],
      ["0", ".", "="],
    ];
  }, []);

  return (
    <div className="App">
      <Container fluid className="mt-5 pt-5">
        <Row id="main">
          <Col md={12} sm={12} className="mt-3 text-center fs-1 mb-3 fw-bolder">
            Calculator
          </Col>
          <Col md={4} sm={3}></Col>
          <Col md={4} sm={6} className="p-3 bg-dark">
            <div id="screen" className="col-12 bg-dark text-light text-end p-3">
              <input
                value={displayValue}
                className="fs-1 fw-bold mx-3 col-12 bg-dark text-light border-0 text-end bg"
                readOnly
              />
            </div>
            <div className="calculator-keys">
              {buttons.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="w-100 py-2 d-flex justify-content-between"
                >
                  {row.map((value, colIndex) => (
                    <Button
                      key={colIndex}
                      variant="light"
                      className={`col-md-2 col-sm-2 text-center fw-bold key-${value}`}
                      onClick={() => handleButtonClick(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
