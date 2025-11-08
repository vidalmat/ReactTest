<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        $passwordRegex = config('auth.password_regex', env('PASSWORD_REGEX'));

        return [
            'firstname' => ['required', 'string', 'max:255'],
            'lastname'  => ['required', 'string', 'max:255'],
            'email'     => ['required','email','max:255','unique:users,email'],
            'password'  => ['required','string','confirmed','min:8', 'regex:/'.$passwordRegex.'/'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.regex' => 'Le mot de passe doit contenir au moins une lettre majuscule et un chiffre.',
        ];
    }
}
