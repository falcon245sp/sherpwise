import { AppLayout } from "@/components/layout";

export default function StandardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
