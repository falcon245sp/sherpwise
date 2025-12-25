import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Users, TrendingUp } from "lucide-react";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-semibold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              O
            </div>
            <span>Ontara</span>
          </div>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container px-4 py-24 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Math Standards Alignment Made Simple
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ontara helps educators classify mathematical expressions and align them with standards across all grade levels.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="bg-gray-50 py-24">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need for standards alignment
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="rounded-full bg-blue-100 p-3 w-fit mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Expression Classification</h3>
                <p className="text-sm text-gray-600">
                  Automatically classify math expressions and match them to relevant standards
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="rounded-full bg-green-100 p-3 w-fit mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Standards Database</h3>
                <p className="text-sm text-gray-600">
                  Browse and search through comprehensive math standards across all grades
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="rounded-full bg-purple-100 p-3 w-fit mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Team Collaboration</h3>
                <p className="text-sm text-gray-600">
                  Work together with your district and school teams on alignment projects
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="rounded-full bg-orange-100 p-3 w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Analytics & Insights</h3>
                <p className="text-sm text-gray-600">
                  Track usage, accuracy, and alignment trends across your organization
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} The Ontara Institute. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
