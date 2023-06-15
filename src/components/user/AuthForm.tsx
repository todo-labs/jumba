"use client";

import * as React from "react";

import { cn } from "~/utils";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";

type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const formSchema = z.object({
    email: z.string().email(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await signIn("email", { email: values.email });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
               
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
