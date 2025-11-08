<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\Concerns\HasUserValidationRules;

class UserController extends Controller
{
    // Affiche la liste des utilisateurs
    public function index(): Response
    {
        $perPage = 15;
        $users = User::orderBy('created_at', 'desc')->paginate($perPage)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users->toArray(),
        ]);
    }

    // Stocke un nouvel utilisateur
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'user' => $user], 201);
        }

        return redirect()->route('users.index');
    }

    // Affiche le formulaire de création d'un utilisateur
    public function create(): Response
    {
        return Inertia::render('Users/Create', [
        'passwordHelp' => HasUserValidationRules::passwordHelp(),
    ]);
    }

    // Affiche le formulaire d'édition d'un utilisateur
    public function edit(User $user): Response
    {
        return Inertia::render('Users/Edit', [
            'user' => $user->toArray(),
            'passwordHelp' => HasUserValidationRules::passwordHelp(),
        ]);
    }

    // Met à jour un utilisateur existant
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->fill($data);
        $user->save();

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'user' => $user], 200);
        }

        return redirect()->route('users.index');
    }

    // Supprime un utilisateur
    public function destroy(Request $request, User $user)
    {
        $user->delete();

        if ($request->wantsJson()) {
            return response()->json(['success' => true], 200);
        }

        return redirect()->route('users.index');
    }
}
