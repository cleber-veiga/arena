export type Contact = {
  id: number
  nome: string
  cpf: string
  cep: string
  cidade: string
  uf: string
  logradouro: string
  numero: string
}

export const initialContacts: Contact[] = [
  {
    id: 1,
    nome: "Ana Martins",
    cpf: "123.456.789-10",
    cep: "01001-000",
    cidade: "Sao Paulo",
    uf: "SP",
    logradouro: "Rua A",
    numero: "120",
  },
  {
    id: 2,
    nome: "Carlos Souza",
    cpf: "",
    cep: "20040-020",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    logradouro: "Avenida Central",
    numero: "45",
  },
  {
    id: 3,
    nome: "Fernanda Lima",
    cpf: "987.654.321-00",
    cep: "30130-110",
    cidade: "Belo Horizonte",
    uf: "MG",
    logradouro: "Rua das Flores",
    numero: "88",
  },
]
