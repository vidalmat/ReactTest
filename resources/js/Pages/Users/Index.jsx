import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/react";
import axios from "axios";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Pagination from '@/components/Pagination';

import { Edit3, Trash2 } from 'lucide-react';
import ConfirmModal from '@/Components/ConfirmModal';

export default function UsersIndex({ users }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteConfirm = (id) => {
        setDeletingUserId(id);
        setConfirmOpen(true);
    };

    const closeDeleteConfirm = () => {
        if (isDeleting) return; // prévenir la fermeture pendant la suppression
        setConfirmOpen(false);
        setDeletingUserId(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingUserId) return;
        setIsDeleting(true);
        try {
            await axios.delete(route("users.destroy", deletingUserId));
            setIsDeleting(false);
            setConfirmOpen(false);
            setDeletingUserId(null);
            // reload the users only
            Inertia.reload({ only: ["users"] });
        } catch (error) {
            setIsDeleting(false);
            console.error("Erreur lors de la suppression :", error);
            // Optionnel: afficher une notification utilisateur plus conviviale
            alert("Erreur lors de la suppression");
            setConfirmOpen(false);
            setDeletingUserId(null);
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
                                            <td className="px-4 py-3 text-sm text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <Link href={route("users.edit", u.id)} as="a">
                                                        <Button variant="ghost" size="sm" className="p-2">
                                                            <Edit3 className="h-4 w-4 text-orange-500" />
                                                            <span className="sr-only">Modifier</span>
                                                        </Button>
                                                    </Link>

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="p-2"
                                                        onClick={() => openDeleteConfirm(u.id)}
                                                        aria-label="Supprimer"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-white" />
                                                        <span className="sr-only">Supprimer</span>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <Pagination links={users.links} meta={users} />
                        </div>

                    </CardContent>
                </Card>
            </div>

            <ConfirmModal
                open={confirmOpen}
                title="Supprimer l'utilisateur"
                description="Cette action est irréversible. Voulez-vous vraiment supprimer cet utilisateur ?"
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                loading={isDeleting}
                onConfirm={handleConfirmDelete}
                onClose={closeDeleteConfirm}
            />
        </>
    );
}

UsersIndex.layout = (page) => (
    <AuthenticatedLayout>{page}</AuthenticatedLayout>
);