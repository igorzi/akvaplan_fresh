import Button from "./button.tsx";
import { Icon } from "akvaplan_fresh/components/icon.tsx";
import { PropsWithChildren } from "preact";

export type PillProps = PropsWithChildren & {
  selected: boolean;
};


export function Pill(
  { children, selected, icon = "close", ...props }: PillProps = {},
) {
  return (
    <Button
      additionalClass={`pill-button ${selected ? "pill-button-selected" : ""}`}
      {...props}
    >
      {children}
      {selected && (
        <>
          &nbsp;
          <Icon name={icon} style={{ width: "1rem", height: "1rem" }} />
        </>
      )}
    </Button>
  );
}
