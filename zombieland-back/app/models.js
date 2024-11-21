import client from "./sequelize.js";
import User from "./models/User.js";
import Role from "./models/Role.js";
import Category from "./models/Category.js";
import Activity from "./models/Activity.js";
import Multimedia from "./models/Multimedia.js";
import Reservation from "./models/Reservation.js";
import Review from "./models/Review.js";
import Payment from "./models/Payment.js";
import Period from "./models/Period.js";

// One-to-Many relationship between Role and User
//A role has many users
Role.hasMany(User, {
    foreignKey: 'role_id'
});
//but a user can only have one role
User.belongsTo(Role, {
    foreignKey: 'role_id'
});

// One-to-Many relationship between Category and Activity
//A category has many activity
Category.hasMany(Activity, {
    foreignKey: 'category_id'
});
//an activity belongs to at least one category
Activity.belongsTo(Category, {
    foreignKey: 'category_id'
});

//Many to many relationships
//Activity can have 0 or many multimedia
Activity.belongsToMany(Multimedia, {
    through: 'activity_multimedia',
    foreignKey: 'activity_id',
    otherKey: 'multimedia_id',
    as: 'multimedias'
});

// Multimedia can be related to 0 or many activities
Multimedia.belongsToMany(Activity, {
    through: 'activity_multimedia',
    foreignKey: 'multimedia_id',
    otherKey: 'activity_id'
});


// One-to-Many relationships
//a user can have many reservation
User.hasMany(Reservation, {
    foreignKey: 'user_id'
});
//but a reservation can only have one user
Reservation.belongsTo(User, {
    foreignKey: 'user_id'
});

//A reservation has only one payment
Reservation.hasOne(Payment, {
    foreignKey: 'reservation_id'
});
//a payment is related to only one reservation
Payment.belongsTo(Reservation, {
    foreignKey: 'reservation_id'
});
//A reservation can only have one review
Reservation.hasOne(Review, {
    foreignKey: 'reservation_id'
});
//a review is linked to only one reservation
Review.belongsTo(Reservation, {
    foreignKey: 'reservation_id'
});
// a reservation is only linked to one period
Reservation.belongsTo(Period, {
    foreignKey: 'period_id'
});
//a period can have many reservations
Period.hasMany(Reservation, {
    foreignKey: 'period_id'
});

export {
    client,
    Activity,
    Review,
    Multimedia,
    User,
    Role,
    Payment,
    Reservation,
    Category,
    Period
};