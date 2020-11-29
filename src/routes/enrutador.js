const {Router} = require('express')
const logic = require('../models/controlador.js')
const router = Router()

const controlador = require('../models/controlador.js')

router.get('/GnormalStd', logic.generateNormalStdNumbers)
router.get('/Pchi2', logic.testingChi2)
router.get('/Pvarianza', logic.testingVarianza)

module.exports = router