const express = require('express');
const router = express.Router();
const git = require('git-rev-promises');

router.get('/', async (req, res, next) => {
    try {
        res.send({
            date: await git.date(),
            hash: await git.long(),
            tag: await git.tag(),
            branch: await git.branch(),
            message: await git.message()
        })
    } catch (e) {
        next(e);
    }
});

module.exports = router;