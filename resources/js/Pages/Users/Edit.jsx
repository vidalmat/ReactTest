import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from "./Form";

export default function Edit({ user }) {
    return (
        <>
            <Head title="Modifier utilisateur" />
            <div className="max-w-4xl mx-auto py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Modifier l'utilisateur</h1>
                        <p className="text-sm text-gray-500 mt-1">Mets à jour les informations du compte.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('users.index')}
                            className="text-sm px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                        >
                            Retour
                        </Link>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <UserForm
                            initial={user}
                            submitUrl={route("users.update", user.id)}
                            method="put"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page) => (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Modifier utilisateur</h2>}>
        {page}
    </AuthenticatedLayout>
);