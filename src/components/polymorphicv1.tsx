import { ElementType, PropsWithChildren, ComponentPropsWithoutRef } from "react";

type PolyButtonV1Props<C extends ElementType> = {
  as?: C;
} & ComponentPropsWithoutRef<C>;
const PolyButtonV1 = <C extends ElementType = "button">({
  as,
  children,
  ...restProps
}: PropsWithChildren<PolyButtonV1Props<C>>) => {
  const PolyButton = as ?? "button";
  return <PolyButton {...restProps}>{children}</PolyButton>;
};

export { PolyButtonV1 };
