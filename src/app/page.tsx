import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/meal-plan');
  return null;
}