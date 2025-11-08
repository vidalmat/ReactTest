import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from "./Form";

import { Card, CardContent } from '@/components/ui/card';

export default function Create() {
    return (
        <>
            <Head title="Nouvel utilisateur" />

            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between">
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('users.index')}
                            className="text-sm px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50"
                        >
                            Retour
                        </Link>
                    </div>
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">Nouvel utilisateur</h1>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <UserForm submitUrl={route("users.store")} method="post" />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Create.layout = (page) => (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Nouvel utilisateur</h2>}>
        {page}
    </AuthenticatedLayout>
);