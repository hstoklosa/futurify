import React from "react";

import { Head } from "@components/seo";

const AppContentLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Head title={title} />
      <main className="flex-1 flex flex-col h-full w-full max-w-full overflow-hidden">
        {children}
      </main>
    </>
  );
};

export default AppContentLayout;
