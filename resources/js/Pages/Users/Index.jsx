import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/react";
import axios from "axios";

export default function UsersIndex({ users }) {
    const handleDelete = async (id) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
            return;
        try {
            await axios.delete(route("users.destroy", id));
            Inertia.reload({ only: ["users"] });
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de l'utilisateur :",
                error
            );
            alert("Erreur lors de la suppression");
        }
    };
    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Utilisateurs</h1>
                    <div>
                        <Link
                            href={route("users.index")}
                            method="get"
                            as="a"
                            className="btn"
                        >
                            Rafraichir
                        </Link>
                        <Link
                            href={route("users.create")}
                            className="btn bg-blue-600 text-white ms-3"
                        >
                            Nouveau
                        </Link>
                    </div>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((u) => (
                            <tr key={u.id}>
                                <td>{u.firstname}</td>
                                <td>{u.lastname}</td>
                                <td>{u.email}</td>
                                <td>
                                    <Link
                                        href={route("users.edit", u.id)}
                                        className="text-blue-600 mr-2"
                                    >
                                        Modifier
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* pagination */}
                <div className="mt-4">
                    {users.links &&
                        users.links.map((l, idx) => (
                            <span
                                key={idx}
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        ))}
                </div>
            </div>
        </>
    );
}

// applique le layout AuthenticatedLayout avec un header
UsersIndex.layout = (page) => (
    <AuthenticatedLayout >
        {page}
    </AuthenticatedLayout>
);