var fs = require("fs");
var path = require('path');

var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
var uuid = require('node-uuid');

var validator = require("../utils/validator");

/* GET pdf page. */
router.get('/', async function (req, res, next) {
    try {
        var sourceUrl = req.query.sourceUrl;
        var fileName = req.query.fileName;
        console.log('资源地址：' + sourceUrl);
        console.log('文件名字：' + fileName);

        //参数验证
        if (!validator.checkUrl(sourceUrl)) {
            res.render('pdf', { title: 'html2pdf', content: '参数【sourceUrl】不合法，请检查！' });
            return;
        }
        if (!fileName) {
            fileName = uuid.v1() + '.pdf';
        }

        var tempPath = path.join(__dirname, '../');
        tempPath = path.join(tempPath, 'temp');
        console.log(tempPath);
        //检查某个目录是否存在,不存在则创建
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath);
        }
        var tempFile = tempPath + uuid.v1() + '.pdf';
        //生成pdf
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });
        const page = await browser.newPage();
        await page.goto(sourceUrl, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        await page.pdf({
            path: tempFile,
            format: 'A4',
            printBackground: true
        });
        await browser.close();

        //设置文件下载
        var file = fs.createReadStream(tempFile);
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            'Content-Disposition': 'attachment; filename=' + fileName
        });
        file.pipe(res);

        fs.unlink(tempFile, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("文件删除成功！");
        });
    } catch (e) {
        console.log(e);
        res.render('pdf', { title: '出错了', content: '服务器开小差了！' });
    }
});

module.exports = router;
