import React, { useState } from "react";
import axios from "axios";
import { Inertia } from "@inertiajs/inertia";

export default function UserForm({ initial = {}, submitUrl, method = "post" }) {
    const [form, setForm] = useState({
        firstname: initial.firstname || "",
        lastname: initial.lastname || "",
        email: initial.email || "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});

    // On ajoute au changement des valeurs du formulaire
    const onChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            if (method.toLowerCase() === "post") {
                await axios.post(submitUrl, form);
            } else {
                await axios.put(submitUrl, form);
            }

            Inertia.visit(route("users.index"));
        } catch (error) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors || {});
            } else {
                console.error(err);
                alert("Erreur serveur");
            }
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Prénom</label>
                <input
                    name="firstname"
                    value={form.firstname}
                    onChange={onChange}
                />
                {errors.firstname && (
                    <div className="text-red-600">{errors.firstname[0]}</div>
                )}
            </div>

            <div>
                <label>Nom</label>
                <input
                    name="lastname"
                    value={form.lastname}
                    onChange={onChange}
                />
                {errors.lastname && (
                    <div className="text-red-600">{errors.lastname[0]}</div>
                )}
            </div>

            <div>
                <label>Email</label>
                <input name="email" value={form.email} onChange={onChange} />
                {errors.email && (
                    <div className="text-red-600">{errors.email[0]}</div>
                )}
            </div>

            <div>
                <label>Mot de passe</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={onChange}
                />
                {errors.password && (
                    <div className="text-red-600">{errors.password[0]}</div>
                )}
            </div>

            <div>
                <label>Confirmation</label>
                <input
                    type="password"
                    name="password_confirmation"
                    value={form.password_confirmation}
                    onChange={onChange}
                />
            </div>

            <button type="submit" className="btn bg-blue-600 text-white">
                Enregistrer
            </button>
        </form>
    );
}
