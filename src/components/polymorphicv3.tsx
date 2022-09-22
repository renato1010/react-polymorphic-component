import { ElementType, PropsWithChildren, ComponentPropsWithoutRef } from "react";

type PolyColor = "primary" | "accent";
type AsProp<C extends ElementType> = { as?: C };
type PolyButtonOwnProps<C extends ElementType, PassedProps = {}> = AsProp<C> & PassedProps;
type PolyButtonV3Props<C extends ElementType, PassedProps = {}> = PropsWithChildren<
  PolyButtonOwnProps<C, PassedProps>
> &
  Omit<ComponentPropsWithoutRef<C>, keyof PolyButtonOwnProps<C>>;

const PolyButtonV3 = <C extends ElementType = "button", PassedProps = {}>({
  as,
  children,
  style,
  color,
  ...restProps
}: PolyButtonV3Props<C, PassedProps>) => {
  const PolyButton = as ?? "button";
  const outStyle = color ? { ...style, color: color === "primary" ? "#058ed9" : "#df6066" } : style;
  return (
    <PolyButton style={outStyle} {...restProps}>
      {children}
    </PolyButton>
  );
};

export { PolyButtonV3 };
