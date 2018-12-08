var validator = {
    checkUrl: function (url) {
        if (url != "") {
            var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (reg.test(url)) {
                return true;
            }
        }
        return false;
    }
};

module.exports = validator;