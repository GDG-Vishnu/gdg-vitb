import { getUsersCount } from "@/actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, Shield } from "lucide-react";
import { UserRole } from "@prisma/client";

export async function UsersStats() {
  const result = await getUsersCount();

  if (!result.success) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6">
          <p className="text-destructive">Error: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result.data) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const { total, byRole, recent } = result.data;

  // Calculate role-specific counts
  const adminCount =
    byRole.find(
      (r: { role: UserRole; _count: { role: number } }) =>
        r.role === UserRole.ADMIN
    )?._count.role || 0;
  const organizerCount =
    byRole.find(
      (r: { role: UserRole; _count: { role: number } }) =>
        r.role === UserRole.ORGANIZER
    )?._count.role || 0;
  const participantCount =
    byRole.find(
      (r: { role: UserRole; _count: { role: number } }) =>
        r.role === UserRole.PARTICIPANT
    )?._count.role || 0;

  const stats = [
    {
      title: "Total Users",
      value: total.toLocaleString(),
      description: "All registered users",
      icon: Users,
      trend: recent > 0 ? `+${recent} this month` : "No new users this month",
    },
    {
      title: "Participants",
      value: participantCount.toLocaleString(),
      description: "Regular participants",
      icon: UserCheck,
      trend: `${((participantCount / total) * 100).toFixed(1)}% of total`,
    },
    {
      title: "Organizers",
      value: (organizerCount + adminCount).toLocaleString(),
      description: "Organizers & admins",
      icon: Shield,
      trend: `${(((organizerCount + adminCount) / total) * 100).toFixed(
        1
      )}% of total`,
    },
    {
      title: "New This Month",
      value: recent.toLocaleString(),
      description: "Recent registrations",
      icon: UserPlus,
      trend: recent > 0 ? "Growing" : "No growth",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
