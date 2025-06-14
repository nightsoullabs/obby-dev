import { ChatPageHeader } from "@/components/ai/chat-header";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full flex flex-col">
      <ChatPageHeader />
      {children}
    </div>
  );
}
