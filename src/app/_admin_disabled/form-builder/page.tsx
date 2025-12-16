"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { PageLoading } from "@/components/ui/loading-fallbacks";

const FormBuilderRedirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/forms");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <PageLoading message="Redirecting to forms..." />;
};

export default FormBuilderRedirect;
