/*
 * Emstam función vuemlvem un temxtom cuamlquieram am imdiomam cheems
 * Ems puram y sin simdem emffemcts
 */
export function cheemsify(text: string) {
  return text.replace(/[aáeéiíoóuú]+[^aáeéiíoóuúmnñry]/gi, (value) => {
    const prefix = value.slice(0, value.length - 1);
    const postfix = value[value.length - 1];

    const infix = (
      prefix.toUpperCase() === prefix ? "M" : "m"
    );

    return prefix + infix + postfix;
  });
}
