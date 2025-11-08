import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user ?? {};

    const nameFallback = (user.name || '').trim();
    const fallbackFirstname = user.firstname ?? (nameFallback ? nameFallback.split(' ')[0] : '');
    const fallbackLastname = user.lastname ?? (nameFallback ? nameFallback.split(' ').slice(1).join(' ') : '');

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            firstname: fallbackFirstname ?? '',
            lastname: fallbackLastname ?? '',
            email: user.email ?? '',
        });

    useEffect(() => {
        setData('firstname', user.firstname ?? (user.name ? user.name.split(' ')[0] : ''));
        setData('lastname', user.lastname ?? (user.name ? user.name.split(' ').slice(1).join(' ') : ''));
        setData('email', user.email ?? '');
    }, [user.id]);

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informations du profil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Mettez à jour les informations de votre compte et votre adresse e‑mail.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="firstname" value="Prénom" />

                    <TextInput
                        id="firstname"
                        className="mt-1 block w-full"
                        value={data.firstname}
                        onChange={(e) => setData('firstname', e.target.value)}
                        required
                        isFocused
                        autoComplete="given-name"
                    />

                    <InputError className="mt-2" message={errors.firstname ?? errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="lastname" value="Nom" />

                    <TextInput
                        id="lastname"
                        className="mt-1 block w-full"
                        value={data.lastname}
                        onChange={(e) => setData('lastname', e.target.value)}
                        required
                        autoComplete="family-name"
                    />

                    <InputError className="mt-2" message={errors.lastname} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="E‑mail" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Votre adresse e‑mail n'est pas vérifiée.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-2"
                            >
                                Cliquer ici pour renvoyer l'e‑mail de vérification.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Un nouveau lien de vérification a été envoyé à votre adresse e‑mail.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Enregistrer</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-200 transform"
                        enterFrom="opacity-0 -translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-150 transform"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Enregistré.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}