import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function UserForm({ initial = {}, submitUrl, method = "post" }) {
    const [form, setForm] = useState({
        firstname: initial.firstname ?? "",
        lastname: initial.lastname ?? "",
        email: initial.email ?? "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form when initial changes (e.g. navigating between users without full reload)
    useEffect(() => {
        setForm((f) => ({
            ...f,
            firstname: initial.firstname ?? "",
            lastname: initial.lastname ?? "",
            email: initial.email ?? "",
        }));
    }, [initial.firstname, initial.lastname, initial.email]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        const methodLower = (method || "post").toLowerCase();

        const options = {
            onError: (errs) => {
                setErrors(errs || {});
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        };

        if (methodLower === "put" || methodLower === "patch") {
            Inertia.put(submitUrl, form, options);
        } else {
            Inertia.post(submitUrl, form, options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                        name="firstname"
                        value={form.firstname}
                        onChange={onChange}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${errors.firstname ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                            }`}
                        autoComplete="given-name"
                    />
                    {errors.firstname && <p className="mt-1 text-xs text-red-600">{errors.firstname[0]}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        name="lastname"
                        value={form.lastname}
                        onChange={onChange}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${errors.lastname ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                            }`}
                        autoComplete="family-name"
                    />
                    {errors.lastname && <p className="mt-1 text-xs text-red-600">{errors.lastname[0]}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                        }`}
                    autoComplete="email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                            }`}
                        autoComplete="new-password"
                        placeholder="Laisser vide pour ne pas changer"
                    />
                    {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmation</label>
                    <input
                        name="password_confirmation"
                        type="password"
                        value={form.password_confirmation}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoComplete="new-password"
                        placeholder="Confirme le mot de passe"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${isSubmitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {isSubmitting ? "En cours..." : "Enregistrer"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setForm({
                                firstname: initial.firstname ?? "",
                                lastname: initial.lastname ?? "",
                                email: initial.email ?? "",
                                password: "",
                                password_confirmation: "",
                            })
                        }
                        className="inline-flex items-center px-3 py-2 rounded-md text-sm border border-gray-200 bg-white hover:bg-gray-50"
                    >
                        Réinitialiser
                    </button>
                </div>

                <div className="text-sm text-gray-500">
                    <span className="font-medium">{/* keep spacing */}</span>
                </div>
            </div>
        </form>
    );
}