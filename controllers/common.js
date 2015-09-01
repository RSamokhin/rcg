
module.exports.del = function(model)
{
    return function * (id) {
        var row = yield model.findOne({
            where: {
                id: id | 0
            }
        });
        if (row === null)
        {
            this.status = 404;
            return;
        }
        yield row.destroy();
        this.status = 200;
    };
};
