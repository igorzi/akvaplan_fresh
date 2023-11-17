import { benthos } from "./benthos.tsx";
import { nytek } from "./nytek.tsx";
import { monitoring } from "./monitoring.tsx";
import { oceanography } from "./oceanography.tsx";
import { autonomous } from "./autonomous.tsx";
import { sense } from "./impact_risk.tsx";

export const serviceSummaryMap = new Map([
  ["benthos", benthos],
  ["monitoring", monitoring],
  ["nytek", nytek],
  ["oceanography", oceanography],
  ["autonomous", autonomous],
  ["glider", autonomous],
  ["observation_platforms", autonomous],
  ["miljørisiko", sense],
  ["environmental_risk", sense],
]);
