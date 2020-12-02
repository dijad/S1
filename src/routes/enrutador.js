const {Router} = require('express')
const logic = require('../models/controlador.js')
const router = Router()

const controlador = require('../models/controlador.js')

var cors = require('cors')

router.post('/GnormalStd', cors() ,logic.generateNormalStdNumbers)
router.post('/Pchi2', cors(), logic.testingChi2)
router.post('/Pvarianza', cors(), logic.testingVarianza)

module.exports = router