import Button from "./button.tsx";
import { Icon } from "../icon.tsx";

type IconButtonProps = {
  icon: string;
  reverse?: boolean;
  iconHeight?: string;
  iconWidth?: string;
  onClick?: () => void;
} & JSX.HTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  icon,
  reverse,
  iconHeight,
  iconWidth,
  onClick,
  ...props
}: IconButtonProps) {
  return (
    <Button {...props} onClick={onClick}>
      <Icon name={icon} width={iconWidth} height={iconHeight} />
    </Button>
  );
}
