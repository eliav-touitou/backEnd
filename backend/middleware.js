const logger = (req, res , next) => {
    console.log(
    `${req.protocol}://${req.get('host')}${
        req.originalUrl}`);
    next();
};

const waiter = (req, res , next) => {
    setTimeout(()=>{ 
        console.log('Here i wait a second hahah');
        next()}, 1000)
    };
    
    module.exports = {logger, waiter}
