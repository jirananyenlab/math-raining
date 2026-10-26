function checkName(allName = [], newName) {
  if (
    /[*$#@!+\/-]/.test(newName) ||
    newName.includes(":") ||
    newName.includes(";")
  ) {
    //*$#@!+:; ถ้ามีสัญลักษณ์เหล่านี้ จะไม่ได้
    return "Has special charecter";
  } else if (/^\s*$/.test(newName)) {
    // \s => whitespace(tab, space, line break)  ; ^ ต้องขึ้นต้นด้วย...  $ ต้องจบด้วย... ; \s* จะมี whitespace หรือ ไม่มีก็ได้
    // ^\s*$ => เอาแค่ whitespace แต่จะมีหรือไม่มีก็ได้
    return "";
  } else if (/^[A-Z,a-z,ก-ฮ,เ-ไ]/.test(newName.trim()) === false) {
    //ถ้าไม่ได้ขึ้นต้นด้วย A-Z,a-z,ก-ฮ,เ-ไ จะ เป็น false
    return "Must start with character";
  } else {
    let strOfnewName = newName.split(/\s/g).join("").toLowerCase();
    let checkDuplicateName = allName.some(
      (element) =>
        element.nameLevel.split(/\s/g).join("").toLowerCase() === strOfnewName
    );
    if (checkDuplicateName) {
      //'Duplicate'
      return "Duplicate Name";
    } else {
      // 'Name_validate'
      return "Name validate";
    }
  }
}

export { checkName };
