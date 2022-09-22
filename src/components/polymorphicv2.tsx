import { ElementType, PropsWithChildren, ComponentPropsWithoutRef } from "react";

type PolyColor = "primary" | "accent";
type PolyButtonOwnProps<C extends ElementType> = { as?: C; color: PolyColor };
type PolyButtonV2Props<C extends ElementType> = PolyButtonOwnProps<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof PolyButtonOwnProps<C>>;
  
const PolyButtonV2 = <C extends ElementType = "button">({
  as,
  children,
  style,
  color,
  ...restProps
}: PropsWithChildren<PolyButtonV2Props<C>>) => {
  const PolyButton = as ?? "button";
  const outStyle = { ...style, color: color === "primary" ? "#058ed9" : "#df6066" };
  return (
    <PolyButton style={outStyle} {...restProps}>
      {children}
    </PolyButton>
  );
};

export { PolyButtonV2 };
