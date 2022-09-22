import { PropsWithChildren } from "react";

type PolyButtonV0Props = {
  as?: any;
};
const PolyButtonV0 = ({ as, children }: PropsWithChildren<PolyButtonV0Props>) => {
  const PolyButton = as ?? "button";
  return <PolyButton>{children}</PolyButton>;
};

export { PolyButtonV0 };
