import { HTMLProps } from "preact";

type Props = HTMLProps<HTMLButtonElement> & {
  additionalClass?: string;
  filled?: boolean;
};

export default function Button({
  additionalClass = "",
  filled = false,
  children,
  ...props
}: Props) {
  return (
    <button
      class={`custom-button ${additionalClass} ${
        filled ? "custom-button-filled" : ""
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
