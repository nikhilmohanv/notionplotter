import Link from "next/link";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserAuth } from "@/app/context/firebaseauth/authcontext";
import { deleteCookie, setCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LineChartIcon from "@/components/icons/logo";
import { useEffect } from "react";
import { useCookies } from "next-client-cookies";

export default function LoggedInNavBar() {
  const { user, logout } = UserAuth();
  const cookies = useCookies();
  const handleSignOut = async () => {
    try {
      deleteCookie("access_token");
      deleteCookie("uid");
      deleteCookie("isPro");
      await logout();
      redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user) {
      if (cookies.get("uid") == null) {
        const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        setCookie("uid", user.uid, {
          expires: expires,
          priority: "high",
          sameSite: "strict",
        });
      }
    }
    if (!cookies.get("uid")) {
      //redirect to /login page when not logged in.
      redirect("/");
    }
  }, [user]);
  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 z-40 bg-white/85 px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <LineChartIcon className="h-6 w-6" />
            <span>NotionPlotter</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <LineChartIcon className="h-6 w-6" />
                <span className="sr-only">NotionPlotter</span>
              </Link>

              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>

              <Link href="/settings" className="hover:text-foreground">
                Settings
              </Link>
              {/*    <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Analytics
              </Link> */}
            </nav>
          </SheetContent>
        </Sheet>
        
        <Link  href="/dashboard">
          <LineChartIcon className="h-10 w-10 flex  items-center md:hidden gap-4 md:ml-auto md:gap-2 lg:gap-4" />
        </Link>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-initial">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full" size="icon" variant="ghost">
                  <Image
                    alt="Avatar"
                    className="rounded-full"
                    height="32"
                    src={user ? user.photoURL : "/user.png"}
                    style={{
                      aspectRatio: "32/32",
                      objectFit: "cover",
                    }}
                    width="32"
                  />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    className="w-full h-7"
                    onClick={handleSignOut}
                  >
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
