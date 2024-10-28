const path = require('path');

module.exports={
    entry:'./lengthConverterModule.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname, 'new folder')
    }
};

//npm run build