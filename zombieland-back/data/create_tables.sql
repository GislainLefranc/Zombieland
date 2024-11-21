BEGIN;

DROP TABLE IF EXISTS 

CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "firstname" TEXT NOT NULL,
  "lastname" TEXT NOT NULL,
  "phone_number" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Role" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Category" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Activity" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category_id" INT REFERENCES Category(id) ON DELETE SET NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Multimedia" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Reservation" (
  "id" SERIAL PRIMARY KEY,
  "number_reservation" INT NOT NULL,
  "date_start" DATE NOT NULL,
  "date_end" DATE NOT NULL,
  "number_tickets" INT NOT NULL,
  "user_id" INT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Avis" (
  "id" SERIAL PRIMARY KEY,
  "note" INT CHECK (note >= 1 AND note <= 5),
  "comment" TEXT,
  "user_id" INT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "Payment" (
  "id" SERIAL PRIMARY KEY,
  "amount" DECIMAL(10, 2) NOT NULL,
  "status" TEXT,
  "date_amount" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "reservation_id" INT REFERENCES Reservation(id) ON DELETE SET NULL,
  "stripe_payment_id" TEXT UNIQUE NOT NULL -- ID du paiement Stripe pour la commande
);

CREATE TABLE "Period" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "date_start" DATE NOT NULL,
  "date_end" DATE NOT NULL,
  "price" DECIMAL(10, 2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- Tables de jointures --
CREATE TABLE "User_Role" (
  "user_id" INT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
  "role_id" INT NOT NULL REFERENCES Role(id) ON DELETE CASCADE
);

CREATE TABLE "Activity_Avis" (
  "activity_id" INT NOT NULL REFERENCES Activity(id) ON DELETE CASCADE,
  "avis_id" INT NOT NULL REFERENCES Avis(id) ON DELETE CASCADE
);

CREATE TABLE "Activity_Multimedia" (
  "activity_id" INT NOT NULL REFERENCES Activity(id) ON DELETE CASCADE,
  "multimedia_id" INT NOT NULL REFERENCES Multimedia(id) ON DELETE CASCADE
);

COMMIT;
