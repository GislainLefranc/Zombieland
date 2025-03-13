-- Dossier : database
-- Fichier : create_database.sql
-- Configuration de la base de données pour le projet Welleat

BEGIN;

    -----------------------------------------------------------------------
    -- Suppression complète des triggers, fonctions et tables existantes
    -----------------------------------------------------------------------
    -- Suppression des triggers
    DROP TRIGGER IF EXISTS reassign_option_category ON "Option_Categories";
    DROP TRIGGER IF EXISTS protect_default_option_category ON "Option_Categories";
    DROP TRIGGER IF EXISTS reassign_equipment_category ON "Equipment_Categories";
    DROP TRIGGER IF EXISTS protect_default_equipment_category ON "Equipment_Categories";

    -- Suppression des fonctions
    DROP FUNCTION IF EXISTS reassign_category();
    DROP FUNCTION IF EXISTS prevent_default_category_deletion();

    -- Suppression des tables existantes (on repart d'une base vierge)
    DROP TABLE IF EXISTS 
        "Formula_Equipments", 
        "Quotes_Options", 
        "Formula_Options", 
        "Quotes_Equipments", 
        "Quotes", 
        "Options", 
        "Equipments", 
        "Simulations", 
        "Formulas", 
        "Functionings", 
        "Interlocutors_Users", 
        "Interlocutors_Companies", 
        "Users_Interlocutors",
        "Users_Companies", 
        "Interlocutors", 
        "Companies", 
        "Users", 
        "Roles" 
    CASCADE;

    ---------------------------------
    -- Création des tables de base
    ---------------------------------
    CREATE TABLE "Roles" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL UNIQUE,
        "description" VARCHAR(255),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );

    CREATE TABLE "Users" (
        "id" SERIAL PRIMARY KEY,
        "last_name" VARCHAR(255) NOT NULL,
        "first_name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "phone" VARCHAR(50),
        "position" VARCHAR(255),
        "role_id" INTEGER NOT NULL REFERENCES "Roles" ("id"),
        CONSTRAINT user_email_check CHECK ("email" LIKE '%@%'),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "reset_password_token" VARCHAR(255),
        "reset_password_expires" TIMESTAMP WITH TIME ZONE,
        "deleted_at" TIMESTAMP WITH TIME ZONE
    );

    CREATE TABLE "Companies" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "comments" TEXT,
    "establishment_type" TEXT NOT NULL DEFAULT 'client potentiel',
    "organization_type" TEXT NOT NULL DEFAULT 'Non spécifique',
    "number_of_canteens" INTEGER NOT NULL DEFAULT 0,
    "number_of_central_kitchens" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL,
    "assigned_to" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

    CREATE TABLE "Interlocutors" (
    "id" SERIAL PRIMARY KEY,
    "last_name" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "position" VARCHAR(255),
    "interlocutor_type" VARCHAR(50) NOT NULL DEFAULT 'client potentiel'
        CHECK ("interlocutor_type" IN ('client potentiel', 'partenaire', 'fournisseur')),
    "comment" TEXT,
    "is_principal" BOOLEAN DEFAULT FALSE,
    "is_independent" BOOLEAN DEFAULT FALSE,
    "user_id" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL,
    "primary_company_id" INTEGER REFERENCES "Companies" ("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP WITH TIME ZONE
);

    ALTER TABLE "Interlocutors"
        ADD CONSTRAINT "unique_user_email" UNIQUE ("user_id", "email");

    CREATE TABLE "Interlocutors_Companies" (
        "interlocutor_id" INTEGER REFERENCES "Interlocutors" ("id") ON DELETE CASCADE,
        "company_id" INTEGER REFERENCES "Companies" ("id") ON DELETE CASCADE,
        "is_principal" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("interlocutor_id", "company_id")
    );

    CREATE TABLE "Users_Companies" (
        "user_id" INTEGER REFERENCES "Users" ("id") ON DELETE CASCADE,
        "company_id" INTEGER REFERENCES "Companies" ("id") ON DELETE CASCADE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("user_id", "company_id")
    );

    CREATE TABLE IF NOT EXISTS "Users_Interlocutors" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "Users"("id") ON DELETE CASCADE,
        "interlocutor_id" INTEGER REFERENCES "Interlocutors"("id") ON DELETE CASCADE,
        "is_principal" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("user_id", "interlocutor_id")
    );

    CREATE TABLE "Functionings" (
        "id" SERIAL PRIMARY KEY,
        "company_id" INTEGER NOT NULL REFERENCES "Companies" ("id") ON DELETE CASCADE,
        "type_of_functioning" TEXT NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE "Formulas" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "price_ht" DECIMAL(10, 2) NOT NULL,
        "installation_price" DECIMAL(10, 2) DEFAULT 0.00,
        "maintenance_price" DECIMAL(10, 2) DEFAULT 0.00,
        "hotline_price" DECIMAL(10, 2) DEFAULT 0.00,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO "Formulas" (
        "id", "name", "description", "price_ht",
        "installation_price", "maintenance_price", "hotline_price",
        "created_at", "updated_at"
    )
    VALUES
        (1, 'Standard', 'Formule standard avec options de base', 833.33, 200.00, 150.00, 50.00, NOW(), NOW());

    CREATE TABLE "Simulations" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL,
    "company_id" INTEGER REFERENCES "Companies" ("id") ON DELETE SET NULL,
    "cost_per_dish" DECIMAL(10, 2) NOT NULL DEFAULT 2.8,
    "dishes_per_day" INTEGER NOT NULL DEFAULT 1000,
    "waste_percentage" DECIMAL(5, 2) NOT NULL DEFAULT 24,
    "daily_production_savings" DECIMAL(10, 2) NOT NULL,
    "monthly_production_savings" DECIMAL(10, 2) NOT NULL,
    "daily_waste_savings" DECIMAL(10, 2) NOT NULL,
    "monthly_waste_savings" DECIMAL(10, 2) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'projet'
        CHECK ("status" IN ('projet', 'en attente', 'approuvé', 'rejeté')),
    "created_by" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL,
    "assigned_to" INTEGER REFERENCES "Users" ("id") ON DELETE SET NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

    ---------------------------------
    -- Création des tables de catégories
    ---------------------------------

    -- Table Equipment_Categories avec colonne is_default
    CREATE TABLE "Equipment_Categories" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(50) NOT NULL UNIQUE,
        "description" TEXT,
        "is_default" BOOLEAN NOT NULL DEFAULT FALSE,  -- Valeur par défaut définie
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Table Option_Categories avec colonne is_default
    CREATE TABLE "Option_Categories" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(50) NOT NULL UNIQUE,
        "description" TEXT,
        "is_default" BOOLEAN NOT NULL DEFAULT FALSE,  -- Valeur par défaut définie
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    ---------------------------------
    -- Insertion des catégories par défaut
    ---------------------------------

    -- Pour Equipment_Categories
    INSERT INTO "Equipment_Categories" ("name", "description", "is_default") 
    VALUES ('Non catégorisé', 'Équipements sans catégorie spécifique', true)
    ON CONFLICT ("name") DO UPDATE 
        SET is_default = true,
            description = 'Équipements sans catégorie spécifique';

    -- Pour Option_Categories
    -- Suppression d'éventuelles catégories inutiles (installation, maintenance, hotline)
    DELETE FROM "Option_Categories" WHERE name IN ('installation', 'maintenance', 'hotline');

    INSERT INTO "Option_Categories" ("name", "description", "is_default") 
    VALUES ('Non catégorisé', 'Options sans catégorie spécifique', true)
    ON CONFLICT ("name") DO UPDATE 
        SET is_default = true,
            description = 'Options sans catégorie spécifique';

    ---------------------------------
    -- Création des tables dépendantes
    ---------------------------------

    CREATE TABLE "Equipments" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "free_equipment" BOOLEAN DEFAULT FALSE,
        "price_ttc" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "price_ht" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "notes" TEXT,
        "discount_type" VARCHAR(20),
        "discount_value" DECIMAL(10,2),
        "discount_reason" VARCHAR(255),
        "formula_compatible" BOOLEAN DEFAULT TRUE,
        "formula_discount" DECIMAL(10, 2) DEFAULT 0.00,
        "image" VARCHAR(255),
        "category_id" INTEGER REFERENCES "Equipment_Categories"("id"),
        "is_default" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE "Options" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "price_ttc" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "price_ht" DECIMAL(10, 2) NOT NULL,
        "category_id" INTEGER REFERENCES "Option_Categories"("id"),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE "Quotes" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "Users"("id"),
        "company_id" INTEGER REFERENCES "Companies"("id") ON DELETE SET NULL,
        "status" VARCHAR(20) DEFAULT 'projet'
            CHECK (status IN ('projet', 'accepté', 'refusé', 'en_cours', 'terminé')),
        "valid_until" TIMESTAMP WITH TIME ZONE,
        "engagement_duration" INTEGER NOT NULL,
        "formula_id" INTEGER REFERENCES "Formulas"("id") ON DELETE SET NULL,
        "installation_included" BOOLEAN DEFAULT TRUE,
        "maintenance_included" BOOLEAN DEFAULT TRUE,
        "hotline_included" BOOLEAN DEFAULT TRUE,
        "notes" TEXT,
        "discount_type" VARCHAR(20),
        "discount_value" DECIMAL(10, 2),
        "discount_reason" VARCHAR(255),
        "rejection_reason" VARCHAR(255),
        "tax_rate" DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
        "installation_price" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "maintenance_price" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "hotline_price" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "total_ht" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "total_ttc" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        "formula_options" JSONB,
        "formula_customizations" JSONB,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE "Quotes_Interlocutors" (
        "quote_id" INTEGER REFERENCES "Quotes"("id") ON DELETE CASCADE,
        "interlocutor_id" INTEGER REFERENCES "Interlocutors"("id") ON DELETE CASCADE,
        "is_primary" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("quote_id", "interlocutor_id")
    );

    CREATE TABLE "Quotes_Equipments" (
        "quote_id" INTEGER REFERENCES "Quotes"("id") ON DELETE CASCADE,
        "equipment_id" INTEGER REFERENCES "Equipments"("id") ON DELETE CASCADE,
        "quantity" INTEGER DEFAULT 1,
        "unit_price_ht" DECIMAL(10, 2) DEFAULT 0.00,
        "unit_price_ttc" DECIMAL(10, 2) DEFAULT 0.00,
        "is_first_unit_free" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("quote_id", "equipment_id")
    );

    CREATE TABLE "Formula_Options" (
        "formula_id" INTEGER REFERENCES "Formulas"("id") ON DELETE CASCADE,
        "option_id" INTEGER REFERENCES "Options"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("formula_id", "option_id")
    );

    CREATE TABLE "Quotes_Options" (
        "quote_id" INTEGER REFERENCES "Quotes"("id") ON DELETE CASCADE,
        "option_id" INTEGER REFERENCES "Options"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("quote_id", "option_id")
    );

    CREATE TABLE "Formula_Equipments" (
        "formula_id" INTEGER REFERENCES "Formulas"("id") ON DELETE CASCADE,
        "equipment_id" INTEGER REFERENCES "Equipments"("id") ON DELETE CASCADE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("formula_id", "equipment_id")
    );

    ---------------------------------
    -- Ajout des index manquants
    ---------------------------------
    -- Index sur la table Quotes
    CREATE INDEX "idx_quotes_company" ON "Quotes"("company_id");
    CREATE INDEX "idx_quotes_user" ON "Quotes"("user_id");
    CREATE INDEX "idx_quotes_status" ON "Quotes"("status");

    -- Index sur la table Interlocutors
    CREATE INDEX "idx_interlocutors_company" ON "Interlocutors"("primary_company_id");

    -- Index sur la table Quotes_Interlocutors
    CREATE INDEX "idx_quotes_interlocutors_quote" ON "Quotes_Interlocutors"("quote_id");
    CREATE INDEX "idx_quotes_interlocutors_interlocutor" ON "Quotes_Interlocutors"("interlocutor_id");
    CREATE INDEX "idx_quotes_interlocutors_primary" ON "Quotes_Interlocutors"("quote_id", "is_primary");

    -- Index sur la table Simulations
    CREATE INDEX "idx_simulations_user" ON "Simulations"("user_id");
    CREATE INDEX "idx_simulations_company" ON "Simulations"("company_id");
    CREATE INDEX "idx_simulations_status" ON "Simulations"("status");

    -- Index sur la table Equipments
    CREATE INDEX "idx_equipments_category" ON "Equipments"("category_id");

    -- Index sur la table Options
    CREATE INDEX "idx_options_category" ON "Options"("category_id");

    -- Index sur la table Users
    CREATE INDEX "idx_users_role" ON "Users"("role_id");

    -- Index sur la table Companies
    CREATE INDEX "idx_companies_created_by" ON "Companies"("created_by");
    CREATE INDEX "idx_companies_assigned_to" ON "Companies"("assigned_to");

    -- Index sur la table Formulas
    CREATE INDEX "idx_formulas_name" ON "Formulas"("name");

    -- Ajoutez ici d'autres index nécessaires selon vos besoins spécifiques

    --------------------------------------------------
    -- Ajustements sur les tables existantes
    --------------------------------------------------
    ALTER TABLE "Equipments" 
        ADD COLUMN IF NOT EXISTS "is_default" BOOLEAN DEFAULT FALSE;

    ALTER TABLE "Equipments" 
        ALTER COLUMN "category_id" DROP NOT NULL;

COMMIT;
