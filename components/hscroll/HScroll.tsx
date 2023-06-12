type HScrollProps = HTMLElement & {
  scrollerId: string;
  staticFirstElement?: HTMLElement;
  maxVisibleChildren?: number;
};

type HScrollButtonProps = {
  extraClass: string;
  dataFor: string;
  value: string;
  ariaLabel: string;
};

//unicode: ˂˃

function HScrollButton(
  { extraClass, dataFor, value, ariaLabel }: HScrollButtonProps,
) {
  return (
    <button
      class={`scroller-button scroller-button--${extraClass}`}
      data-for={dataFor}
      value={value}
      aria-label={ariaLabel}
    >
      {value === "left" ? "˂" : "˃"}
    </button>
  );
}

export function HScroll({
  children,
  scrollerId = crypto.randomUUID(),
  staticFirstElement,
  maxVisibleChildren,
}: HScrollProps) {
  const maxVisibleChildrenClass = maxVisibleChildren
    ? "max-visible-children"
    : "";

  return (
    <div class="scroll-container">
      <HScrollButton
        extraClass={"left"}
        dataFor={scrollerId}
        value={"left"}
        ariaLabel={"Rull til venstre"}
      />
      <HScrollButton
        extraClass={"right"}
        dataFor={scrollerId}
        value={"right"}
        ariaLabel={"Rull til høyre"}
      />

      {staticFirstElement && staticFirstElement}
      <core-scroll
        id={scrollerId}
        class={`hscroll ${maxVisibleChildrenClass}`}
        style={maxVisibleChildren
          ? {
            "--max-visible-children": maxVisibleChildren,
          }
          : {}}
      >
        {children}
      </core-scroll>
    </div>
  );
}

export default HScroll;
