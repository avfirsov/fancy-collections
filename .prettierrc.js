const prettierConfigStandard = require('prettier-config-standard');


const modifiedConfig  =
    {...prettierConfigStandard,
    ...{
        "trailingComma": "es5"
    },
    }


module.exports = modifiedConfig