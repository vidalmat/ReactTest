<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasUserValidationRules;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    use HasUserValidationRules;

    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        // isUpdate = false => password requis
        return $this->userRules(null, false);
    }

    public function messages(): array
    {
        return [
            'firstname.required' => "Le prénom est requis.",
            'firstname.string' => "Le prénom doit être une chaîne de caractères.",
            'firstname.max' => "Le prénom est trop long.",

            'lastname.required' => "Le nom est requis.",
            'lastname.string' => "Le nom doit être une chaîne de caractères.",

            'email.required' => "L'adresse e‑mail est requise.",
            'email.email' => "Le format de l'adresse e‑mail est invalide.",
            'email.unique' => "Cette adresse e‑mail est déjà utilisée.",

            'password.required' => "Le mot de passe est requis.",
            'password.string' => "Le mot de passe doit être une chaîne de caractères.",
            'password.min' => "Le mot de passe doit contenir au moins :min caractères.",
            'password.regex' => "Le mot de passe doit respecter la règle configurée.",
            'password.confirmed' => "La confirmation du mot de passe ne correspond pas.",
        ];
    }
}