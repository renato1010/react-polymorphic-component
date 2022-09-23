import {
  ElementType,
  PropsWithChildren,
  ComponentPropsWithoutRef,
  forwardRef,
  ComponentPropsWithRef,
  ReactElement,
} from "react";

type PolyColor = "primary" | "accent";
type AsProp<C extends ElementType> = { as?: C };
type PolyButtonOwnProps<C extends ElementType, PassedProps = {}> = AsProp<C> & PassedProps;

type PolyButtonV4Props<C extends ElementType, PassedProps = {}> = PropsWithChildren<
  PolyButtonOwnProps<C, PassedProps>
> &
  Omit<ComponentPropsWithoutRef<C>, keyof PolyButtonOwnProps<C>>;
type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];
type PolymorphicComponentPropWithRef<C extends ElementType, PassedProps = {}> = PolyButtonV4Props<
  C,
  PassedProps
> & { ref?: PolymorphicRef<C> };
type PolyButtonProps<C extends ElementType> = PolymorphicComponentPropWithRef<
  C,
  { color: PolyColor | "black" }
>;
type PolymorphicButton = <C extends ElementType = "button">(props: PolyButtonProps<C>) => ReactElement | null;

const PolyButtonV4: PolymorphicButton = forwardRef(
  <C extends ElementType = "button", PassedProps = {}>(
    { as, children, style, color, ...restProps }: PolyButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const PolyButton = as ?? "button";
    const outStyle = color ? { ...style, color: color === "primary" ? "#058ed9" : "#df6066" } : style;
    return (
      <PolyButton ref={ref} style={outStyle} {...restProps}>
        {children}
      </PolyButton>
    );
  }
);

export { PolyButtonV4 };
