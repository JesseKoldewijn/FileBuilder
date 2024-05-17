export const dedupeCharacters = (b64String: string) => {
  let lastChar = "";

  let count = 0;
  let result = "";

  for (const char of b64String) {
    if (char === lastChar) {
      count++;
    } else {
      if (count > 1) {
        result += `[${count}]`;
        count = 0;
      }
      result += char;
    }
    lastChar = char;
  }

  if (count > 1) {
    result += `[${count}]`;
  }

  return result;
};

export const restoreCharacters = (b64String: string) => {
  let result = "";
  let count = 0;

  for (const char of b64String) {
    if (char === "[") {
      count = 0;
    } else if (char === "]") {
      continue;
    } else {
      if (count > 0) {
        result += char.repeat(count);
        count = 0;
      } else {
        result += char;
      }
    }
  }

  return result;
};
