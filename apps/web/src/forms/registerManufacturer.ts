import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
export const schemaRegisterManufacturer = z.object({
  name: z.string().min(1, { message: 'name is requires' }),
  location: z.string().min(1, { message: 'location is requires' }),
  contact: z.string().min(1, { message: 'contact is requires' }),
})
export type FormTypeRegisterManufacturer = z.infer<
  typeof schemaRegisterManufacturer
>
export const useFormRegisterManufacturer = () => {
  useForm<FormTypeRegisterManufacturer>({
    resolver: zodResolver(schemaRegisterManufacturer),
  })
}
