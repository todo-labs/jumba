import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Loader2Icon, X, XCircleIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";

import { Button } from "./Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form";
import { Input } from "./Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { Slider } from "./Slider";

import { MAX_INGREDIENTS, Requirements, MAX_NUM_OF_PEOPLE } from "~/constants";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/useToast";
import { createExperimentSchema } from "~/schemas";

interface ISidebarProps {
  choice: Category;
  visible: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ choice, visible, setShowSidebar }: ISidebarProps) => {
  const { data: session } = useSession();
  const { toast } = useToast();

  const utils = api.useContext()

  const createExperiment = api.experiments.create.useMutation({
    async onSuccess(value, variables, context) {
      toast({
        title: "Success",
        description: `Experiment #${value.tag} created successfully`,
      });
      form.reset();
      await utils.experiments.getAll.invalidate();
    },
    onError(error, variables, context) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
      });
    },
  });

  const form = useForm<z.infer<typeof createExperimentSchema>>({
    resolver: zodResolver(createExperimentSchema),
    defaultValues: {
      // numOfPeople: "1",
      ingredients: "",
      category: choice,
    },
  });

  function onSubmit(values: z.infer<typeof createExperimentSchema>) {
    try {
      createExperiment.mutateAsync({
        ...values,
        category: choice,
      });
      setShowSidebar(false);
    } catch (error) {
      console.log(error);
    }
  }

  if (!visible) return null;

  return (
    <>
      <section className="fixed right-0 z-50 h-screen w-full space-y-4 overflow-scroll bg-white p-4 shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] lg:w-96 xl:z-0">
        <div className="flex w-full items-center justify-between">
          <h1 className="flex items-center justify-center text-2xl">
            Create New Experiment
          </h1>
          <XCircleIcon className="h-4 w-4 mr-4" onClick={() => setShowSidebar(false)} />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Split the ingredients with a comma
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Think of somtheing later" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(Requirements).map((requirement, index) => {
                        return (
                          <SelectItem key={index} value={requirement}>
                            {requirement}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="numOfPeople"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of People{
                    form.watch("numOfPeople") && `: ${form.watch("numOfPeople")}`
                    }</FormLabel>
                  <FormControl>
                    <Slider 
                      min={1}
                      max={MAX_NUM_OF_PEOPLE}
                      step={1}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {session?.user ? (
              <Button className="w-full" type="submit" disabled={createExperiment.isLoading}>
                {createExperiment.isLoading && (
                  <Loader2Icon className="mr-2 animate-spin" />
                )}
                Submit
              </Button>
            ) : (
              <Button className="w-full" onClick={() => void signIn()}>
                Sign In to Create Experiment
              </Button>
            )}
          </form>
        </Form>
      </section>
    </>
  );
};

export default Sidebar;
