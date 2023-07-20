import Button from '../../components/button/button.tsx';
import { PropsWithChildren } from 'preact';

type Props = PropsWithChildren & {
  selected: boolean;
};

import { Icon } from '../../components/icon.tsx';

export default function Pill({ selected, children }: Props) {
  return (
    <Button
      additionalClass={`pill-button ${
        selected.value ? 'pill-button-selected' : ''
      }`}
      onClick={() => {
        selected.value = !selected.value;
      }}
    >
      {children}
      {selected.value && <Icon name="close" width="1rem" height="1rem" />}
    </Button>
  );
}
