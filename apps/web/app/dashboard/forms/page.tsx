"use client"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

export default function FormsPage() {
  const forms = [
    {
      id: 1,
      name: "Job Application Form",
      responses: 23,
      status: "Active",
    },
    {
      id: 2,
      name: "Feedback Form",
      responses: 15,
      status: "Draft",
    },
    {
      id: 3,
      name: "Event Registration",
      responses: 48,
      status: "Active",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Forms</h1>
          <p className="text-muted-foreground">
            Create and manage your forms
          </p>
        </div>

        <Button>Create Form</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Forms</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold">12</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Responses</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold">235</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Forms</CardTitle>
          </CardHeader>

          <CardContent>
            <h2 className="text-3xl font-bold">8</h2>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Input placeholder="Search forms..." />

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Forms</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>{form.name}</TableCell>
                  <TableCell>{form.responses}</TableCell>
                  <TableCell>{form.status}</TableCell>

                  <TableCell>
                    <Button variant="outline">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  )
}