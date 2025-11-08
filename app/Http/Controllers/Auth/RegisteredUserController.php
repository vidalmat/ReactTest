<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\Concerns\HasUserValidationRules;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    use HasUserValidationRules;

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        // Fournit le passwordHelp depuis le trait
        return Inertia::render('Auth/Register', [
            'passwordHelp' => self::passwordHelp(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Règles réutilisées depuis le trait (create => isUpdate = false)
        $rules = $this->userRules(null, false);

        // Messages d'erreur 
        $messages = [
            // firstname
            'firstname.required' => "Le prénom est requis.",
            'firstname.string'   => "Le prénom doit être du texte.",
            'firstname.max'      => "Le prénom ne doit pas dépasser :max caractères.",

            // lastname
            'lastname.required' => "Le nom est requis.",
            'lastname.string'   => "Le nom doit être du texte.",
            'lastname.max'      => "Le nom ne doit pas dépasser :max caractères.",

            // email
            'email.required' => "L'adresse e‑mail est requise.",
            'email.email'    => "L'adresse e‑mail doit être une adresse e‑mail valide.",
            'email.max'      => "L'adresse e‑mail ne doit pas dépasser :max caractères.",
            'email.unique'   => "Cette adresse e‑mail est déjà utilisée.",

            // password
            'password.required'  => "Le mot de passe est requis.",
            'password.confirmed' => "La confirmation du mot de passe ne correspond pas.",
            'password.min'       => "Le mot de passe doit contenir au moins :min caractères.",
            'password.regex'     => "Le mot de passe ne respecte pas les règles de complexité.",
        ];

        $request->validate($rules, $messages);

        $user = User::create([
            'firstname' => $request->input('firstname'),
            'lastname'  => $request->input('lastname'),
            'email'     => $request->input('email'),
            'password'  => Hash::make($request->input('password')),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}