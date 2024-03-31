import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from './toy.controller.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router
toyRoutes.get('/', log, getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', addToy)
toyRoutes.put('/:id', updateToy)
toyRoutes.delete('/:id', removeToy)

toyRoutes.post('/:id/msg', addToyMsg)
toyRoutes.delete('/:id/msg/:msgId', removeToyMsg)