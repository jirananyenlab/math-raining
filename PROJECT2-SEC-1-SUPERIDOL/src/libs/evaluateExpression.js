function evaluateExpression(array) {
  // PEMDAS: Parentheses, Exponents, Multiplication and Division, Addition and Subtraction
  // ลำดับความสำคัญ เลขมากทำก่อน
  // + และ - มีค่าเท่ากันเพราะทำจากซ้ายไปขวา * / กรณีเดียวกัน
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  function applyOperation(numbers, operator) {
    const b = numbers.pop(); // เลขท้ายสุดของ array numbers และนำออกจาก array numbers
    const a = numbers.pop(); // เลขก่อนท้ายสุด ของ array numbers และนำออกจาก array numbers
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
    }
  }

  let numbers = [];
  let operators = [];

  for (let i = 0; i < array.length; i++) {
    let token = array[i];
    if (i % 2 === 0) {
      // index ที่หารด้วย 0 ลงตัวคือ number เก็บไว้ใน array numbers
      numbers.push(parseFloat(token));
    } else {
      // เทียบลำดับความสำคัญของ สัญลักษณ์ก่อน-หลัง ถ้าอันหลังสำคัญกว่าก็ยังไม่เอาสัญลักษณ์กับเลขที่อยู่ใน array numbers และ operators ปัจจุบันไปคิด ถ้าเท่ากันก็คำนวณเลย
      while (
        operators.length !== 0 &&
        precedence[operators[operators.length - 1]] >= precedence[token] // เช็คลำดับความสำคัญ operator ล่าสุดใน array กับ ตัวที่จะ push เข้า array operators
      ) {
        numbers.push(applyOperation(numbers, operators.pop())); // ถ้าใน array ต้องทำก่อนเข้า function applyOperation
      }
      operators.push(token); // เพิ่มสัญลักษณ์ใหม่เข้า array operators
    }
  }

  while (operators.length) {
    numbers.push(applyOperation(numbers, operators.pop()));
  }
  return numbers[0] % 1 !== 0 ? numbers[0].toFixed(2) : numbers[0];
}

export { evaluateExpression };
