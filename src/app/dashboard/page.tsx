import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { BookOpen, FileText, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const stats = [
    {
      title: "Total Standards",
      value: "2,456",
      description: "Across all grade levels",
      icon: BookOpen,
      trend: "+12% from last month",
    },
    {
      title: "Classifications",
      value: "847",
      description: "This month",
      icon: FileText,
      trend: "+23% from last month",
    },
    {
      title: "Active Users",
      value: "48",
      description: "In your district",
      icon: Users,
      trend: "+5 new this week",
    },
    {
      title: "Accuracy Rate",
      value: "94.2%",
      description: "Classification accuracy",
      icon: TrendingUp,
      trend: "+2.1% improvement",
    },
  ];

  return (
    <div>
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-2 font-medium">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest classifications and searches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 p-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Classified expression: &ldquo;Solve for x in 2x + 5 = 15&rdquo;
                  </p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-100 p-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Searched standards for &ldquo;algebraic equations&rdquo;
                  </p>
                  <p className="text-xs text-gray-600">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-100 p-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Classified 5 new expressions
                  </p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/classify"
                className="block w-full rounded-lg border border-gray-200 p-4 hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Classify Expression</p>
                    <p className="text-xs text-gray-600">
                      Match math expressions to standards
                    </p>
                  </div>
                </div>
              </a>
              <a
                href="/standards"
                className="block w-full rounded-lg border border-gray-200 p-4 hover:border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Browse Standards</p>
                    <p className="text-xs text-gray-600">
                      Explore the standards database
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
