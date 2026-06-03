export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function acronyme(str: string) {
  return str
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}


// const capitalize = (str = "") =>
//   str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
