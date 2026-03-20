import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddressFieldsProps = {
  idPrefix: string
}

export function AddressFields({ idPrefix }: AddressFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium">Endereco</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-cep`}>CEP</Label>
          <Input
            id={`${idPrefix}-cep`}
            name="cep"
            placeholder="00000-000"
            required
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor={`${idPrefix}-cidade`}>Cidade</Label>
          <Input id={`${idPrefix}-cidade`} name="cidade" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-uf`}>UF</Label>
          <Input
            id={`${idPrefix}-uf`}
            name="uf"
            maxLength={2}
            placeholder="SP"
            required
          />
        </div>

        <div className="space-y-1.5 md:col-span-3">
          <Label htmlFor={`${idPrefix}-logradouro`}>Logradouro</Label>
          <Input id={`${idPrefix}-logradouro`} name="logradouro" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-numero`}>Numero</Label>
          <Input id={`${idPrefix}-numero`} name="numero" required />
        </div>
      </div>
    </div>
  )
}
