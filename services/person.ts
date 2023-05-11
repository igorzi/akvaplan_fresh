// @todo Move to service ?
// Used by person page to check if a publication is authored by this person
const familyAliasMap = new Map([
  ["clh", "Halsband-Lenk"],
  ["avs", "SIKORSKI"],
]);
export const familyAlias = (id: string) => familyAliasMap.get(id);
export const givenAliasMap = new Map(
  [
    ["aki", ["Albert Kjartansson", "Albert"]],
    ["skc", ["Sabine Karin J.", "S. J.", "Sabine K."]],
    ["avs", ["ANDREY", "Andrej Vladimirovich"]],
    ["per", ["Paul Eric"]],
    ["anb", ["A. N."]],
  ],
);

// Used by DOI page to lookup author alias
export const alias = new Map([
  ["ANDREY|SIKORSKI", "avs"],
]);
