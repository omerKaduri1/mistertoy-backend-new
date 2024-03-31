import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

// async function query(filterBy = { txt: '' }) {
//     try {
//         const criteria = {
//             name: { $regex: filterBy.txt, $options: 'i' }
//         }
//         const collection = await dbService.getCollection('toy')
//         var toys = await collection.find(criteria).toArray()
//         return toys
//     } catch (err) {
//         logger.error('cannot find toys', err)
//         throw err
//     }
// }

async function query(filterBy = { txt: '' }, sort = { by: '', asc: true }) {
    try {
        const criteria = {
            name: { $regex: filterBy.txt, $options: 'i' }
        }

        if (filterBy.inStock !== 'all') {
            criteria.inStock = filterBy.inStock === 'true' ? true : false
        }

        if (filterBy.labels && filterBy.labels.length > 0) {
            criteria.labels = { $in: filterBy.labels }
        }

        const collection = await dbService.getCollection('toy')

        let toys = await collection.find(criteria)
        toys = await toys.toArray()

        if (sort.by === 'price') {
            toys.sort((a, b) => (JSON.parse(sort.asc) ? a.price - b.price : b.price - a.price))
        } else if (sort.by === 'createdAt') {
            toys.sort((a, b) => (JSON.parse(sort.asc) ? a.createdAt - b.createdAt : b.createdAt - a.createdAt))
        } else if (sort.by === 'name') {
            toys.sort((a, b) => (JSON.parse(sort.asc) ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
        }


        return toys
    } catch (err) {
        logger.error('Cannot find toys', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        var toy = collection.findOne({ _id: ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const toyToSave = {
            price: toy.price
        }
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: ObjectId(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg
}