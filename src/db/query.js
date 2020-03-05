'use strict'

const db = require('../db')
const _ = require('lodash')

const addAdmin = async (user_id) => {
    let q = 'UPDATE api.users \
             SET is_admin = true \
             WHERE id = $1'
    await db.query(q,[user_id])

    return true
}

const createCar = async (user_id, license_plate, team_id) => {
    let q = 'INSERT INTO api.cars (user_id, license_plate, team_id) \
             VALUES ($1, $2, $3)'
    await db.query(q,[user_id,license_plate, team_id])
    let carid = await getCar(license_plate)

    return carid
}

const createUser = async (slack_id, team_id) => {
    let q = 'INSERT INTO api.users (slack_id, team_id) \
             VAlUES ($1,$2)'
    await db.query(q,[slack_id,team_id])
    let userid = await getUser(slack_id, team_id)

    return userid
}

const getAllCarsForUser = async (slack_id, team_id) => {
    let q = 'SELECT license_plate \
             FROM api.cars ca \
             JOIN api.users u on u.id = ca.user_id \
             WHERE u.slack_id = $1 \
             AND ca.team_id = $2'
    let result = await db.query(q,[slack_id, team_id])
    if (!_.isEmpty(result.rows)) {
        return result.rows
    } else {
        return {}
    }
}

const getAllAdmins = async () => {
    let q = 'SELECT slack_id \
             FROM api.users \
             WHERE is_admin \
             ORDER BY 1'
    let result = await db.query(q,[])
    return result.rows
}

const getAllCars = async (team_id) => {
    let q = 'SELECT u.slack_id, ca.license_plate \
             FROM api.cars ca \
             JOIN api.users u on u.id = ca.user_id \
             WHERE ca.team_id = $1 \
             ORDER BY 1, 2'
    let result = await db.query(q,[team_id])
    if (!_.isEmpty(result.rows)) {
        return result.rows
    } else {
        return {}
    }
}

const getCar = async (license_plate, team_id) => {
    let q = 'SELECT id \
             FROM api.cars \
             WHERE license_plate = $1 \
             AND team_id = $2'
    let result = await db.query(q,[license_plate,team_id])

    if (!_.isEmpty(result.rows)) {
        return result.rows[0]['id']
    } else {
        return 0
    }
}

const getUser = async (slack_id, team_id) => {
    let q = 'SELECT id \
             FROM api.users \
             WHERE slack_id = $1 AND team_id = $2'
    let result = await db.query(q,[slack_id, team_id])

    if (!_.isEmpty(result.rows)) {
        return result.rows[0]['id']
    } else {
        return 0
    }
}

const getUsernameByPlate = async (license_plate, team_id) => {
    let q = 'SELECT slack_id \
             FROM api.users u \
             JOIN api.cars ca on ca.user_id = u.id \
             WHERE ca.license_plate = $1 \
             AND ca.team_id = $2'
    let result = await db.query(q,[license_plate, team_id])

    if (!_.isEmpty(result.rows)) {
        return result.rows[0]['slack_id']
    } else {
        return ''
    }
}

const isAdmin = async (slack_id, team_id) => {
    let q = 'SELECT is_admin \
             FROM api.users u \
             WHERE u.slack_id = $1 \
             AND u.team_id = $2'
    let result = await db.query(q,[slack_id, team_id])

    if (!_.isEmpty(result.rows)) {
        return result.rows[0].is_admin
    } else {
        return false
    }
}

const removeAdmin = async (user_id) => {
    let q = 'UPDATE api.users \
             SET is_admin = false \
             WHERE id = $1'
    await db.query(q,[user_id])

    return
}

const removeCar = async (license_plate, team_id) => {
    let carid = await getCar(license_plate, team_id)
    if (carid) {
        let q = 'DELETE FROM api.cars WHERE license_plate = $1 AND team_id = $2'
        await db.query(q,[license_plate,team_id])
        return true
    } else {
        return false
    }

}

module.exports = {
    addAdmin: addAdmin,
    createCar: createCar,
    createUser: createUser,
    getAllAdmins: getAllAdmins,
    getAllCars: getAllCars,
    getAllCarsForUser: getAllCarsForUser,
    getCar: getCar,
    getUser: getUser,
    getUsernameByPlate: getUsernameByPlate,
    isAdmin: isAdmin,
    removeAdmin: removeAdmin,
    removeCar: removeCar
}