const errorhandler = async(error, req, res, next)=>{

    const statuscode = res.statuscode ? res.statuscode : 500
    res.status(statuscode)
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV == 'development' ? error.stack : null
    })
}

module.exports= errorhandler