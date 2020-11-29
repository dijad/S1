var math = require('mathjs');
var utilities = require('../../src/models/utilities');

const logic = {}

//************Normal***************/
logic.generateNormalStdNumbers = (req, res) => {
    var ri = req.body.ri
    var numIntervalos = req.body.numIntervalos

    var media = math.mean(ri)
    var std = math.std(ri)

    var ni = []
    for(let i = 0; i < ri.length; i++){
        ni.push(calcNiNormStd(media,std,ri[i]))
    }
    console.log("Ni: ", ni)

    var max = Math.max.apply(null,ni)
    var min = Math.min.apply(null,ni)
    console.log("max: ",max)
    console.log("min: ",min)

    var intervalos = []
    calcIntervals(intervalos,min,max,numIntervalos)
    console.log("Intervalos: ", intervalos)

    var frecuencias = []
    countFrecuency(intervalos,ni,frecuencias)
    console.log("Frecuencias: ",frecuencias)

    res.json({ni:ni, intervalos:intervalos, frecuencias:frecuencias})
}

function calcNiNormStd(media, std, x){
    var part1 = 1/(Math.sqrt(2*Math.PI*std))
    var part2 = (-1/2) * Math.pow((x-media)/std,2)
    var ni = part1 * (Math.pow(Math.E, part2 ))
    return ni
}

function calcIntervals(intervalos,min,max,numIntervalos){
    intervalos.push(min)
    for(let i = 1; i <= numIntervalos;i++){
        intervalos.push(intervalos[i-1]+(max-min)/numIntervalos)
    }
}

function countFrecuency(intervalos, ni, frecuencias){
    var aux = 0
    for(let i = 0; i < intervalos.length; i++){
        for(let j = 0; j < ni.length; j++){
            if(i != 0 && i != intervalos.length-1){
                if(ni[j] <= intervalos[i] && ni[j] > intervalos[i-1]){
                    aux += 1
                }
            }else if(i==0){
                if(ni[j] <= intervalos[i]){
                    aux += 1
                }
            }else if (i == intervalos.length-1){
                if( ni[j] >= intervalos[i-1]){
                    aux += 1
                }
            }
        }
        frecuencias.push(aux)
        aux = 0
    }
}
/*
{
    "numIntervalos": 10,
	"ri": [0.5155, 0.4566, 0.3333]
}
*/
//***************Chi2***********************/
logic.testingChi2 = (req, res) => {
    var ri = req.body.ri
    var numIntervalos = req.body.numIntervalos 
    var a = req.body.a
    var b = req.body.b
    var mError = req.body.mError

    var ni = []
    calcNiNormal(a,b,ri,ni)

    var max = Math.max.apply(null,ni)
    var min = Math.min.apply(null,ni)

    var noPos = []
    for(let i = 1; i <= numIntervalos; i++){
        noPos.push(i);
    }

    var start = []
    var end = []
    
    calcLimitsIntervals(start,end,min,max,numIntervalos)
    

    var frecObt = []
    calcFrecObt(start,end,ni,frecObt)
    console.log(frecObt)

    var frecEsp = []
    calcFrecEsp(frecEsp, numIntervalos,ni)
    console.log(frecEsp)

    var chi2 = []
    calcChi2(frecObt,frecEsp,chi2,numIntervalos)
    console.log(chi2)

    var totalChi2 = calcTotalChi2(chi2)
    console.log("Suma chi2: " ,totalChi2)

    var gl = (2-1)*(numIntervalos-1)
    console.log("Grados de libertad: " , gl)
    console.log("Margen de error: " , mError)

    var compareValue = utilities.rf(gl,mError);
    console.log("valor de comparasion: " , compareValue)

    var testOk = totalChi2 < compareValue? true:false
    console.log(testOk)

    res.json({ni:ni, chi2:chi2, "sumaChi2":totalChi2, "valorComparasion": compareValue, passTest:testOk})
}

function calcTotalChi2(chi2){
    var totalChi = 0
    for(let i = 0; i < chi2.length;i++){
        totalChi += chi2[i]
    }
    return totalChi
}

function calcChi2(frecObt,frecEsp,chi2,numIntervalos){
    for(let i = 0; i < numIntervalos; i++){
        chi2.push(Math.pow(frecObt[i]-frecEsp[i],2)/frecEsp[i])
    }
}

function calcFrecEsp(frecEsp, numIntervalos, ni){
    for(let i = 0; i < numIntervalos; i++){
        frecEsp.push(ni.length/numIntervalos)
    }
}

function calcFrecObt(start,end,ni,frecObt){
    var aux = 0
    for(let i = 0; i < start.length; i++){
        for(let j = 0; j < ni.length; j++){
            if(i == end.length-1){
                if(ni[j]>=start[i] && ni[j]<= end[i]){
                    aux++
                }
            }else {
                if(ni[j]>=start[i] && ni[j]<= end[i]){
                    aux++
                }
            }
        }
        frecObt.push(aux)
        aux = 0
    }
}

function calcLimitsIntervals(start,end,min,max,numIntervalos){
    start.push(min)
    for(let i = 0; i < numIntervalos; i++){
        end.push(start[i]+(max-min)/numIntervalos)
        if(start.length != numIntervalos){
            start.push(start[i]+(max-min)/numIntervalos)
        }else{
            end[end.length-1] = max
            return
        }
    }
}

function calcNiNormal(a,b,ri,ni){
    for(let i = 0; i < ri.length; i++){
        ni.push(a+(b-a)*ri[i])
    }
}
/*
{
    "numIntervalos": 10,
	"ri": [0.206767682,0.86213495,0.3168518,0.149340104,0.894112003,0.111459068,0.871631591,0.457361821,0.555744404,0.794714475,0.210280841,0.453023902,0.806892915,0.258998834,0.163680417,0.396469771,0.837854196,0.065212672,0.427587931,0.703025586,0.572146407,0.723376059,0.416075897,0.542467091,0.380416055,0.165648602,0.693598034,0.768053069,0.876032334,0.244303852,0.664727361,0.231655905,0.550275304,0.395175795,0.157082831,0.094958998,0.595001578,0.040212604,0.260552269,0.313555183,0.13676491,0.308682053,0.276059974,0.256161294,0.815969936,0.602214068,0.582412813,0.71431711,0.394819236,0.565727698,0.365047218,0.990967831,0.671083541,0.605101433,0.494069008,0.164808638,0.485742857,0.202455058,0.956922193,0.010474703,0.784242545,0.112802274,0.003508321,0.030035111,0.265906547,0.435236879,0.831086712,0.341977227,0.545231817,0.599555413,0.88546737,0.260418711,0.969086678,0.111352874,0.711616841,0.69958711,0.093697272,0.529143786,0.434259172,0.013345335,0.489897917,0.289509987,0.31392797,0.761290218,0.676777934,0.341201846,0.052707695,0.795620226,0.517631798,0.206632748,0.307204755,0.223625116],
    "a": 8,
    "b":10,
    "mError": 0.05
}
*/
//***************Prueba de medias***********************/
logic.testingVarianza = (req, res) => {
    var ri = req.body.ri
    var mError = req.body.mError

    var n = ri.length
    var promedioRi = math.mean(ri)
    var varianzaRi = calcVarianza(ri,promedioRi)
    console.log("varianza ", varianzaRi)
    var alphaMedios = mError/2
    var alphaMediosInv = 1 -alphaMedios
    var chi2AlphaMedios = utilities.rf(n,alphaMedios)
    var chi2AlphaMediosInv = utilities.rf(n,alphaMediosInv)
    var li = chi2AlphaMedios / (12*(n-1))
    console.log("li ",li)
    var ls = chi2AlphaMediosInv /(12*(n-1))
    console.log("ls ",ls)
    if(varianzaRi >= ls && varianzaRi >= li){
        res.json({"varianza":varianzaRi, "limiteInferior": li, "limiteSuperior": ls, "passTest":true})
    }else{
        res.json({"varianza":varianzaRi, "limiteInferior": li, "limiteSuperior": ls, "passTest":false})
    }

    function calcVarianza(ri,promedioRi){
        var varianza = 0
        for(let i = 0; i < ri.length;i++){
            varianza += Math.pow((ri[0]-promedioRi),2)/(ri.length-1)
        }
        return varianza
    }
}
module.exports = logic;