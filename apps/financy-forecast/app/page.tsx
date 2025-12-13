import { redirect } from 'next/navigation';

export default function HomePage() {
    // Redirect to the dashboard as the main entry point
    redirect('/dashboard');
}