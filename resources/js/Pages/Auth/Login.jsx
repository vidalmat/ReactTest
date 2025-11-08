import React, { useState } from 'react';
import axios from 'axios';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [data, setData] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
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

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        try {
            await axios.post(route('login'), data);
            window.location.href = route('dashboard');
        } catch (error) {
            // Normalise la présence de réponse quand Axios est enveloppé (ex: error.original.response)
            if (!error?.response && error?.original?.response) {
                // muter l'erreur permet aux fallback suivants d'accéder uniformément à response.data.errors
                error.response = error.original.response;
            }
            const validation = error?.validation ?? error?.response?.data?.errors ?? error?.original?.response?.data?.errors ?? null;
            if (validation) {
                setErrors(normalizeErrors(validation));
            } else {
                // Ajouter un message d'erreur générique accessible via le state
                setErrors(prev => ({ ...prev, general: 'Erreur serveur, veuillez réessayer.' }));
                console.error('Login error', error);
                alert('Erreur serveur, veuillez réessayer.');
            }
        }
        setProcessing(false);
    };

    return (
        <GuestLayout>
            <Head title="Connexion" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="E‑mail" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={onChange}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Mot de passe" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={onChange}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={onChange}
                        />
                        <span className="ms-2 text-sm text-gray-600">Se souvenir de moi</span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Se connecter
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-sm text-gray-600">
                    <span>Vous n'avez pas de compte ? </span>
                    <Link
                        href={route('register')}
                        className="text-sm text-indigo-600 underline hover:text-indigo-800"
                    >
                        Inscrivez‑vous
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
