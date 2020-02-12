'use strict'

const db = require('../db');

const createCar = async (user_id, license_plate) => {
    let q = 'INSERT INTO api.cars (user_id, license_plate) \
             VALUES ($1, $2)'
    await db.query(q,[user_id,license_plate])
    let carid = await getCar(license_plate)

    return carid
}

const createUser = async (username) => {
    let q = 'INSERT INTO api.users (username) \
             VAlUES ($1)'
    await db.query(q,[username])
    let userid = await getUser(username)

    return userid
}

const getAllCarsForUser = async (username) => {
    let q = 'SELECT license_plate \
             FROM api.cars ca \
             JOIN api.users u on u.id = ca.user_id \
             WHERE u.username = $1'
    let result = await db.query(q,[username])
    if (result.rows.length !== 0) {
        return result.rows
    } else {
        return {}
    }
}

const getCar = async (license_plate) => {
    let q = 'SELECT id \
             FROM api.cars \
             WHERE license_plate = $1'
    let result = await db.query(q,[license_plate])

    if (result.rows.length !== 0) {
        return result.rows[0]['id']
    } else {
        return 0
    }
}

const getUser = async (username) => {
    let q = 'SELECT id \
             FROM api.users \
             WHERE username = $1'
    let result = await db.query(q,[username])

    if (result.rows.length !== 0) {
        return result.rows[0]['id']
    } else {
        return 0
    }
}

const getUsernameByPlate = async (license_plate) => {
    let q = 'SELECT username \
             FROM api.users u \
             JOIN api.cars ca on ca.user_id = u.id \
             WHERE ca.license_plate = $1'
    let result = await db.query(q,[license_plate])

    if (result.rows.length !== 0) {
        return result.rows[0]['username']
    } else {
        return ''
    }
}

const removeCar = async (license_plate) => {
    let carid = await getCar(license_plate)
    if (carid) {
        let q = 'DELETE FROM api.cars WHERE license_plate = $1'
        await db.query(q,[license_plate])
        return true
    } else {
        return false
    }

}

module.exports = {
    createCar: createCar,
    createUser: createUser,
    getAllCarsForUser: getAllCarsForUser,
    getCar: getCar,
    getUser: getUser,
    getUsernameByPlate: getUsernameByPlate,
    removeCar: removeCar
}