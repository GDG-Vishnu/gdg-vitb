"use client";

import { Suspense, useState, useEffect } from "react";
import { UsersTable } from "./components/UsersTable";
import { PageLoading } from "@/components/ui/loading-fallbacks";
import {
  StatsGridSkeleton,
  UsersTableSkeleton,
} from "@/components/ui/skeleton-loaders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUsers } from "@/hooks/use-users";

function UsersStatsWrapper() {
  return (
    <Suspense fallback={<StatsGridSkeleton />}>{/* <UsersStats /> */}</Suspense>
  );
}

function UsersTableWrapper() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) {
    return <UsersTableSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Error loading users</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return <UsersTable users={users || []} />;
}

export default function UsersPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Simulate component mounting delay
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <PageLoading message="Loading users page..." />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}

      {/* Users Statistics */}
      <UsersStatsWrapper />

      {/* Users Table */}
      <UsersTableWrapper />
    </div>
  );
}
