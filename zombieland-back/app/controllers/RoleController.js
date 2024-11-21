import Role from "../models/Role.js";

/**
 * Give all roles in DB
 * @param {*} req
 * @param {*} res
 * @return {Array} of Role object
 */
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();

        if (!roles.length) {
            return res.status(404).json({message: 'Aucun utilisateur trouvé'});
        }
        res.status(200).json(roles);
    } catch (error) {
        console.error('Server error while fetching roles');
        res.status(500).json({message: 'Server error while fetching roles'});
    }  
};

/**
 * Give one roles in DB
 * @param {*} req
 * @param {*} res
 * @return {Array} of Role object
 */
export const getRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findByPk(roleId)
        if (!role){
            return res.status(404).json({message: 'Role non trouvée' });
        }
        res.status(200).json(role);

    } catch (error) {
        console.error('Server error while fetching role', error);
        res.status(500).json({message: 'Server error while fetching role'});
    }  
};

/**
 * Create role in DB
 * @param {*} req
 * @param {*} res
 * @return {Array} of Role object
 */
export const createRole = async (req, res) => {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(400).json({message: "A role must have a name"})
        }
        const newRole = await Role.create({name});
        if (!newRole){
            return res.status(500).json({message: 'Something went wrong'})
        }

        res.status(201).json(newRole)

        
    } catch (error) {
        console.error('Server error while creating role');
        res.status(500).json({message: 'Server error while creating role'});
    }  
};

/**
 * Update role in DB
 * @param {*} req
 * @param {*} res
 * @return {Array} of Role object
 */
export const updateRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        const{name} = req.body;
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(404).json({message: 'Role non trouvée' });
        }
        role.name = name;
        await role.save();
        res.status(204).json(role)
    } catch (error) {
        console.error('Server error while updating role');
        res.status(500).json({message: 'Server error while updating role'});
    }
};

// Delete a user (supprimer un utilisateur)

/**
 * Delete role in DB
 * @param {*} req
 * @param {*} res
 * @return {Array} of Role object
 */
export const deleteRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findByPk(roleId);
        if(!role){
            return res.status(404).json({message: 'Role not found'});
        }

        await role.destroy();
        res.status(204).json({message: 'Role is destroyed'})
    } catch (error) {
        console.error('Server error while deleting role', error);
        res.status(500).json({message: 'Server error while deleting role'});
    }
};