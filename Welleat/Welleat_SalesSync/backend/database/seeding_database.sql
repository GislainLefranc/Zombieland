-- Dossier : database
-- Fichier : create_database.sql
-- Configuration de la base de données pour le projet Welleat

BEGIN;

---------------------------
-- 5.1 Seeding de la table "Roles"
---------------------------
INSERT INTO "Roles" (id, name, description, created_at, updated_at)
VALUES 
    (1, 'admin', 'Administrateur avec tous les privilèges', NOW(), NOW()),
    (2, 'sales_user', 'Utilisateur des ventes avec privilèges limités', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Ajustement de la séquence pour "Roles"
SELECT setval(pg_get_serial_sequence('"Roles"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Roles";

---------------------------
-- 5.2 Seeding de la table "Users"
---------------------------
INSERT INTO "Users" 
    (id, last_name, first_name, email, password, phone, position, role_id, created_at, updated_at)
VALUES 
    (1, 'dupont', 'alice', 'alice.dupont@example.com', '$2b$10$ledATWcDZbe9FKODpJ6q8.yyI.rNRzWwafQNnIRouqeCQahN5yHVm', '0612345678', 'administratrice', 1, NOW(), NOW()),
    (2, 'martin', 'bob', 'bob.martin@example.com', '$2b$10$N7px7BdS6GKitu8YBTVK2uZubbsxTNPZOEqvbGCv.x7.kd//GpRsu', '0698765432', 'responsable des ventes', 2, NOW(), NOW()),
    (3, 'durand', 'charlie', 'charlie.durand@example.com', '$2b$10$hashedpasswordcharlie...', '0611122233', 'représentant des ventes', 2, NOW(), NOW()),
    (4, 'laurent', 'diane', 'diane.laurent@example.com', '$2b$10$hashedpassworddiane...', '0622233344', 'représentante des ventes', 2, NOW(), NOW()),
    (5, 'petit', 'ethan', 'ethan.petit@example.com', '$2b$10$hashedpasswordethan...', '0633344455', 'représentant des ventes', 2, NOW(), NOW()),
    (6, 'chaussoy', 'jean-francois', 'docjef62@gmail.com', '$2b$10$hashedpasswordecto...', '0658825316', 'administrateur', 1, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Ajustement de la séquence pour "Users"
SELECT setval(pg_get_serial_sequence('"Users"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Users";

---------------------------
-- 5.3 Seeding de la table "Companies"
---------------------------
INSERT INTO "Companies" 
    (id, name, address, city, postal_code, created_by, created_at, updated_at)
VALUES
    (1, 'Cantine Scolaire Paris', '1 rue Paris', 'Paris', '75000', 1, NOW(), NOW()),
    (2, 'Cantine Verte Lyon', '2 rue Lyon', 'Lyon', '69000', 2, NOW(), NOW()),
    (3, 'Cantine Gourmet Marseille', '3 rue Marseille', 'Marseille', '13000', 3, NOW(), NOW()),
    (4, 'Cantine Innovante Bordeaux', '4 rue Bordeaux', 'Bordeaux', '33000', 4, NOW(), NOW()),
    (5, 'Cantine Durable Nantes', '5 rue Nantes', 'Nantes', '44000', 5, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Ajustement de la séquence pour "Companies"
SELECT setval(pg_get_serial_sequence('"Companies"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Companies";

---------------------------
-- 5.4 Seeding de la table "Interlocutors"
---------------------------
INSERT INTO "Interlocutors"
    (id, last_name, first_name, email, phone, position, interlocutor_type, comment, is_principal, is_independent, user_id, primary_company_id, created_at, updated_at)
VALUES 
    (1, 'leclerc', 'marie', 'marie.leclerc@cantinesparis.com', '0612345678', 'responsable', 'client potentiel', 'Interlocuteur principal pour Paris', TRUE, FALSE, 1, 1, NOW(), NOW()),
    (2, 'moreau', 'jean', 'jean.moreau@cantineverte.com', '0698765432', 'responsable', 'client potentiel', 'Interlocuteur principal pour Cantine Verte Lyon', TRUE, FALSE, 2, 2, NOW(), NOW()),
    (3, 'petit', 'lucie', 'lucie.petit@cantinegourmet.com', '0687654321', 'responsable', 'client potentiel', 'Interlocuteur principal pour Cantine Gourmet Marseille', TRUE, FALSE, 3, 3, NOW(), NOW()),
    (4, 'bernard', 'sophie', 'sophie.bernard@cantineinnovante.com', '0676543210', 'responsable', 'client potentiel', 'Interlocuteur principal pour Cantine Innovante Bordeaux', TRUE, FALSE, 4, 4, NOW(), NOW()),
    (5, 'roux', 'thomas', 'thomas.roux@cantinedurable.com', '0654321098', 'responsable', 'client potentiel', 'Interlocuteur principal pour Cantine Durable Nantes', TRUE, FALSE, 5, 5, NOW(), NOW()),
    (6, 'indépendant', 'alice', 'independent1@example.com', '0644455666', 'consultante', 'client potentiel', 'Interlocuteur indépendant sans entreprise associée', FALSE, TRUE, 1, NULL, NOW(), NOW()),
    (7, 'indépendant', 'bob', 'independent2@example.com', '0655566778', 'consultant', 'client potentiel', 'Interlocuteur indépendant sans entreprise associée', FALSE, TRUE, 2, NULL, NOW(), NOW()),
    (8, 'test', 'interlocutor1', 'test.interlocutor1@example.com', '0611122233', 'testeur', 'client potentiel', 'Interlocuteur de test assigné à l''admin', TRUE, FALSE, 1, NULL, NOW(), NOW())
ON CONFLICT (email, user_id) DO NOTHING;

-- Ajustement de la séquence pour "Interlocutors"
SELECT setval(pg_get_serial_sequence('"Interlocutors"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Interlocutors";

---------------------------
-- 5.4.a Seeding de la table "Interlocutors_Companies"
---------------------------
INSERT INTO "Interlocutors_Companies" ("interlocutor_id", "company_id", "is_principal", "created_at", "updated_at")
VALUES 
    (1, 1, TRUE, NOW(), NOW()),
    (2, 2, TRUE, NOW(), NOW()),
    (3, 3, TRUE, NOW(), NOW()),
    (4, 4, TRUE, NOW(), NOW()),
    (5, 5, TRUE, NOW(), NOW())
ON CONFLICT ("interlocutor_id", "company_id") DO NOTHING;

---------------------------
-- 5.4.b Seeding de la table "Users_Interlocutors"
---------------------------
INSERT INTO "Users_Interlocutors" (
    "user_id",
    "interlocutor_id",
    "is_principal",
    "created_at",
    "updated_at"
)
VALUES 
    -- Relations pour l'utilisateur 1 (alice.dupont@example.com)
    (1, 1, true, NOW(), NOW()),
    (1, 6, false, NOW(), NOW()),
    (1, 8, false, NOW(), NOW()),
    
    -- Relations pour l'utilisateur 2 (bob.martin@example.com)
    (2, 2, true, NOW(), NOW()),
    (2, 7, false, NOW(), NOW()),
    
    -- Relations pour les autres utilisateurs
    (3, 3, true, NOW(), NOW()),
    (4, 4, true, NOW(), NOW()),
    (5, 5, true, NOW(), NOW())
ON CONFLICT ("user_id", "interlocutor_id") DO NOTHING;

---------------------------
-- 5.5 Seeding de la table "Functionings"
---------------------------
INSERT INTO "Functionings" ("id", "company_id", "type_of_functioning", "created_at", "updated_at")
VALUES
    (1, 1, 'autonome', NOW(), NOW()),
    (2, 2, 'en régie centrale', NOW(), NOW()),
    (3, 3, 'délégation', NOW(), NOW()),
    (4, 4, 'autonome', NOW(), NOW()),
    (5, 5, 'en régie centrale', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Functionings"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Functionings";

---------------------------
-- 5.6 Seeding de la table "Simulations"
---------------------------
INSERT INTO "Simulations" 
    ("id", "user_id", "company_id", "cost_per_dish", "dishes_per_day", "waste_percentage", 
     "daily_production_savings", "monthly_production_savings", 
     "daily_waste_savings", "monthly_waste_savings", "status", "created_by", "assigned_to", "created_at", "updated_at")
VALUES 
    (1, 1, 1, 3.0, 1500, 24.0, 302.4, 6048.0, 672.0, 13440.0, 'projet', 1, 1, NOW(), NOW()),
    (2, 2, 2, 2.5, 2000, 18.0, 500.00, 9000.00, 360.00, 6480.00, 'projet', 2, 2, NOW(), NOW()),
    (3, 3, 3, 3.2, 1200, 25.0, 384.00, 6912.00, 450.00, 8100.00, 'projet', 3, 3, NOW(), NOW()),
    (4, 4, 4, 2.9, 1800, 22.0, 500.40, 9007.20, 356.40, 6415.20, 'projet', 4, 4, NOW(), NOW()),
    (5, 5, 5, 3.5, 1600, 19.5, 504.00, 9072.00, 340.20, 6123.60, 'projet', 5, 5, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Simulations"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Simulations";

---------------------------
-- 5.7 Seeding de la table "Equipments" et "Options"
---------------------------
ALTER TABLE "Equipments" ADD COLUMN IF NOT EXISTS "category_id" INTEGER;
ALTER TABLE "Options" ADD COLUMN IF NOT EXISTS "category_id" INTEGER;

-- Catégories pour équipements
INSERT INTO "Equipment_Categories" ("name", "description", "is_default")
VALUES ('Non catégorisé', 'Équipements sans catégorie spécifique', true),
       ('Écrans', 'Écrans pour information et interaction', false),
       ('Sécurité', 'Équipements de sécurité', false),
       ('Supports', 'Supports pour caméras et autres équipements', false),
       ('Télévisions', 'Télévisions intelligentes', false),
       ('Déchets', 'Équipements de gestion des déchets', false),
       ('Meubles', 'Meubles pour équipements connectés', false),
       ('Goodies', 'Articles promotionnels', false)
ON CONFLICT ("name") DO UPDATE 
    SET is_default = EXCLUDED.is_default,
        description = EXCLUDED.description;

-- Catégories pour options
INSERT INTO "Option_Categories" ("name", "description", "is_default")
VALUES ('Non catégorisé', 'Options sans catégorie spécifique', true),
       ('Communication', 'Options pour la communication', false),
       ('Maintenance', 'Options de maintenance et support', false),
       ('Formation', 'Options de formation', false)
ON CONFLICT ("name") DO UPDATE 
    SET is_default = EXCLUDED.is_default,
        description = EXCLUDED.description;

-- Équipements
INSERT INTO "Equipments" ("id", "name", "description", "price_ttc", "price_ht", "category_id", "created_at", "updated_at")
VALUES 
    (1, 'Écran LCD 32 pouces', 'Affichage de menus et informations', 200.00, 166.67, (SELECT id FROM "Equipment_Categories" WHERE name = 'Écrans'), NOW(), NOW()),
    (2, 'Caméra IP', 'Surveillance de base', 100.00, 83.33, (SELECT id FROM "Equipment_Categories" WHERE name = 'Sécurité'), NOW(), NOW()),
    (3, 'Support mural pour caméra', 'Installation simple', 25.00, 20.83, (SELECT id FROM "Equipment_Categories" WHERE name = 'Supports'), NOW(), NOW()),
    (4, 'Smart TV avec Google Play', 'Applications éducatives', 400.00, 333.33, (SELECT id FROM "Equipment_Categories" WHERE name = 'Télévisions'), NOW(), NOW()),
    (5, 'Poubelle connectée', 'Tri des déchets avec capteur de poids', 150.00, 125.00, (SELECT id FROM "Equipment_Categories" WHERE name = 'Déchets'), NOW(), NOW()),
    (6, 'Écran 4K 55 pouces', 'Qualité visuelle supérieure', 500.00, 416.67, (SELECT id FROM "Equipment_Categories" WHERE name = 'Écrans'), NOW(), NOW()),
    (7, 'Kit de thermomètres connectés', 'Surveillance continue de la température', 200.00, 166.67, (SELECT id FROM "Equipment_Categories" WHERE name = 'Sécurité'), NOW(), NOW()),
    (8, 'Support de plafond pour caméra sur batterie', 'Moins de contrainte d''installation', 100.00, 83.33, (SELECT id FROM "Equipment_Categories" WHERE name = 'Supports'), NOW(), NOW()),
    (9, 'Télévision avec Google Play', 'Diffusion de contenus éducatifs', 300.00, 250.00, (SELECT id FROM "Equipment_Categories" WHERE name = 'Télévisions'), NOW(), NOW()),
    (10, 'Poubelle XXL', 'Contenance plus grande', 250.00, 208.33, (SELECT id FROM "Equipment_Categories" WHERE name = 'Déchets'), NOW(), NOW()),
    (11, 'Meuble pour poubelle connectée', 'Intégration esthétique', 150.00, 125.00, (SELECT id FROM "Equipment_Categories" WHERE name = 'Meubles'), NOW(), NOW()),
    (12, 'Casquette Welleat', 'Casquette avec logo de Welleat', 5.00, 4.17, (SELECT id FROM "Equipment_Categories" WHERE name = 'Goodies'), NOW(), NOW()),
    (13, 'Porte-clés en silicone', 'Porte-clés avec logo de Welleat', 2.00, 1.67, (SELECT id FROM "Equipment_Categories" WHERE name = 'Goodies'), NOW(), NOW()),
    (14, 'Crayons personnalisés', 'Crayons avec le nom de l''école avec le logo Welleat', 1.00, 0.83, (SELECT id FROM "Equipment_Categories" WHERE name = 'Goodies'), NOW(), NOW()),
    (15, 'Peluches Welleat', 'Peluches représentant des fruits ou légumes', 10.00, 8.33, (SELECT id FROM "Equipment_Categories" WHERE name = 'Goodies'), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Options (sans les anciens "options équipement")
INSERT INTO "Options" ("id", "name", "description", "price_ttc", "price_ht", "category_id", "created_at", "updated_at")
VALUES 
    (1, 'Portail Parents-Établissement', 'Plateforme pour communiquer les menus, horaires, et informations importantes aux parents', 500.00, 416.67, (SELECT id FROM "Option_Categories" WHERE name = 'Communication'), NOW(), NOW()),
    (2, 'Système de Notification', 'Alertes automatiques pour les parents sur le menu de la journée, semaine, etc., avec détails alimentaires et ce que l''enfant a mangé (quantité, gaspillage)', 300.00, 250.00, (SELECT id FROM "Option_Categories" WHERE name = 'Communication'), NOW(), NOW()),
    (3, 'Portail pour Producteurs Locaux', 'Plateforme pour connecter les producteurs locaux avec l''établissement, incluant maintenance', 200.00, 166.67, (SELECT id FROM "Option_Categories" WHERE name = 'Communication'), NOW(), NOW()),
    (4, 'Formation du Personnel', 'Programmes de formation pour le nouveau personnel', 150.00, 125.00, (SELECT id FROM "Option_Categories" WHERE name = 'Formation'), NOW(), NOW()),
    (5, 'Amélioration Continue', 'Mises à jour et personnalisations sur mesure du logiciel pour améliorations continues', 400.00, 333.33, (SELECT id FROM "Option_Categories" WHERE name = 'Maintenance'), NOW(), NOW()),
    (6, 'Assurance Casse', 'Couverture pour le remplacement ou réparation en cas de dommages accidentels aux équipements', 250.00, 208.33, (SELECT id FROM "Option_Categories" WHERE name = 'Maintenance'), NOW(), NOW()),
    (7, 'Remplacement Matériel', 'Service de remplacement rapide pour les équipements défectueux ou endommagés', 150.00, 125.00, (SELECT id FROM "Option_Categories" WHERE name = 'Maintenance'), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Formules
INSERT INTO "Formulas" ("id", "name", "description", "price_ht")
VALUES 
    (1, 'Formule Basique', 'Équipement et options de base pour les cantines scolaires', 1500.00),
    (2, 'Formule Avancée', 'Équipement et options avancés pour une meilleure gestion des cantines', 3000.00)
ON CONFLICT (id) DO NOTHING;

-- Association des équipements aux formules
INSERT INTO "Formula_Equipments" ("formula_id", "equipment_id")
VALUES 
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11),
    (1, 12), (1, 13), (1, 14), (1, 15), -- Goodies dans la formule basique
    (2, 12), (2, 13), (2, 14), (2, 15)  -- Goodies dans la formule avancée
ON CONFLICT ("formula_id", "equipment_id") DO NOTHING;

-- Association des options aux formules
INSERT INTO "Formula_Options" ("formula_id", "option_id")
VALUES 
    (1, 1), (1, 2),
    (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7)
ON CONFLICT ("formula_id", "option_id") DO NOTHING;

-- Ajustement des séquences pour "Equipments" et "Options"
SELECT setval(pg_get_serial_sequence('"Equipments"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Equipments";
SELECT setval(pg_get_serial_sequence('"Options"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Options";

---------------------------
-- 5.8 Seeding de la table "Quotes"
---------------------------
INSERT INTO "Quotes" (
    id, user_id, company_id, status, valid_until,
    engagement_duration, formula_id,
    created_at, updated_at
)
VALUES 
    (1, 1, 1, 'projet', NOW() + INTERVAL '30 days', 12, 1, NOW(), NOW()),
    (2, 2, 2, 'projet', NOW() + INTERVAL '30 days', 24, 1, NOW(), NOW()),
    (3, 3, 3, 'projet', NOW() + INTERVAL '30 days', 36, 1, NOW(), NOW()),
    (4, 4, 4, 'projet', NOW() + INTERVAL '30 days', 36, 1, NOW(), NOW()),
    (5, 5, 5, 'projet', NOW() + INTERVAL '30 days', 36, 1, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('"Quotes"', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM "Quotes";

---------------------------
-- 5.9 Seeding de la table "Quotes_Interlocutors"
---------------------------
INSERT INTO "Quotes_Interlocutors" (
    quote_id, interlocutor_id, is_primary,
    created_at, updated_at
)
SELECT 
    q.id, ic.interlocutor_id, TRUE,
    NOW(), NOW()
FROM "Quotes" q
JOIN "Interlocutors_Companies" ic ON q.company_id = ic.company_id
WHERE ic.is_principal = TRUE
ON CONFLICT ("quote_id", "interlocutor_id") DO NOTHING;

---------------------------
-- 5.10 Attribution des Permissions
---------------------------
GRANT ALL PRIVILEGES ON TABLE 
    "Users", "Companies", "Simulations", "Roles", "Interlocutors", 
    "Functionings", "Interlocutors_Companies", "Users_Interlocutors", 
    "Quotes", "Quotes_Equipments", "Equipments", "Options"
    TO admin_welleat_salessync;

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO admin_welleat_salessync;

---------------------------
-- 5.11 Création des Index pour Optimiser les Requêtes
---------------------------
CREATE INDEX IF NOT EXISTS idx_interlocutors_email ON "Interlocutors" ("email");
CREATE INDEX IF NOT EXISTS idx_interlocutors_companies_principal ON "Interlocutors_Companies" ("company_id", "is_principal");
CREATE INDEX IF NOT EXISTS idx_quotes_status ON "Quotes" ("status");
CREATE INDEX IF NOT EXISTS idx_quotes_valid_until ON "Quotes" ("valid_until");
CREATE INDEX IF NOT EXISTS idx_quotes_equipments_quote_id ON "Quotes_Equipments" ("quote_id");
CREATE INDEX IF NOT EXISTS idx_quotes_equipments_equipment_id ON "Quotes_Equipments" ("equipment_id");

COMMIT;