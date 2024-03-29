import type { NextPage } from "next";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Separator } from "@/components/ui/Separator";
import SettingsLayout from "@/components/user/SidebarNav";

import { cn } from "@/utils";
import { toast } from "@/hooks/useToast";
import { profileSchema, type Profile } from "@/schemas";
import { api } from "@/utils/api";
import Head from "next/head";

const ProfilePage: NextPage = () => {
  const { data: profile } = api.profile.get.useQuery();
  const { data: session, update } = useSession();

  const form = useForm<Profile>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || session?.user?.name || "",
      dob: profile?.dob ? new Date(profile.dob) : new Date(),
    },
  });

  const updateProfileMutation = api.profile.update.useMutation({
    onSuccess() {
      toast({
        title: "Success",
        description: `Your profile has been updated`,
      });
    },
    onError(error) {
      toast({
        title: "Error",
        description: error.message,
      });
    },
  });

  async function onSubmit(data: Profile) {
    try {
      await updateProfileMutation.mutateAsync(data);
      update({
        name: data.name,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <SettingsLayout>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings. Set your preferred language and
            timezone.
          </p>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="w-[300px]"
                      placeholder="Your name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update account</Button>
          </form>
        </Form>
      </div>
    </SettingsLayout>
  );
};

export default ProfilePage;
