import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";

export default function UserForm({ initial = {}, submitUrl, method = "post", passwordHelp = null }) {
    const page = usePage();
    const isCreate = (method || "post").toLowerCase() === "post";

    const [form, setForm] = useState({
        firstname: initial.firstname ?? "",
        lastname: initial.lastname ?? "",
        email: initial.email ?? "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForm((f) => ({
            ...f,
            firstname: initial.firstname ?? "",
            lastname: initial.lastname ?? "",
            email: initial.email ?? "",
        }));
    }, [initial.firstname, initial.lastname, initial.email]);

    // Si Inertia met les erreurs de validation dans page.props.errors, les synchroniser avec l'état local
    useEffect(() => {
        if (page.props && page.props.errors) {
            setErrors(normalizeErrors(page.props.errors || {}));
        }
        // Désactive la règle ESLint react-hooks/exhaustive-deps pour éviter les faux positifs sur les dépendances
    }, [page.props.errors]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Normaliser les erreurs : si le serveur retourne un tableau ou une chaîne, nous stockons toujours une chaîne
    const normalizeErrors = (errs) => {
        const normalized = {};
        if (!errs) return normalized;
        Object.keys(errs).forEach((k) => {
            const v = errs[k];
            normalized[k] = Array.isArray(v) ? v[0] : v;
        });
        return normalized;
    };

    const getError = (field) => {
        const v = errors[field];
        if (!v) return null;
        return typeof v === "string" ? v : Array.isArray(v) ? v[0] : String(v);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Effacer les erreurs précédentes pour que l'interface utilisateur se mette à jour en attendant le serveur
        setErrors({});
        setIsSubmitting(true);

        const methodLower = (method || "post").toLowerCase();

        const options = {
            onError: (errs) => {
                setErrors(normalizeErrors(errs || {}));
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
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input
                        id="firstname"
                        name="firstname"
                        value={form.firstname}
                        onChange={onChange}
                        aria-invalid={!!getError("firstname")}
                        aria-describedby={getError("firstname") ? "err-firstname" : undefined}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${getError("firstname") ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                            }`}
                        autoComplete="given-name"
                        placeholder="Prénom"
                    />
                    {getError("firstname") && <p id="err-firstname" className="mt-1 text-xs text-red-600">{getError("firstname")}</p>}
                </div>

                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                        id="lastname"
                        name="lastname"
                        value={form.lastname}
                        onChange={onChange}
                        aria-invalid={!!getError("lastname")}
                        aria-describedby={getError("lastname") ? "err-lastname" : undefined}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${getError("lastname") ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                            }`}
                        autoComplete="family-name"
                        placeholder="Nom"
                    />
                    {getError("lastname") && <p id="err-lastname" className="mt-1 text-xs text-red-600">{getError("lastname")}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E‑mail</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    aria-invalid={!!getError("email")}
                    aria-describedby={getError("email") ? "err-email" : undefined}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${getError("email") ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                        }`}
                    autoComplete="email"
                    placeholder="exemple@domaine.tld"
                />
                {getError("email") && <p id="err-email" className="mt-1 text-xs text-red-600">{getError("email")}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        aria-invalid={!!getError("password")}
                        aria-describedby={getError("password") ? "err-password" : (passwordHelp ? "help-password" : undefined)}
                        className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 ${getError("password") ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-indigo-500"
                            }`}
                        autoComplete="new-password"
                        placeholder={isCreate ? "Choisir un mot de passe (min. 8 caractères)" : "Laisser vide pour ne pas changer"}
                        required={isCreate}
                    />
                    {passwordHelp && !getError("password") && (
                        <p id="help-password" className="mt-1 text-xs text-gray-500">{passwordHelp}</p>
                    )}
                    {getError("password") && <p id="err-password" className="mt-1 text-xs text-red-600">{getError("password")}</p>}
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmation</label>
                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={form.password_confirmation}
                        onChange={onChange}
                        className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        autoComplete="new-password"
                        placeholder={isCreate ? "Confirme le mot de passe" : "Confirme le mot de passe (laisser vide si inchangé)"}
                        required={isCreate}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white ${isSubmitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
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
            </div>
        </form>
    );
}