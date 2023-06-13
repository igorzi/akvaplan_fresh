// import PubsHistogram from "../islands/pubs_histogram.tsx";
// <PubsHistogram period="2000/" />

import { buildContainsFilter } from "akvaplan_fresh/search/filter.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { SlimCard } from "akvaplan_fresh/components/slim_card.tsx";

import { type SlimPublication } from "../@interfaces/slim_publication.ts";

import { useSignal } from "@preact/signals";

export interface DoiSearchResultsProps {
  results: SlimPublication[];
  all: SlimPublication[];
  q: string;
  start?: number;
  title?: string;
}

const lastNYears = (n, start = new Date().getFullYear()) =>
  [...new Array(n)].map((_, i) => start - i);
// @todo DoiSearch calc/show num Apn people (current/prior)
export default function DoiSearch(
  { q, results, start, all }: DoiSearchResultsProps,
) {
  const query = useSignal(q);
  const filtered = useSignal(results);
  const first = useSignal(true);
  const numFound = useSignal(results.length);
  const total = all.length;

  const handleSearch = ({ target: { value } }: Event) => {
    filtered.value = all.filter(buildContainsFilter(value));
    numFound.value = filtered.value.length;
    query.value = value;
  };

  // Handle search via URL query (on first load)
  if (first.value === true && q.length > 0) {
    first.value = false;
    handleSearch({ target: { value: q } });
  }
  const n = 5;
  return (
    <main style={{ background: "var(--surface1)" }}>
      <label for="pubs-search" style={{ fontSize: "1rem" }}>
        <p>
          {lastNYears(n).map((year, i) => (
            <span>
              <a href={`?year=${year}`}>{year}</a>
              {" "}
            </span>
          ))}
        </p>
        {/* <p>{t("pubs.search.Label")}</p> */}
      </label>
      <form
        id="pubs-search"
        autocomplete="off"
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 1fr",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="search"
          name="q"
          placeholder={t("pubs.search.placeholder")}
          value={query}
          onInput={handleSearch}
          style="border: none;
            border-radius: .5rem;
            padding: .75rem 1rem;
           "
        />

        <button type="submit">{t("pubs.Search")}</button>
      </form>
      <p style={{ fontSize: "1rem" }}>{numFound}/{total}</p>

      <ol>
        {filtered.value.slice(0, 200).map((slim, n) => (
          <SlimCard slim={slim} n={n} lang={lang.value} />
        ))}
      </ol>
    </main>
  );
}
// @todo Paging beyond 200 hits?
