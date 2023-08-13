import Image from "next/image";
import { Activity, CreditCard, ChefHatIcon, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BarChartComponent } from "@/components/dashboard/overview";
import { RecentlyCreatedExperiments } from "@/components/dashboard/RecentlyCreatedExperiments";
import SettingsLayout from "@/components/user/SidebarNav";
import ExperimentTable from "@/components/dashboard/experiments-table";
import UserTable from "@/components/dashboard/user-management-table";

import { api } from "@/utils/api";

export default function DashboardPage() {
  const { data: session } = useSession();

  const { data: totalUsers } = api.admin.totalUsers.useQuery(undefined, {
    enabled: !!session?.user,
  });

  const { data: allExperiments } = api.admin.totalExperiments.useQuery(
    undefined,
    {
      enabled: !!session?.user,
    }
  );

  const { data: totalReviews } = api.admin.totalReviews.useQuery(undefined, {
    enabled: !!session?.user,
  });

  const experimentsByType = useMemo(() => {
    if (allExperiments) {
      const data = allExperiments.reduce((acc, experiment) => {
        if (acc[experiment.category]) {
          acc[experiment.category] += 1;
        } else {
          acc[experiment.category] = 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.keys(data).map((category) => ({
        label: category,
        amount: data[category] || 0,
      }));
    }

    return [];
  }, [allExperiments]);
  return (
    <SettingsLayout>
      <main className="w-full">
        <div className="md:hidden">
          <Image
            src="/examples/dashboard-light.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="block dark:hidden"
          />
          <Image
            src="/examples/dashboard-dark.png"
            width={1280}
            height={866}
            alt="Dashboard"
            className="hidden dark:block"
          />
        </div>
        <div className="hidden flex-col md:flex">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experiments">Experiments</TabsTrigger>
                <TabsTrigger value="user-management">
                  User Management
                </TabsTrigger>
                {/* <TabsTrigger value="notifications" disabled>
                  Notifications
                </TabsTrigger> */}
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Experiments
                      </CardTitle>
                      <ChefHatIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {allExperiments?.length || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {totalUsers || 0}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Reviews
                      </CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {totalReviews || 0}
                      </div>
                      {/* <p className="text-xs text-muted-foreground">
                        +19% from last month
                      </p> */}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Now
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">
                        +201 since last hour
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <BarChartComponent data={experimentsByType} />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recently Created Experiments</CardTitle>
                      <CardDescription>
                        {/* You made 265 sales this month. */}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentlyCreatedExperiments />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="experiments">
                <ExperimentTable />
              </TabsContent>
              <TabsContent value="user-management">
                <UserTable />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </SettingsLayout>
  );
}
