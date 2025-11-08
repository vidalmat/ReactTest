import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function Register() {
    const page = usePage();
    const passwordHelp = page.props?.passwordHelp ?? null;

    const [form, setForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Si Inertia met les erreurs de validation dans page.props.errors, les synchroniser avec l'état local
    useEffect(() => {
        if (page.props && page.props.errors) {
            setErrors(normalizeErrors(page.props.errors || {}));
        }
    }, [page.props.errors]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

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
        return typeof v === 'string' ? v : Array.isArray(v) ? v[0] : String(v);
    };

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await axios.post(route('register'), form);
            // Rediriger vers la page souhaitée après succès
            window.location.href = route('dashboard'); // ou autre
        } catch (error) {
                // Supporter l'objet rejeté par l'intercepteur: { validation: errors, original: err }
                const validation = error?.validation ?? error?.response?.data?.errors ?? error?.original?.response?.data?.errors ?? null;
                if (validation) {
                    setErrors(normalizeErrors(validation));
                } else {
                    // eslint-disable-next-line no-console
                    console.error('Registration error', error);
                    alert('Erreur serveur, veuillez réessayer.');
                }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />

            {/* noValidate pour désactiver la validation HTML5 native */}
            <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <InputLabel htmlFor="firstname" value="Prénom" />

                        <TextInput
                            id="firstname"
                            name="firstname"
                            value={form.firstname}
                            className="mt-1 block w-full"
                            autoComplete="given-name"
                            isFocused={true}
                            onChange={onChange}
                        />

                        <InputError message={getError('firstname')} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="lastname" value="Nom" />

                        <TextInput
                            id="lastname"
                            name="lastname"
                            value={form.lastname}
                            className="mt-1 block w-full"
                            autoComplete="family-name"
                            onChange={onChange}
                        />

                        <InputError message={getError('lastname')} className="mt-2" />
                    </div>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="E‑mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={onChange}
                    />

                    <InputError message={getError('email')} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={onChange}
                    />

                    {/* afficher l'aide mot de passe si fournie depuis le contrôleur */}
                    {!getError('password') && passwordHelp && (
                        <p className="mt-1 text-xs text-gray-500">{passwordHelp}</p>
                    )}

                    <InputError message={getError('password')} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmation du mot de passe"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={onChange}
                    />

                    <InputError
                        message={getError('password_confirmation')}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <a
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Vous avez déjà un compte ?
                    </a>

                    <PrimaryButton className="ms-4" disabled={isSubmitting}>
                        {isSubmitting ? "En cours..." : "S'inscrire"}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}