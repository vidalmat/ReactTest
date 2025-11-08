import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from "./Form";

export default function Create() {
    return (
        <>
            <Head title="Nouvel utilisateur" />
            <div>
                <h1 className="text-2xl font-bold mb-4">Nouvel utilisateur</h1>
                <UserForm submitUrl={route("users.store")} method="post" />
            </div>
        </>
    );
}

Create.layout = (page) => (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Nouvel utilisateur</h2>}>
        {page}
    </AuthenticatedLayout>
);