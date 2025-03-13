# Mémo terminal psql

###

Migration : cd backend
node scripts/migrate.js

// Exécuter d'abord le fichier de création
\i 'C:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/backend/database/create_database.sql'

// Puis le fichier de seeding
\i 'C:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/backend/database/seeding_database.sql'

# Dans le terminal psql
psql -U postgres -h localhost

# Une fois connecté
DROP DATABASE IF EXISTS welleat_salessync;

CREATE DATABASE welleat_salessync
WITH ENCODING 'UTF8' 
LC_COLLATE='French_France.1252' 
LC_CTYPE='French_France.1252';

GRANT ALL PRIVILEGES ON DATABASE welleat_salessync TO admin_welleat_salessync;
ALTER USER admin_welleat_salessync WITH SUPERUSER;

\c welleat_salessync

# Exécuter le fichier de création des tables
\i 'C:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/backend/database/create_database.sql'

# Puis exécuter le seeding
\i 'C:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/backend/database/seeding_database.sql'

### BDD : 

psql -U postgres -h localhost

-- Supprimer la base de données si elle existe déjà
DROP DATABASE IF EXISTS welleat_salessync;

-- Créer la base de données avec les paramètres de collation pour le français
CREATE DATABASE welleat_salessync
WITH ENCODING 'UTF8' LC_COLLATE='French_France.1252' LC_CTYPE='French_France.1252';

-- Créer un utilisateur avec un mot de passe (à définir)
CREATE USER admin_welleat_salessync WITH PASSWORD 'chocolat19021986*';

-- Attribuer tous les privilèges sur la base de données à cet utilisateur
GRANT ALL PRIVILEGES ON DATABASE welleat_salessync TO admin_welleat_salessync;

-- Donner les droits de superutilisateur à l'utilisateur
ALTER USER admin_welleat_salessync WITH SUPERUSER;

-- Exécuter les scripts pour créer et peupler la base de données
psql -U postgres -h localhost -d welleat_salessync -f "C:\Users\docje\OneDrive\Documents\Code\Welleat\Welleat_Compare\backend\database\create_database.sql";

psql -U postgres -h localhost -d welleat_salessync -f "C:\Users\docje\OneDrive\Documents\Code\Welleat\Welleat_Compare\backend\database\seeding_database.sql";

\c welleat_salessync
\i 'C:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/backend/database/seeding_database.sql';
\i 'C:/Users/docje/OneDrive/Documents/Code/Welleat/Welleat_Compare/backend/database/create_database.sql';
### BDD pour tests : 

-- Connectez-vous à PostgreSQL en tant qu'utilisateur postgres
psql -U postgres -h localhost

-- Supprimer la base de données de test si elle existe déjà
DROP DATABASE IF EXISTS welleat_salessync_test;

-- Créer la base de données de test avec les paramètres de collation pour le français
CREATE DATABASE welleat_salessync_test
WITH ENCODING 'UTF8'
     LC_COLLATE='French_France.1252'
     LC_CTYPE='French_France.1252';

-- Créer l'utilisateur admin_welleat_salessync s'il n'existe pas déjà
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'admin_welleat_salessync') THEN

      CREATE USER admin_welleat_salessync WITH PASSWORD 'chocolat19021986*';
   END IF;
END
$do$;

-- Attribuer tous les privilèges sur la base de données de test à cet utilisateur
GRANT ALL PRIVILEGES ON DATABASE welleat_salessync_test TO admin_welleat_salessync;

-- Donner les droits de superutilisateur à l'utilisateur (Attention : à utiliser uniquement en environnement de test)
ALTER USER admin_welleat_salessync WITH SUPERUSER;


TEST :
CREATE DATABASE welleat_salessync_test;

.env.test

PORT=5001
DB_USER=admin_welleat_salessync
DB_PASSWORD=chocolat19021986*
DB_NAME=welleat_salessync_test
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret

SMTP_USER=docjef62pro@gmail.com
SMTP_PASS=qjigaqwrxfyyopza
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Mémo terminal psql pour tests : 



### Variable d'environnement

test : 
@adminEmail = admin@example.com
@adminPassword = adminpassword
@userEmail = john.doe@example.com
@userPassword = securepassword

@adminEmail = admin@example.com
@adminPassword = adminpassword
@userEmail = john.doe@example.com
@userPassword = securepassword


# Exemple : Rest Client :
### Connexion de l'Admin pour Obtenir le Token
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "{{adminEmail}}",
  "password": "{{adminPassword}}"
}

@adminToken = {{response.body.token}}

### Connexion de l'Utilisateur pour Obtenir le Token
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"
}

@userToken = {{response.body.token}}


Commande Modifiée (Base de Test)



---- Deployement : 

-- 1. Connectez-vous à psql en tant que postgres (depuis votre terminal) :
sudo -i -u postgres psql

-- 2. Supprimer la base et le rôle existants, le cas échéant
DROP DATABASE IF EXISTS welleat_salessync;
DROP ROLE IF EXISTS admin_welleat_salessync;

-- 3. Créer le rôle admin_welleat_salessync avec le mot de passe
CREATE ROLE admin_welleat_salessync WITH LOGIN PASSWORD 'chocolat19021986*';

-- 4. Créer la base de données avec un encodage et des locales compatibles
CREATE DATABASE welleat_salessync 
    WITH ENCODING 'UTF8'
         LC_COLLATE = 'fr_FR.UTF-8'
         LC_CTYPE   = 'fr_FR.UTF-8'
         TEMPLATE = template0;

-- 5. Connecter à la nouvelle base de données
\c welleat_salessync

-- 6. Réinitialiser le schéma public (toutes les tables et données seront effacées)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
SET search_path TO public;

-- 7. Charger le script de création de la base
\i '/home/student/Welleat_Compare/backend/database/create_database.sql'

-- 8. Charger le script de seeding
\i '/home/student/Welleat_Compare/backend/database/seeding_database.sql'

-- 9. Accorder tous les privilèges sur le schéma public au rôle admin_welleat_salessync
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_welleat_salessync;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_welleat_salessync;

-- 10. Transférer la propriété de toutes les tables du schéma public au rôle admin_welleat_salessync
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' OWNER TO admin_welleat_salessync';
    END LOOP;
END $$;


----- test de données 

SELECT * FROM "Roles";

SELECT * FROM "Users";
SELECT * FROM "Companies";



Vérifier le processus du backend :
Exécutez :

bash
Copier
pm2 list
ou, si vous n’utilisez pas PM2, vérifiez avec nodemon ou simplement en lançant :

bash
Copier
npm run dev
pour voir si le serveur démarre correctement.

Consultez les logs :
Pour PM2, exécutez :

bash
Copier
pm2 logs backend
ou pour nodemon, vérifiez la sortie de la console. Cela devrait vous donner des indices sur d’éventuelles erreurs empêchant le lancement du serveur.

Vérifier le port :
Assurez-vous qu’aucun processus n’utilise déjà le port 5000 :

bash
Copier
sudo lsof -i :5000
Si un processus est déjà actif, vous pouvez le stopper (par exemple avec sudo kill -9 <PID>).

Démarrer le serveur :
Une fois les vérifications effectuées, démarrez le serveur avec :

bash
Copier
npm run dev
(pour le mode développement) ou via PM2 avec :

bash
Copier
pm2 start npm --name backend -- start
Vérifier l’accessibilité locale :
Une fois démarré, testez localement avec :

bash
Copier
curl http://127.0.0.1:5000/api