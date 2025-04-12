import { redirect } from 'next/navigation';
import React from 'react';

export default function Home(): React.ReactNode {
  redirect('/grocery-list');
  return null;
}