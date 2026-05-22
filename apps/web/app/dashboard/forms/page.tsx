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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function FormsPage() {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { createForm, isPending } =
    useCreateForm();

  const { forms, isLoading } =
    useListForms();

  const handleCreate = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    createForm(
      {
        title,
        description,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTitle("");
          setDescription("");
        },
      }
    );
  };

  return (
    <div className="p-6">

      {/* Header */}
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
              <div>
                <Label>
                  Title
                </Label>

                <Input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />
              </div>

              <div>
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
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending
                  ? "Creating..."
                  : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Your Forms
          </CardTitle>
        </CardHeader>

        <CardContent>

          {isLoading ? (
            <p>Loading...</p>
          ) : forms?.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Title
                  </TableHead>

                  <TableHead>
                    Description
                  </TableHead>

                  <TableHead>
                    Created
                  </TableHead>

                  <TableHead>
                    Updated
                  </TableHead>

                  <TableHead>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {forms.map((form) => (
                  <TableRow
                    key={form.id}
                  >
                    <TableCell className="font-medium">
                      {form.title}
                    </TableCell>

                    <TableCell>
                      {form.description}
                    </TableCell>

                    <TableCell>
                      {form.createdAt
                        ? new Date(
                            form.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      {form.updatedAt
                        ? new Date(
                            form.updatedAt
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No forms found
            </div>
          )}

        </CardContent>
      </Card>

    </div>
  );
}