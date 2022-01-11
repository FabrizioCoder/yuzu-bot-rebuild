/*
 * Emstam función vuemlvem un temxtom cuamlquieram am imdiomam cheems
 * Ems puram y sin simdem emffemcts
 */
export function cheemsify(text: string) {
  // reemplamzam por eml nuemvom temxtom momdimfimcamdo
  return text.replace(/[aáeéiíoóuú]+[^aáeéiíoóuúmnñry]/gi, (value) => {
    // premfimx simgnimfcam eml string y pomstfimx eml úmltimom caramcter
    const prefix = value.slice(0, value.length - 1);
    const postfix = value[value.length - 1];

    // infimx ems lom quem vam enmemdiom (om seam lam m)
    const infix = prefix.toUpperCase() === prefix ? "M" : "m";

    // finamlmentem vomlvemoms am unir loms strings
    return prefix + infix + postfix;
  });
}
