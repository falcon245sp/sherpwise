import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Your Profile</h1>
        <UserProfile />
      </div>
    </div>
  );
}
