import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getOntaraUser } from "@/lib/auth/utils";
import { canManageUsers as checkCanManageUsers } from "@/lib/auth/permissions";

export default async function UsersPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const ontaraUser = await getOntaraUser();
  
  if (!ontaraUser) {
    redirect("/sign-in");
  }

  const canManage = checkCanManageUsers(ontaraUser.role);

  if (!canManage) {
    redirect("/dashboard");
  }

  const mockUsers = [
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@school.edu",
      role: "Teacher",
      status: "Active",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@school.edu",
      role: "Subject Lead",
      status: "Active",
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@school.edu",
      role: "Site Admin",
      status: "Active",
      lastActive: "3 days ago",
    },
  ];

  return (
    <div>
      <Breadcrumbs />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage users and their roles in your organization
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {mockUsers.length} user{mockUsers.length !== 1 ? "s" : ""} in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Last Active
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
                          {u.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{u.lastActive}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
