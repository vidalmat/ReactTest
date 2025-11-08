import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from "./Form";

export default function Edit({ user }) {
    return (
        <>
            <Head title="Modifier utilisateur" />
            <div>
                <h1 className="text-2xl font-bold mb-4">Modifier utilisateur</h1>
                <UserForm
                    initial={user}
                    submitUrl={route("users.update", user.id)}
                    method="put"
                />
            </div>
        </>
    );
}

Edit.layout = (page) => (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Modifier utilisateur</h2>}>
        {page}
    </AuthenticatedLayout>
);