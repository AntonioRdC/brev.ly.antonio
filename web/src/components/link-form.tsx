import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createLinkSchema = z.object({
  originalUrl: z.string().url('URL inválida'),
  shortCode: z.string().optional(),
})

type CreateLinkForm = z.infer<typeof createLinkSchema>

interface LinkFormProps {
  onSubmit: (data: CreateLinkForm) => void
  isLoading?: boolean
}

export function LinkForm({ onSubmit, isLoading }: LinkFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkForm>({
    resolver: zodResolver(createLinkSchema),
  })

  const handleFormSubmit = (data: CreateLinkForm) => {
    onSubmit(data)
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar novo link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='originalUrl'
                className='text-xs uppercase text-muted-foreground'
              >
                Link Original
              </Label>
              <Input
                placeholder='www.exemplo.com.br'
                error={errors.originalUrl?.message}
                {...register('originalUrl')}
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='shortCode'
                className='text-xs uppercase text-muted-foreground'
              >
                Link Encurtado
              </Label>
              <div className='flex'>
                <Input placeholder='brev.ly/' {...register('shortCode')} />
              </div>
              {errors.shortCode && (
                <p className='text-sm text-destructive'>
                  {errors.shortCode.message}
                </p>
              )}
            </div>
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
