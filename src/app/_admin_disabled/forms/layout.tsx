import React from "react";

type Props = {
  children: React.ReactNode;
};

const FormsLayout = (props: Props) => {
  return <div>{props.children}</div>;
};

export default FormsLayout;
