export const legacyHosts = ["www.akvaplan.niva.no", "akvaplan.niva.no"];
export const legacyRoutes = new Map<string, string>([
  // NO
  //["/ms-louise", ""],
  // ["/akkreditering", "/no/"],
  ["/analysetjenester", "/no/tjenester"],
  // ["/analysetjenester-for-marin-naering", "/no/"],
  // covered in routes/akvaplanist.tsx: ["/ansatte", "/no/folk"],
  // ["/fakturering", "/no/"],

  ["/forskning-utvikling", "/no/forskning"],
  // ["/jobb-hos-oss", "/no/"],
  // ["/kvalitetspolicy-og-etiske-retningslinjer", "/no/"],
  ["/nyhetsarkiv", "/no/nyheter"],
  ["/om-oss", "/no/om-oss"],
  // ["/personvern", "/no/"],
  // ["/plast-publikasjoner", "/no/"],
  ["/prosjekter-nettverk", "/no"],
  ["/radgivning", "/no/tjenester"],
  // ["/robots.txt", "/no/"],
  // ["/feed", "/no/"],
  ["/teknisk_inspeksjon", "/no/tjenester"],
  // EN
  ["/en/advisory-services", "/en/services"],
  ["/about-us", "/en/about-us"],
  ["/en/accreditation", "/en/accreditation"],
  ["/en/advisory-services", "/en/services"],
  ["/en/analytical-services", "/en/services"],
  ["/en/employees", "/en/people"],
  //["/en/feed", "/en/feed"],
  //["/en/home","/en/home"]
  //["/en/invoicing","/en/invoicing"]
  ["/en/news-archive", "/en/news"],
  //["/en/plastic-publications","/en/plastic-publications"]
  ["/en/projects-networks", "/en"],
  ["/en/projects-networks/polar-front-ecology", "/en/project/polarfront"],
  ["/en/projects-networks/criptic", "/en/project/criptic"],
  //["/en/quality-policy-and-ethical-guidelines","/en/quality-policy-and-ethical-guidelines"]
  ["/en/research-development", "/en/research"],
  ["/en/technical-inspections", "/en/services"],
  //["/en/work-with-us","/en/work-with-us"]
]);
