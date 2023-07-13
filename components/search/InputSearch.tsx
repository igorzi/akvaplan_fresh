import { Icon } from "../icon.tsx";

type InputSearchProps = {} & JSX.HTMLAttributes<HTMLInputElement>;

export function InputSearch({ ...props }: InputSearchProps) {
  return (
    <div className="search-container">
      <input className="search-input" type="search" {...props} />
      <div className="search-icon">
        <Icon name="search" width={20} height={20} />
      </div>
    </div>
  );
}
