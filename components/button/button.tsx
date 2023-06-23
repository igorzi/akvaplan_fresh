import { HTMLProps } from "preact";

type Props = HTMLProps<HTMLButtonElement> & {
  additionalClass?: string;
};

export default function Button({ additionalClass = "", children, ...props }: Props) {
  return (
    <button class={`custom-button ${additionalClass}`} {...props}>
      {children}
    </button>
  );
}
