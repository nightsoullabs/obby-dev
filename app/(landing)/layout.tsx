import { SidebarInset, SidebarProvider } from "components/ui/sidebar";
import { AppSidebar } from "components/app-layout/app-sidebar";
import { Header } from "components/app-layout/header";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <Header />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
