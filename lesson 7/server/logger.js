const fs = require('fs');
const moment = require('moment');
const file = './server/db/log.json';
const itemLog = {
    time: moment,
    id_product: '',
    product_name: '',
    quantity: 0,
};
const log = (action, req, cart) => {
    const basket = JSON.parse(cart);
    itemLog.time = moment().format('LLL');
    itemLog.action = action;
    if(action==='add'){
        itemLog.id_product = +req.body.id_product;
        itemLog.product_name = req.body.product_name;
        itemLog.quantity = req.body.quantity;
    }else if(action==='change'){
        const find = basket.contents.find(el => el.id_product === +req.params.id);
        itemLog.id_product = +req.params.id;
        itemLog.product_name = find.product_name;
        itemLog.quantity = +find.quantity;
    }else if(action==='del'){
        itemLog.id_product = +req.body.id_product;
        itemLog.product_name = req.body.product_name;

    }

    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const logs = JSON.parse(data);
            logs.push(itemLog);
            fs.writeFile(file, JSON.stringify(logs, null, 4), (err) => {
                if (err) console.log('err');
            })
        }
    })
};
module.exports = {
    log,
};