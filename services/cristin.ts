//https://api.cristin.no/v2/doc
export const apiv2 = "https://api.cristin.no/v2";
export const cristinAkvaplanID = 6064;
export const akvaplanCristinPersonMap = new Map([["per", 60802]]);
export const cristinPeopleInsitutionURL = (ident: string | number) =>
  `${apiv2}/persons?institution=${ident}&per_page=1000`;
export const cristinAppWorksURL = (
  cristin_person_id: number,
  cristin_institution_id = cristinAkvaplanID,
) =>
  `https://app.cristin.no/search.jsf?type=result&filter=person_institution_idfacet~${cristin_institution_id}&filter=person_idfacet~${cristin_person_id}&&sort=PUBL_YEAR_DESC`;

export const cristinAppPersonURL = (cristin_person_id: number) =>
  `https://app.cristin.no/persons/show.jsf?id=${cristin_person_id}`;

export const findAkvaplanistInCristin = async ({ given, family, id }) => {
  if (akvaplanCristinPersonMap.has(id)) {
    return akvaplanCristinPersonMap.get(id);
  }
  const r = await fetch(cristinPeopleInsitutionURL(cristinAkvaplanID)).catch(
    () => {},
  );
  if (r?.ok) {
    for (
      const { surname, first_name, cristin_person_id } of await r.json()
    ) {
      if (surname === family) {
        if (
          first_name === given || given.includes(first_name) ||
          first_name.includes(given)
        ) {
          if (id) {
            akvaplanCristinPersonMap.set(id, Number(cristin_person_id));
          }
          return Number(cristin_person_id);
        } else {
          // console.debug("Family match", {
          //   family,
          //   given,
          //   cristin: { first_name, cristin_person_id },
          // });
        }
      }
    }
    //console.debug("Not found in CRISTIN", { id, family, given });
  }
};
