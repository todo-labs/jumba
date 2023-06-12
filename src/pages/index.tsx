import { type NextPage } from "next";
import { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import { useSession, signOut, signIn } from "next-auth/react";
import { IExperiment } from "types";
import { Category } from "@prisma/client";
import { FolderClosedIcon, Loader2Icon, MailWarning } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Option from "~/components/Option";
import ExperimentCard from "~/components/Experiment";
import DefaultState from "~/components/DefaultState";
import { Button } from "~/components/ui/Button";
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
} from "~/components/ui/AlertDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Slider } from "~/components/ui/Slider";

import { api } from "~/utils/api";
import { Requirements, options } from "~/constants";
import { useToast } from "~/hooks/useToast";
import { createExperimentSchema } from "~/schemas";
import { env } from "~/env.mjs";
import { ScrollArea } from "~/components/ui/ScrollArea";
import Link from "next/link";

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState<Category>();
  const { data, isLoading, isError, refetch } =
    api.experiments.getAll.useQuery();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const { data: session } = useSession();

  const handleOptionPress = (option: Category | "Random") => {
    if (option === "Random") {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      setSelectedOption(randomOption.title);
      setShowSidebar(true);
      return;
    }
    setSelectedOption(option);
    setShowSidebar(true);
  };

  const { toast } = useToast();

  const utils = api.useContext();

  const createExperiment = api.experiments.create.useMutation({
    async onSuccess(value) {
      toast({
        title: "Success",
        description: `Experiment #${value.tag} created successfully`,
      });
      await utils.experiments.getAll.invalidate();
      form.reset();
    },
    onError(error) {
      toast({
        title: "Error",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    form.setValue("category", selectedOption);
  }, [selectedOption]);

  const form = useForm<z.infer<typeof createExperimentSchema>>({
    resolver: zodResolver(createExperimentSchema),
    defaultValues: {
      numOfPeople: 2,
      category: selectedOption,
      requirements: Requirements.QUICK,
    },
  });

  async function onSubmit(values: z.infer<typeof createExperimentSchema>) {
    try {
      await createExperiment.mutateAsync(values);
      setShowSidebar(false);
    } catch (error) {
      console.log(error);
    }
  }

  const filterExperiments = useMemo<IExperiment[]>(() => {
    if (!selectedOption) return data;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const term = search.toLowerCase();
    return data?.filter((experiment: IExperiment) => {
      return (
        experiment.title.toLowerCase().includes(term) ||
        experiment.tag.toString().toLowerCase().includes(term) ||
        experiment.ingredients.filter((ingredient) =>
          ingredient.toLowerCase().includes(term)
        ).length > 0
      );
    });
  }, [data, selectedOption, search]);

  return (
    <div className="flex h-screen items-start justify-center">
      <Head>
        <title>Jumba</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-col p-10">
        <section className="flex w-full justify-between">
          <Link
            className="text-4xl"
            href="https://blogr.conceptcodes.dev/introducing-jumba-ai"
          >
            Jumba
            <span className="text-primary">.</span>
          </Link>
          <div className="flex w-1/3 space-x-3">
            <Input
              type="search"
              name="search"
              placeholder="Search past 'Experiments'"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {session && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => void signOut()}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </section>

        <section className="mt-10 flex overflow-hidden overflow-x-scroll">
          {options.map((option, index) => (
            <Option
              key={index}
              title={option.title}
              icon={option.icon}
              selected={selectedOption === option.title}
              onClick={() => handleOptionPress(option.title)}
            />
          ))}
        </section>

        <section className="mt-10 flex h-full flex-col">
          <h1 className="text-2xl xl:text-4xl">
            Past Experiments{" "}
            {!isError && !isLoading && (
              <span className="">({data.length})</span>
            )}
          </h1>
          <div className="mt-10">
            {isLoading ? (
              <DefaultState
                title="Loading Experiments..."
                icon={Loader2Icon}
                description="We're working on getting all the experiments uploaded by people."
                btnText=""
                onClick={() => console.log("clicked")}
              />
            ) : isError ? (
              <DefaultState
                title="Error Loading Experiments"
                icon={MailWarning}
                description="We're working on getting all the experiments uploaded by people."
                btnText="retry"
                onClick={() => refetch()}
              />
            ) : filterExperiments.length > 0 ? (
              <ScrollArea className="h-[600px]">
                <section className="grid h-full grid-cols-1 gap-3 xl:grid-cols-3">
                  {filterExperiments.map(
                    (experiment: IExperiment, index: number) => (
                      <ExperimentCard key={index} {...experiment} />
                    )
                  )}
                </section>
              </ScrollArea>
            ) : (
              <DefaultState
                title="No Experiments Yet"
                icon={FolderClosedIcon}
                description="It seems that no one has uploaded any experiments yet. Be the first one to share your findings with the community!"
              />
            )}
          </div>
        </section>
      </main>
      <Dialog open={showSidebar} onOpenChange={setShowSidebar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              New <span className="text-primary">{selectedOption}</span>{" "}
              Experiment
            </DialogTitle>
            <DialogDescription>
              Pick all the options needed to create a new experiment.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingredients</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled={createExperiment.isLoading}
                      />
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
                      disabled={createExperiment.isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Think of somtheing later" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(Requirements).map((requirement, index) => {
                          return (
                            <SelectItem
                              key={index}
                              value={requirement}
                              disabled={createExperiment.isLoading}
                            >
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
              <FormField
                control={form.control}
                name="numOfPeople"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Number of People
                      {form.watch("numOfPeople") &&
                        `: ${form.watch("numOfPeople")}`}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={parseInt(env.NEXT_PUBLIC_MAX_PEOPLE)}
                        step={1}
                        disabled={createExperiment.isLoading}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {session?.user ? (
                <Button
                  className="w-full"
                  type="submit"
                  disabled={createExperiment.isLoading}
                >
                  {createExperiment.isLoading ? (
                    <Loader2Icon className="mr-2 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              ) : (
                <Button className="w-full" onClick={() => void signIn()}>
                  Sign In to Create Experiment
                </Button>
              )}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
