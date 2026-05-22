"use client";

import { useState } from "react";
import { useCreateForm, useListForms } from "~/hooks/api/form";

import { Button } from "~/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "~/components/ui/dialog";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function FormsPage() {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { createForm, isPending } = useCreateForm();

  const { forms, isLoading } = useListForms();

  const handleCreate = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log("Sending:", {
      title,
      description,
    });

    createForm(
      {
        title,
        description,
      },
      {
        onSuccess: (data) => {
          console.log(
            "SUCCESS:",
            data
          );

          setOpen(false);
          setTitle("");
          setDescription("");
        },

        onError: (err) => {
          console.log(
            "ERROR:",
            err
          );
        },
      }
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        
        <div>
          <h1 className="text-3xl font-bold">
            Forms
          </h1>

          <p className="text-muted-foreground">
            Manage your forms
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button>
              Create Form
            </Button>
          </DialogTrigger>

          <DialogContent>

            <DialogHeader>

              <DialogTitle>
                Create Form
              </DialogTitle>

              <DialogDescription>
                Create a new form
              </DialogDescription>

            </DialogHeader>

            <form
              onSubmit={handleCreate}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>
                  Title
                </Label>

                <Input
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="Job Form"
                />
              </div>

              <div className="space-y-2">

                <Label>
                  Description
                </Label>

                <Textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Form description..."
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full"
              >
                {isPending
                  ? "Creating..."
                  : "Create"}
              </Button>

            </form>

          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>
          Loading...
        </p>
      ) : forms?.length ? (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {forms.map((form) => (
            <Card key={form.id}>

              <CardHeader>

                <CardTitle>
                  {form.title}
                </CardTitle>

              </CardHeader>

              <CardContent>

                <p className="text-sm text-muted-foreground">
                  {form.description ||
                    "No description"}
                </p>

              </CardContent>

            </Card>
          ))}

        </div>

      ) : (
        <Card>

          <CardContent className="p-8 text-center">

            No forms found

          </CardContent>

        </Card>
      )}
    </div>
  );
}