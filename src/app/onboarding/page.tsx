import { redirect } from 'next/navigation'

// Legacy URL — перенаправляем на новый путь мульти-тренингов
export default function OnboardingLegacyRedirect() {
  redirect('/trainings/welcome')
}
