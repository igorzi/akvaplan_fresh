import { serviceSummaryMap } from "akvaplan_fresh/services/topic/mod.ts";

export const ServiceTopicDesc = ({ topic, lang, ...props } = {}) =>
  serviceSummaryMap.get(topic)?.get(lang) ?? (() => null);
