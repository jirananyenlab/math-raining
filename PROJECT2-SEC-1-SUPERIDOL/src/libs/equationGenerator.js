import { evaluateExpression } from "./evaluateExpression.js";
function equationGenerator(levels) {
  function randomNumber() {
    return Math.round(Math.random() * levels.numberRange); // random เลข ตาม numberRange
  }

  function randomSymbol() {
    return levels.symbol[Math.floor(Math.random() * levels.symbol.length)]; // เลือกว่าจะใช้ Symbol ตัวไหน
  }

  //ต้องเลขคี่เสมอ
  // 7(ตัวที่1) +(ตัวที่2) 2(ตัวที่3)
  function randomLengthExpression() {
    let numL1 = Math.floor(
      Math.random() * levels.lengthExpression + 3 //ใส่ +3 เพื่อให้ numL1 เริ่มต้นด้วย 3
    );
    return numL1 % 2 !== 0 ? numL1 : numL1 - 1;
  } // random ความยาวของสมการ

  //output: ["2" , "/" , "0"]
  let equation = Array.from({ length: randomLengthExpression() }, (_, i) =>
    i % 2 !== 0 ? randomSymbol() : randomNumber()
  );

  //output: ["2" , "/" , "1"]
  let finalEquation = equation.map((element, index) =>
    equation[index - 1] === "/" && element === 0 ? 1 : element
  ); // เช็คว่ามี /0 หรือไม่ ถ้ามีก็เปลี่ยนเป็น 1

  function calculateResult() {
    return evaluateExpression(finalEquation);
  }
  return { expression: finalEquation, result: calculateResult() };
}

export { equationGenerator };
