var express = require("express");
var router = express.Router();

import Email from '../../utils/mailer'


router.post("/send-mail/", async (req, res) => {
    console.log('tessssst')
    try {
        await Email(req, res)
        return res.status(200).json({ status: true, code: req.body.code })
    } catch (e) {
        return res.status(400).json({ status: false })
    }
});


module.exports = router;