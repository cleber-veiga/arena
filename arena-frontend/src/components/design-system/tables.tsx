"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModernEntityTable } from "@/components/tables/modern-entity-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"

const users = [
  { id: 1, name: "Sarah Wilson", email: "sarah@example.com", role: "Admin", status: "Active", initials: "SW" },
  { id: 2, name: "Michael Chen", email: "michael@example.com", role: "Member", status: "Active", initials: "MC" },
  { id: 3, name: "Emma Davis", email: "emma@example.com", role: "Member", status: "Inactive", initials: "ED" },
  { id: 4, name: "James Wilson", email: "james@example.com", role: "Viewer", status: "Active", initials: "JW" },
  { id: 5, name: "Olivia Brown", email: "olivia@example.com", role: "Member", status: "Pending", initials: "OB" },
]

const invoices = [
  { id: "INV001", customer: "Acme Corp", amount: "$1,250.00", status: "Paid", date: "Mar 1, 2024" },
  { id: "INV002", customer: "Globex Inc", amount: "$2,500.00", status: "Pending", date: "Mar 5, 2024" },
  { id: "INV003", customer: "Initech", amount: "$890.00", status: "Overdue", date: "Feb 15, 2024" },
  { id: "INV004", customer: "Umbrella Corp", amount: "$3,200.00", status: "Paid", date: "Mar 8, 2024" },
]

const modernRows = [
  { id: 1, nome: "Ana Martins", documento: "123.456.789-10", cidade: "Sao Paulo", uf: "SP", endereco: "Rua A, 120" },
  { id: 2, nome: "Carlos Souza", documento: "-", cidade: "Rio de Janeiro", uf: "RJ", endereco: "Av. Central, 45" },
  { id: 3, nome: "Fernanda Lima", documento: "987.654.321-00", cidade: "Belo Horizonte", uf: "MG", endereco: "Rua das Flores, 88" },
]

export function TablesSection() {
  const [filter, setFilter] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredRows = useMemo(() => {
    const normalized = filter.trim().toLowerCase()
    if (!normalized) return modernRows
    return modernRows.filter((row) =>
      [row.nome, row.documento, row.cidade, row.uf, row.endereco]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
  }, [filter])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const pageRows = filteredRows.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage
  )

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
        <p className="max-w-2xl text-muted-foreground">
          Display tabular data with sorting, selection, and actions. 
          Tables are responsive and support various customizations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modern Unified Pattern</CardTitle>
          <CardDescription>
            Quantidade por pagina, filtro, acoes por linha e paginacao completa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModernEntityTable
            title="Contatos"
            description="Padrao recomendado para listagens cadastrais do Arena."
            addButtonLabel="Adicionar novo"
            filterPlaceholder="Filtro inteligente: nome:ana uf:sp cidade:sao"
            filterValue={filter}
            onFilterValueChange={(value) => {
              setFilter(value)
              setPage(1)
            }}
            onAddNew={() => undefined}
            rows={pageRows}
            rowKey={(row) => row.id}
            columns={[
              { key: "nome", header: "Nome", className: "font-medium", cell: (row) => row.nome },
              { key: "documento", header: "Documento", cell: (row) => row.documento },
              { key: "cidade", header: "Cidade", cell: (row) => row.cidade },
              { key: "uf", header: "UF", className: "w-16", cell: (row) => row.uf },
              { key: "endereco", header: "Endereco", cell: (row) => row.endereco },
              {
                key: "acoes",
                header: "Acoes",
                className: "w-28 text-right",
                cell: () => (
                  <div className="flex items-center justify-end gap-1">
                    <Button type="button" variant="ghost" size="icon-sm">
                      <Eye className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm">
                      <Pencil className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" className="text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            page={safePage}
            rowsPerPage={rowsPerPage}
            totalItems={filteredRows.length}
            totalPages={totalPages}
            onRowsPerPageChange={(size) => {
              setRowsPerPage(size)
              setPage(1)
            }}
            onPageChange={setPage}
            onPrevPage={() => setPage((current) => Math.max(1, current - 1))}
            onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
            emptyMessage="Nenhum registro encontrado."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Table</CardTitle>
          <CardDescription>
            Simple table with basic styling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "default"
                          : invoice.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{invoice.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table with Selection</CardTitle>
          <CardDescription>
            Table with row selection using checkboxes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.initials}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.status === "Active"
                          ? "bg-success text-success-foreground"
                          : user.status === "Inactive"
                          ? "bg-muted text-muted-foreground"
                          : "bg-warning text-warning-foreground"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sortable Table</CardTitle>
          <CardDescription>
            Table headers with sort indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" className="-ml-3 h-8 hover:bg-transparent">
                    Name
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="-ml-3 h-8 hover:bg-transparent">
                    Email
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="-ml-3 h-8 hover:bg-transparent">
                    Role
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="-ml-3 h-8 hover:bg-transparent">
                    Status
                    <ArrowUpDown className="ml-2 size-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.slice(0, 3).map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Active"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empty State</CardTitle>
          <CardDescription>
            Table with no data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No results found</p>
                    <Button variant="outline" size="sm">Add new item</Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
