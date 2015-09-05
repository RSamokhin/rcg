
var Sequelize = require('sequelize');

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

var opTable = {
    '>': '$gt',
    '>=': '$gte',
    '<': '$lt',
    '<=': '$lte',
    '<>': '$ne',
    '~': '$like'
};

function validateValue(type, value)
{
    if (type instanceof Sequelize.STRING)
        return Sequelize.Validator.toString(value);
    if (type instanceof Sequelize.INTEGER)
        return Sequelize.Validator.toInt(value);
    if (type instanceof Sequelize.BOOLEAN)
        return Sequelize.Validator.toBoolean(value);
    if (type instanceof Sequelize.DATE)
        return Sequelize.Validator.toDate(value);
    return null;
}

function addWhere(result, attr, op, value)
{
    value = validateValue(attr.type, value);
    if (op === '=')
    {
        result[attr.fieldName] = value;
    }
    else
    {
        var where = {};
        where[opTable[op]] = value;
        result[attr.fieldName] = where;
    }
}

module.exports.createWhere = function(model, query)
{
    var result = {};
    var where = query['where'];
    if (where === undefined)
        return result;

    if (!(where instanceof Array))
        where = [where];

    var attrs = Object.keys(model.attributes);
    var regEx = new RegExp('^(' + attrs.join('|') + ')(>=|<=|<>|<|>|=|~)(.*)$');
    where.forEach(function(where)
    {
        var parts = regEx.exec(where);
        if (parts === null)
            return;
        addWhere(result, model.attributes[parts[1]], parts[2], parts[3]);
    });
    return result;
};
