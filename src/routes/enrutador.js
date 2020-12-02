const {Router} = require('express')
const logic = require('../models/controlador.js')
const router = Router()

const controlador = require('../models/controlador.js')

var cors = require('cors')

router.get('/GnormalStd', cors() ,logic.generateNormalStdNumbers)
router.get('/Pchi2', cors(), logic.testingChi2)
router.get('/Pvarianza', cors(), logic.testingVarianza)

module.exports = router