var fs = require("fs");
var path = 'src/resources/tableChi.txt';

const utilities = {}

utilities.rf = function readMyFile(gf,merror){
    var gl = gf
    var merr = merror

    var lines = fs.readFileSync(path).toString().split('\n');

    var headerUp = lines[0].split('\t');
    headerUp.splice(0, 1)
    
   var headerLeft = []
   for(let i = 1; i < lines.length;i++){
       headerLeft.push(lines[i].split('\t')[0])
   }  
  
   var table = []
   for(let i = 1; i < lines.length;i++){
        table.push(lines[i].split('\t').splice(1,lines[i].split('\t').length))
   }
   return getValFromTable(headerUp,headerLeft,table,gl,merr)
   
}

function getValFromTable(headerUp,headerLeft,table,gl,merr){
    var posCol = 0
    var posRow = 0
    for(let col = 0; col < headerUp.length; col++){
        if(headerUp[col]==merr){
            posCol = col
        }
    }
    for(let row = 0; row < headerLeft.length; row++){
        if(headerLeft[row]==gl){
            posRow = row
        }
    }
    return table[posRow][posCol]
}
/*
{
	"ri": [0.206767682,0.86213495,0.3168518,0.149340104,0.894112003,0.111459068,0.871631591,0.457361821,0.555744404,0.794714475,0.210280841,0.453023902,0.806892915,0.258998834,0.163680417,0.396469771,0.837854196,0.065212672,0.427587931,0.703025586,0.572146407,0.723376059,0.416075897,0.542467091,0.380416055,0.165648602,0.693598034,0.768053069,0.876032334,0.244303852,0.664727361,0.231655905,0.550275304,0.395175795,0.157082831,0.094958998,0.595001578,0.040212604,0.260552269,0.313555183,0.13676491,0.308682053,0.276059974,0.256161294,0.815969936,0.602214068,0.582412813,0.71431711,0.394819236,0.565727698,0.365047218,0.990967831,0.671083541,0.605101433,0.494069008,0.164808638,0.485742857,0.202455058,0.956922193,0.010474703,0.784242545,0.112802274,0.003508321,0.030035111,0.265906547,0.435236879,0.831086712,0.341977227,0.545231817,0.599555413,0.88546737,0.260418711,0.969086678,0.111352874,0.711616841,0.69958711,0.093697272,0.529143786,0.434259172,0.013345335,0.489897917,0.289509987,0.31392797,0.761290218,0.676777934,0.341201846,0.052707695,0.795620226,0.517631798,0.206632748,0.307204755,0.223625116],
    "mError": 0.05
}
*/
module.exports = utilities;