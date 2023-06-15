import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signIn } from "next-auth/react";
import type { Category } from "@prisma/client";
import { Loader2Icon, LockIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Slider } from "~/components/ui/Slider";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

import { type CreateExperiment, createExperimentSchema } from "~/schemas";
import { Requirements } from "~/constants";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/useToast";
import { cn } from "~/utils";

interface ICreateExperimentModalProps {
  onClose: () => void;
  category: Category;
}

const CreateExperimentModal = (props: ICreateExperimentModalProps) => {
  const form = useForm<CreateExperiment>({
    resolver: zodResolver(createExperimentSchema),
    defaultValues: {
      numOfPeople: 2,
      category: props.category,
      requirements: Requirements.QUICK,
      ingredients: [],
    },
    mode: "onChange",
  });

  const { data: session } = useSession();

  useEffect(() => {
    form.setValue("category", props.category);
  }, [form, props.category]);

  // const { fields, append } = useFieldArray({
  //   control: form.control,
  //   name: "ingredients",
  // });

  const utils = api.useContext();
  const { toast } = useToast();

  const createExperiment = api.experiments.create.useMutation({
    async onSuccess(value) {
      toast({
        title: "Success",
        description: `Experiment #${value.tag} created successfully`,
        action: (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.open(`/experiment/${value.id}`, "_blank");
            }}
          >
            View
          </Button>
        ),
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

  async function onSubmit(values: CreateExperiment) {
    try {
      await createExperiment.mutateAsync(values);
      props.onClose();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={void form.handleSubmit(onSubmit)} className="space-y-6">
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`ingredients.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Ingredients
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add all the ingredients needed for this experiment 😁.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="link"
            className="mt-4 w-full border-2 border-primary bg-primary/20 font-medium"
            onClick={() => append("")}
          >
            Add Ingredient
          </Button>
        </div> */}
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
                    <SelectValue placeholder="Think of something later" />
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
                {field.value}
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
          <Button className="w-full" onClick={void signIn()}>
            <LockIcon className="mr-2" />
            Login
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CreateExperimentModal;