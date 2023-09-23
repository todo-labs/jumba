import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession, signIn } from "next-auth/react";
import type { Category } from "@prisma/client";
import { Loader2Icon, LockIcon, Trash2Icon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import { type CreateExperiment, createExperimentSchema } from "@/schemas";
import { Requirements } from "@/utils/constants";
import { env } from "@/env/client.mjs";
import { api } from "@/utils/api";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils";
import { useMixpanel } from "@/utils/mixpanel";

interface ICreateExperimentModalProps {
  onClose: () => void;
  category: Category;
}

const CreateExperimentModal = (props: ICreateExperimentModalProps) => {
  const utils = api.useContext();
  const { toast } = useToast();
  const { data: session } = useSession();
  const { trackEvent } = useMixpanel();

  const form = useForm<CreateExperiment>({
    resolver: zodResolver(createExperimentSchema),
    defaultValues: {
      feeds: 2,
      category: props.category,
      requirements: Requirements.QUICK,
      ingredients: [],
      desiredMeal: undefined,
    },
  });

  useEffect(() => {
    form.setValue("category", props.category);
  }, [form, props.category]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

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
      trackEvent("FormSubmission", {
        label: "Create Experiment",
        success: true,
        ...value,
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
      trackEvent("FormSubmission", {
        label: "Create Experiment",
        success: false,
        error: error?.message || "Something went wrong",
      });
    },
  });

  async function onSubmit(values: CreateExperiment) {
    try {
      await createExperiment.mutateAsync(values);
      props.onClose();
      trackEvent("FormSubmission", {
        label: "Create Experiment",
        ...values,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleRemove = (index: number) => {
    remove(index);
    trackEvent("ButtonClick", {
      label: "Remove Ingredient",
    });
  };

  const handleAppend = () => {
    append({ name: "" });
    trackEvent("ButtonClick", {
      label: "Add Ingredient",
    });
  };

  const handleLogin = () => {
    void signIn();
    trackEvent("Login");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="desiredMeal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Meal</FormLabel>
              <FormControl>
                <Input id="desired-meal" type="text" {...field} />
              </FormControl>
              <FormDescription>
                This is optional. Helps guide the AI towards a particular meal.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
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
                  <FormControl>
                    <article className="flex flex-row">
                      <Input
                        onChange={(e) =>
                          field.onChange({ name: e.target.value })
                        }
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(index)}
                      >
                        <Trash2Icon className="h-3 w-3 text-destructive" />
                      </Button>
                    </article>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="link"
            className="mt-4 w-full border-2 border-primary bg-primary/10 font-medium"
            onClick={handleAppend}
          >
            Add Ingredient
          </Button>
        </div>
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
                  {Object.values(Requirements).map((requirement, index) => {
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
          name="feeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Number of People:{" "}
                <span className="text-primary">{field.value}</span>
              </FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={env.NEXT_PUBLIC_MAX_PEOPLE}
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
            {createExperiment.isLoading && (
              <Loader2Icon className="mr-2 animate-spin" />
            )}{" "}
            Submit
          </Button>
        ) : (
          <Button className="w-full" onClick={handleLogin}>
            <LockIcon className="mr-2" />
            Login
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CreateExperimentModal;
