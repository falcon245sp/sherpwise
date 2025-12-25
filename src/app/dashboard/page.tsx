import { UserButton } from "@clerk/nextjs";
import { getOntaraUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getOntaraUser();

  if (!user) {
    return null; // Middleware will redirect to sign-in
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ontara Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back, {user.firstName || user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <p className="font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-gray-500">{user.role.replace("_", " ")}</p>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Stats */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">User Info</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Role:</dt>
                <dd className="font-medium text-gray-900">
                  {user.role.replace("_", " ")}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">District ID:</dt>
                <dd className="font-medium text-gray-900">{user.districtId || "N/A"}</dd>
              </div>
              {user.siteIds && (
                <div>
                  <dt className="text-gray-500">Sites:</dt>
                  <dd className="font-medium text-gray-900">{user.siteIds.length}</dd>
                </div>
              )}
              {user.subject && (
                <div>
                  <dt className="text-gray-500">Subject:</dt>
                  <dd className="font-medium text-gray-900">{user.subject}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="/standards"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Browse Standards
                </a>
              </li>
              <li>
                <a
                  href="/classify"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Classify Expression
                </a>
              </li>
              <li>
                <a
                  href="/documents"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Document Library
                </a>
              </li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="mt-4 text-sm text-gray-500">No recent activity yet.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
