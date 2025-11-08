import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Users } from 'lucide-react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Accueil
                </h2>
            }
        >
            <Head title="Accueil" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-indigo-50">
                <div className="max-w-4xl w-full">
                    <div className="relative rounded-3xl shadow-2xl bg-white border border-gray-200 overflow-hidden">
                        <div className="p-12 pt-20 text-center">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
                                Bienvenue dans cette espace <br /><span className="text-blue-600">administration</span>
                            </h1>

                            <div className="flex justify-center space-x-4">
                                <Link
                                    href={route('users.index')}
                                    className="inline-flex items-center px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition"
                                >
                                    <Users className="w-4 h-4 mr-3" />
                                    Voir les utilisateurs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}