import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres')
})

export const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  postal_code: z.string().min(8),
  country: z.string().default('Brasil')
})

export const paymentSchema = z.object({
  method: z.enum(['credit_card', 'pix', 'boleto']),
  card_number: z.string().optional(),
  card_name: z.string().optional(),
  card_exp: z.string().optional(),
  card_cvv: z.string().optional()
})
