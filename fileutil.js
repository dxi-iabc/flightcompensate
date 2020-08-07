const fs = require('fs')

const path = './data/data.json'

const deleteFile = ()=> {

    try {

       fs.unlinkSync(path)
    
    } catch(err) {

         console.log(err);

    }
}

const writeFile = ()=> {

    try {

        fs.writeFile(path, "[]", 'utf-8', function(err) {
            if (err) throw err
            console.log('Done!')
        });
    } catch(err) {

         console.log(err);

    }
}


const importDatFromFile =  (content)=> {

    try {

console.log(content)
fs.readFile(path, 'utf-8', function(err, data) {
    if (err) throw err
    var arrayOfObjects = [];
    
    console.log("Length----",data.toString().trim().length)
   
    if(data.toString().trim().length < 1 ){
         
       arrayOfObjects.push(content) ;
    
    }else{


	     arrayOfObjects = JSON.parse(data)
         arrayOfObjects.push(content) ;

    }
    
    
    fs.writeFile(path, JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
       // if (err) throw err
        console.log('Done!')
    });

});

       
    } catch(err) {

         console.log(err);

    }
}

module.exports = deleteFile;
module.exports = writeFile;
module.exports = importDatFromFile;



