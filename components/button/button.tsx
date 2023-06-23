import { HTMLProps } from "preact";

type Props = HTMLProps<HTMLButtonElement>;

export default function Button({ children, ...props }: Props) {
  return (
    <button class="custom-button" {...props}>
      {children}
    </button>
  );
}
