import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/react";
import axios from "axios";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Pagination from '@/components/Pagination';

export default function UsersIndex({ users }) {
    const handleDelete = async (id) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
        try {
            await axios.delete(route("users.destroy", id));
            Inertia.reload({ only: ["users"] });
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <>
            <Head title="Utilisateurs" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Utilisateurs</h1>

                    <div className="flex items-center gap-2">
                        <Link href={route("users.index")} method="get" as="a">
                            <Button variant="outline" size="sm">Rafraîchir</Button>
                        </Link>

                        <Link href={route("users.create")} as="a">
                            <Button size="sm">Nouveau</Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des utilisateurs</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">{u.firstname}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{u.lastname}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                                            <td className="px-4 py-3 text-sm text-right space-x-2">
                                                <Link href={route("users.edit", u.id)} className="inline-block">
                                                    <Button variant="ghost" size="sm">Modifier</Button>
                                                </Link>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>Supprimer</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* pagination */}
                        <Pagination links={users.links} meta={users} />
                        
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

UsersIndex.layout = (page) => (
    <AuthenticatedLayout>{page}</AuthenticatedLayout>
);