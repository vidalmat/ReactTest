# ReactTest

Application d'administration d'utilisateurs (Laravel 12, Inertia + React, Tailwind, shadcn UI).

Ce dépôt contient les éléments effectivement implémentés lors du développement de l'exercice :

- Migration pour ajouter `firstname` et `lastname`, puis suppression de la colonne `name`via une nouvelle migration.
- Factory et seeder : génération d'un utilisateur de test `test@example.com` (mot de passe par défaut compatible : "Password1") et plusieurs utilisateurs factices.
- FormRequests (Store / Update / Profile) avec règles centralisées et regex de mot de passe configurable via `PASSWORD_REGEX`.
- Controllers (User, Profile) : gestion CRUD, hachage du mot de passe si fourni, réponses JSON pour requêtes XHR et rendu Inertia pour pages.
- Frontend React + Inertia : pages Users Index / Create / Edit, composant réutilisable de formulaire, gestion des erreurs 422.
- Pagination côté client robuste (`resources/js/Components/Pagination.jsx`) compatible avec `Paginator->toArray()` (data, links, meta) et sélecteur `per_page`.
- UI : intégration de composants shadcn (Radix/Tailwind) et icônes `lucide-react` ; remplacement de `confirm()` par un modal de confirmation (français) pour les suppressions.

1) Installer dépendances PHP et JS

	composer install
	npm install

2) Configurer l'environnement

	copy .env.example .env
	php artisan key:generate
	éditer `.env` pour configurer la DB (MySQL), si besoin, `PASSWORD_REGEX` et `PASSWORD_HELP`

3) Migration 

	php artisan migrate --seed

4) Lancer le serveur et Vite

	php artisan serve
	npm run dev

Notes rapides

- Si Vite se plaint de `tailwindcss-animate`, installe : `npm install tailwindcss-animate` ou retirer le plugin dans `tailwind.config.js`.
- Si des composants shadcn manquent, lancer : `npx shadcn@latest init` puis `npx shadcn@latest add` pour les composants souhaités.

Informations supplémentaires / Notes pratiques
-----------------------------------------

- Compte de test fourni par le seeder :
	- e‑mail : `test@example.com`
	- mot de passe : `Password1`

- État des échanges client ⇄ serveur :
	- Axios est configuré globalement (`resources/js/bootstrap.js`) avec les en‑têtes CSRF et `Accept: application/json`.
	- Certaines pages et formulaires ont été convertis pour utiliser `axios` (ex. connexion, inscription, gestion utilisateurs)

- Versions recommandées
    - Laravel 12
	- PHP : 8.2+
	- Node : 16+ (ou la version utilisée lors du dev)
	- Composer et npm installés globalement

- Commandes utiles (Windows / PowerShell)

		composer install
		npm install
		copy .env.example .env
		php artisan key:generate
		php artisan migrate --seed
		php artisan serve
		npm run dev

- Remerciements
	- Je tiens à vous remercier de m'avoir donner l'opportunité de me replonger dans React, si je devais retenir une chose de cette exercice, il a été très formateur pour moi.
    Mon objectif étant de performer, verbe bien trop utiliser certes, mais que dire, que malgré l'adversité, et quoi qu'il puisse arriver, cette exercire fut un beau challenge.
    Et comme est mon credo, je ne lâcherai rien même si dois prendre du temps.

    Merci à vous, 

    Matthias 



