export const myFilter = (textValue, inputValue) => {
  if (inputValue.length === 0) {
    return true;
  }

  // Normalize both strings so we can slice safely
  // take into account the ignorePunctuation option as well...
  textValue = textValue.normalize("NFC").toLocaleLowerCase();
  inputValue = inputValue.normalize("NFC").toLocaleLowerCase();

  return textValue.slice(0, inputValue.length) === inputValue;
};
