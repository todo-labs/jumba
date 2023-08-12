import { LogOut, PlusCircle, Settings, User } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import router from "next/router";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/AlertDialog";

export function UserNav() {
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(" ");
    if (!lastName) return firstName?.charAt(0);
    if (firstName && lastName.length > 0)
      return `${firstName.charAt(0)}${lastName?.charAt(0)}`;
  };

  const handleSignOut = () => {
    void signOut();
  };

  if (!session) return <Button onClick={() => void signIn()}>Login</Button>;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session?.user.image as string}
                alt={session?.user.name as string}
              />
              <AvatarFallback className="border-2 border-primary bg-primary/20 text-primary">
                {session?.user?.name ? getInitials(session.user.name) : "👻"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p>{session?.user.name || "Anonymous"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                <span className="font-bold text-primary">
                  {session?.user.email}
                </span>
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => void router.push(`/profile`)}>
              <User className="mr-2 h-4 w-4" />
              <p className="capitalize">Profile</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void router.push(`/settings`)}>
              <Settings className="mr-2 h-4 w-4" />
              <p className="capitalize">Settings</p>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <Button variant="link">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </AlertDialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
