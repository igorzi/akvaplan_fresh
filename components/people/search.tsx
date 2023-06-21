import { t } from "akvaplan_fresh/text/mod.ts";
import Button from "../button/button.tsx";

const pipe = <span>{" "}|{" "}</span>;
export const PeopleSearchForm = ({ q, sortdir }) => (
  <form autocomplete="off">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        marginBlockStart: "1rem",
        paddingBlockEnd: "2rem",
      }}
    >
      <input
        type="search"
        name="q"
        value={q}
        placeholder={t("people.search.placeholder")}
      />

      <Button type="submit">{t("Search")}</Button>
    </div>

    <menu
      style={{
        display: "grid",
        justifyContent: "end",
        fontSize: "1rem",
      }}
    >
      <p>
        <label>{t("people.group_by")}</label>:{" "}
        <a href="given0">{t("people.gn")}</a> {pipe}
        <a href="family0">{t("people.fn")}</a> {pipe}
        <a href="unit">{t("people.unit")}</a> {pipe}
        <a href="workplace">{t("people.workplace")}</a>
      </p>

      <p>
        <div name="sort" id="sort-select">
          <label for="sort-select">{t("sort.label")}:</label>{" "}
          <a href="">{t("sort.increasing")}</a>
          {pipe}
          <a href={`?sortdir=-1`}>
            {t("sort.decreasing")}
          </a>
        </div>
      </p>
    </menu>
    {/* <p>{t("people.subtitle")}</p> */}
  </form>
);
