<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasUserValidationRules;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateUserRequest extends FormRequest
{
    use HasUserValidationRules;

    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        $routeUser = $this->route('user');
        $ignoreId = null;
        if ($routeUser instanceof \App\Models\User) {
            $ignoreId = $routeUser->id;
        } elseif (is_numeric($routeUser)) {
            $ignoreId = (int) $routeUser;
        }

        // isUpdate = true => password nullable
        return $this->userRules($ignoreId, true);
    }

    public function messages(): array
    {
        return [
            'firstname.required' => "Le prénom est requis.",
            'firstname.string' => "Le prénom doit être une chaîne de caractères.",
            'firstname.max' => "Le prénom est trop long.",

            'lastname.required' => "Le nom est requis.",
            'lastname.string' => "Le nom doit être une chaîne de caractères.",
            'lastname.max' => "Le nom est trop long.",

            'email.required' => "L'adresse e‑mail est requise.",
            'email.email' => "Le format de l'adresse e‑mail est invalide.",
            'email.max' => "L'adresse e‑mail est trop longue.",
            'email.unique' => "Cette adresse e‑mail est déjà utilisée.",

            'password.string' => "Le mot de passe doit être une chaîne de caractères.",
            'password.min' => "Le mot de passe doit contenir au moins :min caractères.",
            'password.regex' => "Le mot de passe doit respecter la règle configurée.",
            'password.confirmed' => "La confirmation du mot de passe ne correspond pas.",
        ];
    }
}