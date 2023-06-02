type HScrollProps = HTMLElement & {
  scrollerId: string;
  staticFirstElement?: HTMLElement;
  maxVisibleChildren?: number;
};

//unicode: ˂˃

export function HScroll({
  children,
  scrollerId,
  staticFirstElement,
  maxVisibleChildren,
}: HScrollProps) {
  const maxVisibleChildrenClass = maxVisibleChildren
    ? "max-visible-children"
    : "";

  return (
    <div class="scroll-container">
      <button
        class="scroller-button scroller-button--left"
        data-for={scrollerId}
        value="left"
        aria-label="Rull til venstre"
      >
        ˂
      </button>
      <button
        class="scroller-button scroller-button--right"
        data-for={scrollerId}
        value="right"
        aria-label="Rull til høyre"
      >
        ˃
      </button>

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
