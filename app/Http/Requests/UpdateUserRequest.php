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
            'email.unique' => "Cette adresse email est déjà utilisée.",
            'password.regex' => "Le mot de passe doit respecter la règle configurée.",
            'password.confirmed' => "La confirmation du mot de passe ne correspond pas.",
        ];
    }
}
