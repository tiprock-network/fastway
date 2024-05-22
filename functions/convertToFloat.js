const convertToFloat = (value) =>{
    return (parseFloat(value)/Math.pow(10,18).toString())
}

module.exports = convertToFloat