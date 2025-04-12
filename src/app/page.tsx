import { redirect } from 'next/navigation';
import React from 'react';

export default function Home(): React.ReactNode {
  redirect('/meal-plan');
  return null;
}