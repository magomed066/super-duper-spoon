import type { AuthCardContent, AuthMode } from '../types/auth-card.types'

export const authCardContent: Record<AuthMode, AuthCardContent> = {
  'sign-in': {
    badge: 'Авторизация',
    title: 'Добро пожаловать',
    description:
      'Войдите, чтобы продолжить работу с займами, платежами и документами.',
    toggleLabel: 'Нет аккаунта?',
    toggleAction: 'Подать заявку'
  },
  'sign-up': {
    badge: 'Регистрация',
    title: 'Создайте аккаунт',
    description:
      'Заполните данные, чтобы открыть доступ к личному кабинету и заявкам.',
    toggleLabel: 'Уже есть аккаунт?',
    toggleAction: 'Войти'
  }
}
