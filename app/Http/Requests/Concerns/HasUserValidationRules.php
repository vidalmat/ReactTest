<?php
namespace App\Http\Requests\Concerns;

use Illuminate\Validation\Rule;
use App\Models\User;

trait HasUserValidationRules
{
    /**
     * Retourne les règles communes pour create/update user.
     *
     * @param  int|null  $ignoreId  id à ignorer email (update)
     * @param  bool      $isUpdate  si true, password peut être nullable
     * @return array
     */
    protected function userRules(?int $ignoreId = null, bool $isUpdate = false): array
    {
        $passwordRegex = config('auth.password_regex', env('PASSWORD_REGEX', '^(?=.*[A-Z])(?=.*\d).{8,}$'));

        return [
            'firstname' => ['required', 'string', 'max:255'],
            'lastname'  => ['required', 'string', 'max:255'],
            'email'     => array_filter([
                'required',
                'email',
                'max:255',
                $ignoreId ? Rule::unique('users', 'email')->ignore($ignoreId) : Rule::unique('users', 'email'),
            ]),
            'password'  => $isUpdate
                ? ['nullable','string','confirmed','min:8','regex:/'.$passwordRegex.'/']
                : ['required','string','confirmed','min:8','regex:/'.$passwordRegex.'/'],
        ];
    }
}
