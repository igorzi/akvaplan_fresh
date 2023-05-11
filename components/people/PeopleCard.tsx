import { akvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { peopleURL, personURL } from "akvaplan_fresh/services/nav.ts";

import { ApnSym, Card, Icon } from "akvaplan_fresh/components/mod.ts";

import { lang as langSignal, languages, t } from "akvaplan_fresh/text/mod.ts";

import { type Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import { Head } from "$fresh/runtime.ts";

interface PeopleProps {
  id?: string;
  person?: Akvaplanist;
  lang?: string;
  icons: boolean;
}
const people = await akvaplanistMap();

export function PeopleCard(
  {
    person,
    lang = langSignal.value,
    id,
    icons = true,
  }: PeopleProps,
) {
  if (people.has(id)) {
    person = { id, ...people.get(id) };
  }

  const {
    tel,
    email,
    name,
    given,
    family,
    position,
    unit,
    workplace,
    management,
    responsibility,
  } = person ?? {};

  return (
    <Card customClass="people-card">
      <Head>
        <link rel="stylesheet" href="/css/article.css" />
        <link rel="stylesheet" href="/css/people-card.css" />
      </Head>

      <div class="people-name">
        {name?.length > 1
          ? <span>{name}</span>
          : (
            <a href={personURL({ id, given, family, lang })}>
              <span style={{ color: "var(--text1)" }}>{given}</span>
              &nbsp;
              <span style={{ color: "var(--text2)" }}>{family}</span>
            </a>
          )}
      </div>
      <ApnSym width="2rem" />
      <span class="people-position">
        {position?.[lang ?? "no"] ?? ""}
      </span>

      {responsibility && (
        <div class="people-workplace">
          {responsibility?.[lang ?? "no"] ?? ""}
        </div>
      )}

      <div class="people-workplace">
        {unit && unit !== "LEDELS" && (
          <a
            style={{ color: "var(--text2)" }}
            href={`${peopleURL({ lang })}/unit/${unit}`}
          >
            {t(`unit.${unit}`)}
          </a>
        )}
      </div>
      {workplace?.length > 0 && (
        <div class="people-workplace">
          <a
            href={`${peopleURL({ lang })}/workplace/${workplace}`}
            style={{ color: "var(--text2)" }}
          >
            {workplace}
          </a>
        </div>
      )}

      {management === true && (
        <a
          class="people-workplace"
          href={`${peopleURL({ lang })}/management`}
        >
          {t("people.Management")}
        </a>
      )}

      {icons && (
        <div class="">
          {tel && (
            <a
              href={`tel:${tel}`}
              aria-label={`call ${tel}`}
            >
              <Icon name="phone_in_talk"></Icon>
            </a>
          )}
          <a
            href={`mailto:${email}`}
            aria-label={`send mail to ${email}`}
          >
            <Icon name="contact_mail"></Icon>
          </a>
        </div>
      )}
    </Card>
  );
}
