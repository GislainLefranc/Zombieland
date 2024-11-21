-- SQLBook: Code
BEGIN;

-- Insertion des données dans la table users
INSERT INTO "user" (role_id, firstname, lastname, phone_number, email, password, birthday, street_address, postal_code, city, created_at, updated_at) VALUES
(2, 'John', 'Doe', '1234567890', 'john.doe@example.com', 'password123', '1985-01-15', '123 Elm Street', '75001', 'Paris', now(), now()),
(2, 'Jane', 'Smith', '0987654321', 'jane.smith@example.fr', 'password456', '1990-03-22', '456 Oak Avenue', '69002', 'Lyon', now(), now()),
(2, 'Alice', 'Johnson', '1122334455', 'alice.johnson@example.com', 'password789', '1988-07-11', '789 Pine Lane', '33000', 'Bordeaux', now(), now()),
(3, 'Michael', 'Brown', '3344556677', 'michael.brown@example.fr', 'password321', '1982-12-03', '321 Maple Road', '13001', 'Marseille', now(), now()),
(2, 'Emily', 'Davis', '4455667788', 'emily.davis@example.com', 'password654', '1995-08-14', '654 Cedar Drive', '75002', 'Paris', now(), now()),
(2, 'David', 'Wilson', '5566778899', 'david.wilson@example.fr', 'password987', '1987-11-23', '987 Walnut Street', '31000', 'Toulouse', now(), now()),
(2, 'Sarah', 'Miller', '6677889900', 'sarah.miller@example.com', 'password432', '1993-04-10', '432 Birch Way', '75003', 'Paris', now(), now()),
(3, 'Chris', 'Anderson', '7788990011', 'chris.anderson@example.fr', 'password876', '1986-09-07', '876 Spruce Path', '69003', 'Lyon', now(), now()),
(2, 'Laura', 'Taylor', '8899001122', 'laura.taylor@example.com', 'password765', '1992-05-15', '765 Redwood Blvd', '75004', 'Paris', now(), now()),
(2, 'Daniel', 'Thomas', '9900112233', 'daniel.thomas@example.fr', 'password234', '1989-02-28', '234 Chestnut Ct', '34000', 'Montpellier', now(), now()),
(2, 'Jessica', 'Moore', '0011223344', 'jessica.moore@example.com', 'password567', '1994-06-18', '567 Palm Circle', '44000', 'Nantes', now(), now()),
(2, 'Matthew', 'Jackson', '1122334455', 'matthew.jackson@example.fr', 'password678', '1985-10-21', '678 Poplar Dr', '59000', 'Lille', now(), now()),
(2, 'Sophia', 'Martin', '2233445566', 'sophia.martin@example.com', 'password890', '1991-12-09', '890 Fir Terrace', '75005', 'Paris', now(), now()),
(2, 'Ethan', 'Garcia', '3344556677', 'ethan.garcia@example.fr', 'password901', '1988-03-03', '901 Magnolia St', '69004', 'Lyon', now(), now()),
(2, 'Olivia', 'Martinez', '4455667788', 'olivia.martinez@example.com', 'password1234', '1996-08-22', '1234 Ash Rd', '75006', 'Paris', now(), now()),
(3, 'Jacob', 'Hernandez', '5566778899', 'jacob.hernandez@example.fr', 'password345', '1993-11-19', '345 Elm St', '57000', 'Metz', now(), now()),
(2, 'Ava', 'Lopez', '6677889900', 'ava.lopez@example.com', 'password5678', '1987-07-30', '5678 Cedar Ln', '75007', 'Paris', now(), now()),
(2, 'Lucas', 'Gonzalez', '7788990011', 'lucas.gonzalez@example.fr', 'password8901', '1992-04-12', '8901 Maple Blvd', '69005', 'Lyon', now(), now()),
(2, 'Mia', 'Perez', '8899001122', 'mia.perez@example.com', 'password456', '1989-06-17', '456 Oak Dr', '34000', 'Montpellier', now(), now()),
(2, 'Mason', 'Clark', '9900112233', 'mason.clark@example.fr', 'password7890', '1991-10-26', '7890 Birch Ct', '31000', 'Toulouse', now(), now()),
(2, 'Sophia', 'Evans', '1122345566', 'sophia.evans@example.com', 'newpass1', '1990-02-15', '123 Lane', '75008', 'Paris', now(), now()),
(2, 'James', 'Harrison', '1122565566', 'james.harrison@example.fr', 'newpass2', '1993-08-18', '456 Drive', '69006', 'Lyon', now(), now()),
(3, 'Oliver', 'Scott', '9988776655', 'oliver.scott@example.com', 'newpass3', '1996-04-11', '987 Blvd', '34001', 'Montpellier', now(), now()),
(2, 'Amelia', 'Reed', '8877665544', 'amelia.reed@example.com', 'newpass4', '1992-03-20', '654 Elm Street', '75009', 'Paris', now(), now()),
(2, 'Elijah', 'Ward', '7766554433', 'elijah.ward@example.fr', 'newpass5', '1988-12-01', '321 Cedar Avenue', '69007', 'Lyon', now(), now()),
(2, 'Charlotte', 'Green', '6655443322', 'charlotte.green@example.com', 'newpass6', '1990-07-25', '890 Spruce Lane', '75010', 'Paris', now(), now()),
(2, 'Henry', 'Phillips', '5544332211', 'henry.phillips@example.fr', 'newpass7', '1994-05-14', '789 Maple Boulevard', '34002', 'Montpellier', now(), now()),
(2, 'Victoria', 'Campbell', '4433221100', 'victoria.campbell@example.com', 'newpass8', '1986-08-05', '456 Birch Road', '31001', 'Toulouse', now(), now()),
(3, 'Liam', 'Bennett', '3322110099', 'liam.bennett@example.fr', 'newpass9', '1989-03-17', '123 Oak Drive', '75011', 'Paris', now(), now()),
(2, 'Zoe', 'Rivera', '2211009988', 'zoe.rivera@example.com', 'newpass10', '1995-09-28', '654 Fir Terrace', '69008', 'Lyon', now(), now()),
(2, 'Lucas', 'Carter', '1100998877', 'lucas.carter@example.fr', 'newpass11', '1991-06-13', '432 Palm Boulevard', '57001', 'Metz', now(), now()),
(2, 'Ava', 'Mitchell', '9988777766', 'ava.mitchell@example.com', 'newpass12', '1993-01-29', '987 Redwood Lane', '75012', 'Paris', now(), now()),
(2, 'Daniel', 'Parker', '8877666655', 'daniel.parker@example.fr', 'newpass13', '1987-04-07', '678 Chestnut Court', '69009', 'Lyon', now(), now()),
(3, 'Emily', 'Collins', '7766555544', 'emily.collins@example.com', 'newpass14', '1985-10-19', '234 Ash Drive', '34003', 'Montpellier', now(), now()),
(2, 'Ethan', 'Stewart', '6655444433', 'ethan.stewart@example.fr', 'newpass15', '1992-11-04', '789 Birch Boulevard', '31002', 'Toulouse', now(), now()),
(2, 'Chloe', 'Howard', '5544333322', 'chloe.howard@example.com', 'newpass16', '1988-12-16', '567 Cedar Avenue', '75013', 'Paris', now(), now()),
(3, 'Sophia', 'Turner', '4433222211', 'sophia.turner@example.fr', 'newpass17', '1995-03-10', '123 Fir Lane', '69010', 'Lyon', now(), now()),
(2, 'Oliver', 'Morgan', '3322111100', 'oliver.morgan@example.com', 'newpass18', '1990-06-21', '321 Palm Boulevard', '57002', 'Metz', now(), now()),
(2, 'Harper', 'James', '2211000099', 'harper.james@example.fr', 'newpass19', '1991-09-14', '890 Redwood Terrace', '75014', 'Paris', now(), now()),
(2, 'Mason', 'Watson', '1100999988', 'mason.watson@example.com', 'newpass20', '1994-08-03', '654 Birch Court', '69011', 'Lyon', now(), now()),
(3, 'Isabella', 'Brooks', '9988777766', 'isabella.brooks@example.fr', 'newpass21', '1986-11-09', '432 Ash Drive', '34004', 'Montpellier', now(), now()),
(2, 'Benjamin', 'Kelly', '8877666655', 'benjamin.kelly@example.com', 'newpass22', '1989-01-25', '789 Cedar Avenue', '31003', 'Toulouse', now(), now()),
(2, 'Aiden', 'Sanders', '7766555544', 'aiden.sanders@example.fr', 'newpass23', '1993-04-22', '678 Fir Terrace', '75015', 'Paris', now(), now()),
(2, 'Lily', 'Reynolds', '6655444433', 'lily.reynolds@example.com', 'newpass24', '1992-07-18', '234 Palm Boulevard', '69012', 'Lyon', now(), now()),
(3, 'Ella', 'Foster', '5544333322', 'ella.foster@example.fr', 'newpass25', '1987-05-11', '567 Redwood Court', '75016', 'Paris', now(), now()),
(2, 'Jack', 'Hughes', '4433222211', 'jack.hughes@example.com', 'newpass26', '1991-12-30', '123 Chestnut Avenue', '57003', 'Metz', now(), now()),
(2, 'Aria', 'Long', '3322111100', 'aria.long@example.fr', 'newpass27', '1990-02-02', '321 Ash Lane', '69013', 'Lyon', now(), now()),
(2, 'Owen', 'Ross', '2211000099', 'owen.ross@example.com', 'newpass28', '1993-09-26', '890 Cedar Boulevard', '75017', 'Paris', now(), now()),
(3, 'Mia', 'Henderson', '1100999988', 'mia.henderson@example.fr', 'newpass29', '1985-11-15', '654 Fir Avenue', '34005', 'Montpellier', now(), now()),
(2, 'Layla', 'Cook', '9988777766', 'layla.cook@example.com', 'newpass30', '1994-05-08', '789 Palm Drive', '31004', 'Toulouse', now(), now());

-- Insertion des données dans la table role
INSERT INTO role (name, created_at, updated_at) VALUES
('Member', now(), now()),
('Admin', now(), now());


-- Insertion des données dans la table category
INSERT INTO category (name, created_at, updated_at) VALUES
('Aventures de Survie', now(), now()),
('Frissons et Horreur', now(), now()),
('Défense et Combat', now(), now()),
('Immersion Totale', now(), now()),
('Pause et Détente', now(), now()),

-- Insertion des données dans la table activity
INSERT INTO activity (title, description, category_id, created_at, updated_at) VALUES
('Survie en zone infectée', 'Parcourez un labyrinthe hanté, armez-vous de courage et d’un pistolet laser, et tentez d’échapper aux zombies à chaque tournant. Saurez-vous sortir indemne de la zone infectée ?', 1, now(), now()),
('L''évasion de la ville morte', 'Prisonnier d''une ville en ruines, résolvez des énigmes et travaillez en équipe pour échapper aux zombies avant que le temps ne s’écoule. Allez-vous trouver la sortie ?', 1, now(), now()),
('Train fantôme : L''apocalypse zombie', 'Montez à bord et plongez dans un voyage effrayant à travers une ville dévastée, où les zombies surgissent à chaque virage. Oserez-vous affronter la terreur de l’apocalypse ?', 2, now(), now()),
('Course de survie', 'Défiez vos limites dans une course semée d’obstacles où des zombies assoiffés de sang tenteront de vous capturer. Courez pour survivre !', 2, now(), now()),
('Tir au zombie', 'Armez-vous et testez votre précision ! Visez les zombies et montrez votre talent de tireur d’élite dans ce stand de tir terrifiant. Les zombies n’attendent que vous !', 2, now(), now()),
('Hôpital abandonné', 'Explorez un ancien hôpital envahi par des zombies assoiffés de chair fraîche. Couloirs sombres et frissons garantis : oserez-vous entrer ?', 2, now(), now()),
('Manège du chaos', 'Attachez-vous bien pour un grand huit apocalyptique à travers une ville en ruines, où zombies et chaos vous guettent à chaque virage !', 2, now(), now()),
('Zone de quarantaine', 'Entrez dans une zone sous haute surveillance où survivants et soldats vous partagent leurs histoires de survie. Une immersion totale dans l’horreur de l’épidémie zombie.', 2, now(), now()),
('Cimetière des revenants', 'Avec un casque VR, plongez dans un cimetière hanté et affrontez des zombies en réalité virtuelle. Parviendrez-vous à survivre dans cette aventure terrifiante ?', 2, now(), now()),
('Le dernier refuge', 'Reprenez des forces dans un bunker de survivants et savourez un repas dans un décor de dernier bastion face à l’apocalypse. Bienvenue au dernier refuge humain.', 2, now(), now()),
('Zombies vs. Survivants : Laser Game', 'Choisissez votre camp : survivants ou zombies ? Dans cette bataille épique en laser game, seuls les plus rapides et rusés sortiront victorieux !', 2, now(), now()),
('Projection : Film post-apocalyptique zombie en 4D', 'Vivez l''horreur d’un film de zombies en 4D, avec sièges mouvants et effets spéciaux pour une immersion totale. Préparez-vous à trembler d''effroi !', 2, now(), now()),
('L''attaque nocturne des zombies', 'Terminez la journée en beauté avec un spectacle spectaculaire où des hordes de zombies envahissent le parc. Effets spéciaux, pyrotechnie et frissons garantis !', 2, now(), now()),
('Atelier de maquillage zombie', 'Transformez-vous en véritable zombie grâce à nos maquilleurs professionnels. Rejoignez les morts-vivants et immortalisez l’instant !', 2, now(), now()),
('Séance photo avec les zombies', 'Capturez un souvenir inoubliable avec des zombies plus vrais que nature dans un décor apocalyptique. Oserez-vous sourire aux côtés des morts-vivants ?', 2, now(), now());

-- Insertion des données dans la table multimedia
INSERT INTO multimedia (name, url, created_at, updated_at) VALUES
('Survie en zone infectée', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1730731451/attraction1_dfvdqb.webp', now(), now()),
('L''évasion de la ville morte', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1730731450/attraction2_s3vjvu.webp', now(), now()),
('Train fantôme : L''apocalypse zombie', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923284/activities/ckxjnqbcvkgrsydhl6gd.webp', now(), now()),
('Course de survie', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923227/activities/c4avfjz5t3rz4jb2ilta.webp', now(), now()),
('Tir au zombie', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923395/activities/yhjrdx8yafupbwkjjtt6.webp', now(), now()),
('Hôpital abandonné', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923312/activities/zsxnemfskh9g0bjuocz0.webp', now(), now()),
('Manège du chaos', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1730731437/attraction7_nwvtfk.webp', now(), now()),
('Zone de quarantaine', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923247/activities/fymjiuaflgjnykdvtckh.webp', now(), now()),
('Cimetière des revenants', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923351/activities/zgtadctfmbbmnyy1mm9b.webp', now(), now()),
('Le dernier refuge', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1730731437/attraction10_gm2uag.webp', now(), now()),
('Zombies vs. Survivants : Laser Game', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923415/activities/jhn2lr7sxh9zfwmdsrfm.webp', now(), now()),
('Projection : Film post-apocalyptique zombie en 4D', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923374/activities/ndevpu172nplusxvsuns.webp', now(), now()),
('L''attaque nocturne des zombies', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923266/activities/f3wu8dhvheapdtd3v9hc.webp', now(), now()),
('Atelier de maquillage zombie', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923434/activities/x6pf907lrbetfx0sfxi2.webp', now(), now()),
('Séance photo avec les zombies', 'https://res.cloudinary.com/dxsrbmmgb/image/upload/v1731923452/activities/eh9k6wfxka7y7jhnkx3u.webp', now(), now());

-- Insertion des données dans la table reservation
INSERT INTO reservation (id, date_start, date_end, number_tickets, user_id, period_id, created_at, updated_at) VALUES
(1, '2025-03-10 00:00:00', '2025-03-11 00:00:00', 4, 3, 3, '2025-02-26 00:00:00', '2025-03-07 00:00:00'),
(2, '2025-07-14 00:00:00', '2025-07-18 00:00:00', 7, 80, 4, '2025-06-10 00:00:00', '2025-07-16 00:00:00'),
(3, '2025-03-21 00:00:00', '2025-03-24 00:00:00', 6, 80, 3, '2025-03-10 00:00:00', '2025-04-01 00:00:00'),
(4, '2025-02-27 00:00:00', '2025-02-28 00:00:00', 1, 3, 3, '2025-02-24 00:00:00', '2025-03-03 00:00:00'),
(5, '2025-06-07 00:00:00', '2025-06-12 00:00:00', 9, 3, 4, '2025-05-23 00:00:00', '2025-05-29 00:00:00'),
(6, '2025-08-24 00:00:00', '2025-08-26 00:00:00', 5, 3, 3, '2025-08-15 00:00:00', '2025-08-16 00:00:00'),
(7, '2025-03-25 00:00:00', '2025-03-30 00:00:00', 4, 3, 3, '2025-03-20 00:00:00', '2025-03-30 00:00:00'),
(8, '2025-07-18 00:00:00', '2025-07-19 00:00:00', 1, 80, 4, '2025-07-10 00:00:00', '2025-07-18 00:00:00'),
(9, '2025-07-27 00:00:00', '2025-07-29 00:00:00', 10, 80, 4, '2025-07-15 00:00:00', '2025-07-29 00:00:00'),
(10, '2025-06-09 00:00:00', '2025-06-10 00:00:00', 4, 3, 4, '2025-06-06 00:00:00', '2025-06-09 00:00:00'),
(11, '2024-09-02 00:00:00', '2024-09-03 00:00:00', 6, 23, 2, '2024-08-30 00:00:00', '2024-09-03 00:00:00'),
(12, '2025-02-28 00:00:00', '2025-03-01 00:00:00', 1, 23, 3, '2025-02-26 00:00:00', '2025-03-01 00:00:00'),
(13, '2024-12-31 00:00:00', '2025-01-03 00:00:00', 10, 3, 2, '2024-12-30 00:00:00', '2025-01-03 00:00:00'),
(14, '2024-11-21 00:00:00', '2024-11-25 00:00:00', 8, 3, 2, '2024-11-20 00:00:00', '2024-11-25 00:00:00'),
(15, '2024-10-29 00:00:00', '2024-11-02 00:00:00', 8, 3, 2, '2024-10-25 00:00:00', '2024-11-02 00:00:00'),
(16, '2025-04-16 00:00:00', '2025-04-19 00:00:00', 1, 23, 3, '2025-04-10 00:00:00', '2025-04-19 00:00:00'),
(17, '2025-02-12 00:00:00', '2025-02-16 00:00:00', 3, 3, 4, '2025-02-10 00:00:00', '2025-02-16 00:00:00'),
(18, '2025-07-08 00:00:00', '2025-07-12 00:00:00', 3, 80, 4, '2025-07-05 00:00:00', '2025-07-12 00:00:00'),
(19, '2025-07-10 00:00:00', '2025-07-14 00:00:00', 3, 80, 4, '2025-07-07 00:00:00', '2025-07-14 00:00:00'),
(20, '2025-01-01 00:00:00', '2025-01-04 00:00:00', 10, 23, 3, '2024-12-28 00:00:00', '2025-01-04 00:00:00');

-- Insertion des données dans la table avis
INSERT INTO review (note, comment, reservation_id, created_at, updated_at) VALUES
(5, 'Une expérience incroyable, parfaite pour se défouler entre potes après les cours !', 137, now(), now()),
(4, 'Les zombies sont super réalistes, j’y suis allé juste après le déjeuner, c’était parfait.', 138, now(), now()),
(3, 'Très immersif, mais je trouve que 18h, c’est un peu tôt pour fermer.', 139, now(), now()),
(5, 'Enfin un parc pensé pour les jeunes, on s’est éclatés !', 140, now(), now()),
(4, 'J’ai adoré l’ambiance en pleine journée, surtout les zones extérieures.', 141, now(), now()),
(5, 'Les attractions sont variées, et ça change des sorties habituelles.', 142, now(), now()),
(2, 'Un peu déçu qu’il n’y ait pas d’options pour les soirées, mais c’était bien quand même.', 143, now(), now()),
(3, 'Les zombies étaient top, mais il faudrait plus de snacks pour la pause de midi.', 144, now(), now()),
(4, 'L’ambiance est dingue, et les horaires conviennent bien aux étudiants.', 145, now(), now()),
(5, 'Le manoir hanté est la meilleure attraction, on y a passé presque toute l’après-midi.', 146, now(), now()),
(4, 'Les horaires sont parfaits pour profiter de la lumière du jour, super expérience.', 147, now(), now()),
(5, 'Une journée inoubliable, on en parle encore avec mes amis.', 148, now(), now()),
(3, 'Bien, mais ça manque d’options pour manger après les attractions.', 149, now(), now()),
(4, 'Les décors sont hyper réalistes, parfait pour une journée off.', 150, now(), now()),
(5, 'Le parcours est super bien pensé, surtout pour notre tranche d’âge.', 151, now(), now()),
(2, 'Je trouve que ça manque un peu d’activités calmes pour se reposer.', 152, now(), now()),
(5, 'J’ai adoré, surtout qu’on était entre jeunes, ça rend l’expérience encore plus cool.', 153, now(), now()),
(4, 'Super ambiance, mais ce serait encore mieux si ça ouvrait un peu plus tôt.', 154, now(), now()),
(3, 'L’entrée est un peu chère, mais ça reste une bonne activité pour une journée.', 155, now(), now()),
(5, 'Les effets spéciaux sont juste bluffants, surtout le matin quand il y a moins de monde.', 156, now(), now()),
(4, 'Le staff est super sympa, et les zombies jouent vraiment bien leur rôle.', 157, now(), now()),
(3, 'Bonne expérience, mais les pauses sont difficiles à gérer avec les horaires serrés.', 158, now(), now()),
(5, 'Idéal pour les jeunes adultes, on a tous adoré !', 159, now(), now()),
(4, 'Les scénarios des attractions sont vraiment bien adaptés pour notre âge.', 160, now(), now()),
(5, 'On a passé une journée de folie, merci pour ce parc original.', 161, now(), now()),
(3, 'Les attractions sont bonnes, mais ce serait bien d’avoir plus de choix en après-midi.', 162, now(), now()),
(4, 'Les horaires permettent de bien profiter, et le décor est au top.', 163, now(), now()),
(5, 'Une journée entière à hurler et à rire, on y retourne bientôt !', 164, now(), now()),
(4, 'Les zombies sont incroyables, dommage que ça ferme si tôt.', 165, now(), now()),
(3, 'Bonne ambiance, mais plus d’animations en fin d’après-midi seraient appréciées.', 166, now(), now()),
(5, 'Une des meilleures sorties entre amis, un moment inoubliable !', 167, now(), now()),
(4, 'Très bonne organisation, mais un peu de queue pour les attractions.', 168, now(), now()),
(5, 'Le manoir hanté et la forêt sont exceptionnels, bravo aux équipes.', 169, now(), now()),
(3, 'Bonne expérience, mais les prix des snacks sont un peu élevés.', 170, now(), now()),
(4, 'Ambiance immersive et très fun, parfait pour les amateurs de frissons.', 171, now(), now()),
(5, 'Une activité originale, tout est parfait du début à la fin.', 172, now(), now()),
(2, 'Les décors sont super, mais il faudrait plus de zones pour se poser.', 173, now(), now()),
(5, 'Les animations sont hyper réalistes, on reviendra avec plaisir.', 174, now(), now()),
(4, 'Parc vraiment génial, mais il manque des options pour les petits groupes.', 175, now(), now()),
(3, 'Un peu trop de monde en fin de journée, mais les attractions valent le détour.', 176, now(), now()),
(5, 'Expérience fantastique, un grand merci à toute l’équipe.', 177, now(), now()),
(4, 'J’ai adoré les zombies, mais il faudrait plus de zones ombragées.', 178, now(), now()),
(5, 'Une journée au top, j’ai recommandé à tous mes amis.', 179, now(), now()),
(3, 'Bonne ambiance, mais il manque une application pour mieux organiser sa visite.', 180, now(), now()),
(4, 'Un excellent moment, surtout grâce au manoir hanté.', 181, now(), now()),
(5, 'Les effets sont incroyables, et les acteurs font un travail remarquable.', 182, now(), now()),
(4, 'Super expérience, même pour les moins téméraires.', 183, now(), now()),
(5, 'Je suis venu avec des collègues, et tout le monde a adoré.', 184, now(), now()),
(3, 'Il faudrait plus de snacks disponibles, mais l’expérience reste positive.', 185, now(), now());


-- Insertion des données dans la table payment
INSERT INTO payment (amount, status, date_amount, reservation_id, stripe_payment_id) VALUES
(100.00, 'Completed', now(), 1, 'sp_abc123'),
(75.00, 'Completed', now(), 2, 'sp_def456'),
(50.00, 'Pending', now(), 3, 'sp_ghi789');

-- Insertion des données dans la table period
INSERT INTO period (name, date_start, date_end, price, created_at) VALUES
('Haute saison', '2024-08-31', '2024-12-31', 79.90, now()),
('Basse saison', '2024-01-01', '2025-05-30', 49.90, now()),
('Moyenne saison', '2025-05-31', '2025-08-31', 69.90, now());

-- Insertion des données dans la table de jointure activity_multimedia
INSERT INTO activity_multimedia (activity_id, multimedia_id, created_at, updated_at) VALUES
(32, 1, now(), now()),
(33, 2, now(), now()),
(34, 3, now(), now()),
(35, 5, now(), now()),
(36, 6, now(), now()),
(37, 7, now(), now()),
(38, 8, now(), now()),
(39, 9, now(), now()),
(40, 10, now(), now()),
(41, 11, now(), now()),
(42, 12, now(), now()),
(43, 13, now(), now()),
(44, 14, now(), now()),
(45, 15, now(), now()),
(46, 16, now(), now());

COMMIT;