import { redirect } from 'next/navigation';

export default function SimulationsRootPage() {
  // Arahkan ke mata pelajaran default (Matematika SMP = 1)
  redirect('/simulations/1');
}

