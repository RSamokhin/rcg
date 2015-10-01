window.Handlers = {
    click: {
        switchTabs: function (e) {
            e.preventDefault();
            $(this).tab('show');
        },
        showMoreTableInfo: function () {
            var $showMore = $(this),
                $activeA = $('li[role="presentation"][class="active"] > a');
            $showMore.attr({
                'data-start': $showMore.attr('data-start') ? parseInt($showMore.attr('data-start')) + 10 : 10,
                'data-active-tab': $activeA.attr('aria-controls')
            });
            window.Handlers.click.requestTableData.bind($activeA)()
        },
        requestTableData: function () {
            var $tab =$(this),
                templateId = $tab.attr('data-request-template-id'),
                url = $tab.attr('data-request-url'),
                aim = $tab.attr('data-append-from'),
                params = {},
                newData = true,
                $showMore = $('[data-bind-click="showMoreTableInfo"]'),
                $activeA = $('li[role="presentation"][class="active"] > a');
            if ($showMore.attr('data-active-tab') !== $tab.attr('aria-controls')) {
                $showMore.removeAttr('data-start');
                $showMore.attr('data-active-tab', $activeA.attr('aria-controls'));
            } else {
                newData = false;
            }
            location.hash = $tab.attr('href')+ '$$$' + location.hash.split('$$$').filter(function (el, i) {
                return i > 0;
            }).join('$$$');
            location.hash.split('$$$').forEach(function (str) {
                params[str.split('=')[0]] = str.split('=')[1];
            });
            try {
            url = '/' + url.split('/').map(function (el) {
                if (~el.indexOf(':')) {
                    if (params[el.split(':')[1]]) {
                        return params[el.split(':')[1]];
                    } else {
                        return '';
                    }
                } else {
                    return el;
                }
            }).filter(function (el) {
                return el !== '';
            }).join('/') + '/';
            } catch( e ) {
                url = false;
            }
            if (!url) {
            } else {
                $.ajax({
                    url: url,
                    data: {
                        start: $showMore.attr('data-start') ? $showMore.attr('data-start') : 0
                    },
                    success: function (data) {
                        var $showMoreButton = $('[data-bind-click="showMoreTableInfo"]');
                        if (!data.length) {
                            $showMoreButton.hide();
                        } else {
                            $showMoreButton.show();
                        }
                        data = data.map(function (d) {
                            d = JSON.flatten(d, '_');
                            d.data = encodeURI(JSON.stringify(d));
                            return d;
                        });
                        if (newData) {
                            $('[data-append-to=' + aim + '] > tbody').html('');
                        }
                        $('#' + templateId).tmpl(data).appendTo('[data-append-to=' + aim + ']');
                        $('[data-append-to=' + aim + ']').find('[data-format]').each(function () {
                            var $td = $(this),
                                $parent = $td.parent(),
                                newValue;
                            switch ($td.attr('data-format')) {
                                case 'date':
                                    var newDate = $td.val() ? new Date($td.val()) : new Date($td.text());
                                    $td.val() ? $td.val(newDate.toString().split(' ').slice(0, -2).join(' ')) : $td.text(newDate.toString().split(' ').slice(0, -2).join(' '));
                                    break;
                                case 'jsonTable':
                                    try {
                                        var tdData = JSON.parse($td.text());
                                        var $innerTable = $('<table/>').addClass('table reply-info');
                                        $td.html('');
                                        $innerTable.appendTo($td);
                                        Object.keys(tdData).forEach(function (key) {
                                            var $innerRow = $('<tr/>');
                                            $innerRow.appendTo($innerTable);
                                            $('<td/>').text(key).appendTo($innerRow);
                                            $('<td/>').text(tdData[key]).appendTo($innerRow);
                                        });
                                    } catch (e) {
                                    }
                                    break;
                                case 'radio':
                                    newValue = $td.val();
                                    $parent.find('[type="radio"][value="' + newValue + '"]').attr('checked', true);
                                    $td.hide();
                                    break;
                                case 'select':
                                    newValue = $td.val();
                                    newValue = [].some.call($parent.find('option'), function (el) {
                                        return el.innerText === newValue;
                                    }) ? newValue : $parent.find('[data-default-value=true]').text();
                                    $parent.find('select').val(newValue);
                                    $td.hide();
                                    break;
                            }
                        });
                    }
                });
            }
        },
        editField: function () {
            var $button = $(this),
                $field = $(this).parent().find('input, textarea, select').eq(0);
            if ($button.hasClass('m-button-editable')) {
                $button.removeClass('m-button-editable').addClass('m-button-saveable');
                $field.focus();
                $button.parent().find('input, textarea, select').attr({
                    'readonly': false,
                    'disabled': false
                });
            } else {
                if ($button.closest('tr').attr('data-parsed')) {
                    var newValue = $field.val(),
                        fullData = {},
                        prevData = JSON.parse(decodeURI($field.closest('tr').attr('data-parsed')));
                    if ($field.attr('data-precompile')) {
                        switch ($field.attr('data-precompile')) {
                            case 'toISOString':
                                newValue = new Date(newValue);
                                break;
                            case 'getCheckedRadio':
                                newValue = $field.parent().find('[type=radio]:checked').val() ? $field.parent().find('[type=radio]:checked').val() : 0;
                                break;
                            case 'getSelectedValue':
                                newValue = $field.parent().find('select').val();
                                break;
                            case 'appendFromTo':
                                newValue = $field.parent().find('[data-appendfromto="true"]').html() + '\n' + newValue;
                                $field.parent().find('[data-appendfromto="true"]').html(newValue);
                                $field.val('');
                                break;
                            case 'getCheckedBit':
                                newValue = $field.prop('checked') ? 1 : 0;
                                break;
                        }
                    }
                    fullData[$field.attr('data-field')] = newValue;
                    $.ajax({
                        type: "POST",
                        url: $field.closest('table').attr('data-update-url').replace(':key', prevData[$field.closest('table').attr('data-update-key')]),
                        data: fullData,
                        success: function () {
                            $button.addClass('m-button-editable').removeClass('m-button-saveable');
                            $button.parent().find('input, textarea, select').attr({
                                'readonly': true,
                                'disabled': true
                            });
                            prevData[$field.attr('data-field')] = newValue;
                            $field.closest('tr').attr('data-parsed', encodeURI(JSON.stringify(prevData)));
                        }
                    });
                } else {
                    $button.addClass('m-button-editable').removeClass('m-button-saveable');
                    $button.parent().find('input, textarea, select').attr({
                        'readonly': true,
                        'disabled': true
                    });
                }
            }
        },
        deleteRow: function(e) {
            e.preventDefault();
            var $dbutton = $(this),
                fullData;
            if ($dbutton.closest('tr').attr('data-parsed')) {
                fullData = JSON.parse(decodeURI($dbutton.closest('tr').attr('data-parsed')));
                if (confirm("Вы уверены?")) {
                    $.ajax({
                        url: $dbutton.closest('table').attr('data-delete-url').replace(':key', fullData[$dbutton.closest('table').attr('data-delete-key')]),
                        method: 'DELETE',
                        success: function () {
                            $dbutton.closest('tr').remove();
                        }
                    });
                }
            } else {
                $dbutton.closest('[role=tabpanel]').find('[data-bind-click="addNewEntry"]').removeClass('btn-success').addClass('btn-info').text('Добавить');
                $dbutton.closest('tr').remove();
            }
        },
        clearAllFilters: function () {
            window.location = $(this).attr('data-go-to');
            window.location.reload();
        },
        showVacancyReplies: function (e) {
            e.preventDefault();
            window.location = window.location.origin + $(this).attr('href');
            window.location.reload();
        },
        addNewEntry: function () {
            var $addButon = $(this),
                where = $addButon.closest('[role=tabpanel]').attr('id'),
                $tbody = $addButon.closest('[role=tabpanel]').find('tbody'),
                tmpl = $('a[href="#' + where + '"]').attr('data-request-template-id');
            if ($addButon.hasClass('btn-info')) {
                $('#' + tmpl).tmpl([{}]).prependTo($tbody);
                $addButon.addClass('btn-success').removeClass('btn-info').text('Сохранить');
            } else {
                var data = {};
                $addButon.closest('[role=tabpanel]').find('tbody > tr').eq(0).find('textarea, input').each(function () {
                    var fname = $(this).attr('data-field');
                    data[fname] = $(this).val();
                });
                $.ajax({
                    url: $addButon.closest('[role=tabpanel]').find('table').attr('data-add-url'),
                    type: 'PUT',
                    data: data,
                    success: function () {
                        $addButon.removeClass('btn-success').addClass('btn-info').text('Добавить');
                        window.Handlers.click.requestTableData.bind($('a[href="#' + where + '"]'))()
                    }
                });
            }
        }
    },
    change: {
        refreshImage: function (e) {
            e.preventDefault();
            var $input = $(this),
                $target = $($input.attr('data-target-selector'));
            switch ($target.prop('tagName')) {
                case 'IMG':
                    $target.attr('src', $input.val());
                    break;
            }
        },
        'uploadImage': function () {
            var pictureInput = this;
            var myFormData = new FormData();
            myFormData.append('pictureFile', pictureInput.files[0]);

            $.ajax({
                url: 'images',
                type: 'POST',
                processData: false,
                contentType: false,
                dataType: 'json',
                data: myFormData,
                success: function (data) {
                    if (data.status === 'OK') {
                        var purl = data.path;
                        if ($(pictureInput).parent().children('[data-bind-click=editField]').hasClass('m-button-editable')) {
                            $(pictureInput).parent().children('[data-bind-click=editField]').trigger('click')
                        }
                        $('[data-target-selector="' + $(pictureInput).attr('data-url-selector')  + '"]').val(purl).trigger('change');
                    } else {
                        alert('Произошла ошибка')
                    }
                }
            });
        }
    }
};
JSON.unflatten = function(data, splitter) {
    "use strict";
    if (!splitter) {
        splitter = '.';
    }
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var result = {}, cur, prop, parts, idx;
    for(var p in data) {
        cur = result, prop = "";
        parts = p.split(splitter);
        for(var i=0; i<parts.length; i++) {
            idx = !isNaN(parseInt(parts[i]));
            cur = cur[prop] || (cur[prop] = (idx ? [] : {}));
            prop = parts[i];
        }
        cur[prop] = data[p];
    }
    return result[""];
};
JSON.flatten = function(data, splitter) {
    if (!splitter) {
        splitter = '.';
    }
    var result = {};
    function recurse (cur, prop) {
        var isEmpty = true;
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for(var i=0, l=cur.length; i<l; i++)
                recurse(cur[i], prop ? prop+splitter+i : ""+i);
            if (l == 0)
                result[prop] = [];
        } else {
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+splitter+p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
};
Object.keys(window.Handlers).forEach(function (bindFunctionEvent) {
    Object.keys(window.Handlers[bindFunctionEvent]).forEach(function (bindFunctionName) {
       $(document.body).on(bindFunctionEvent, '[data-bind-'+bindFunctionEvent+'*='+bindFunctionName+']', window.Handlers[bindFunctionEvent][bindFunctionName]);
    });
});
$(function () {
    var $navTabs = $('.nav.nav-tabs');
    if (!location.hash || $navTabs.find('[href=' + location.hash.split('$$$')[0] + "]").length === 0){
        $navTabs.children().eq(0).find('a').trigger('click');
    } else {
        $navTabs.find('[href=' + location.hash.split('$$$')[0] + "]").trigger('click');
    }

    if ($.cookie('JSONTOKEN')) {
        $.ajax({
            headers: {
                Authorization: 'Bearer ' + $.cookie('JSONTOKEN')
            },
            url: '/token/check',
            success: function (data) {
                if (data.authorized) {
                    $.ajaxSetup({
                        headers: {
                            'Authorization': 'Bearer ' + $.cookie('JSONTOKEN')
                        }
                    });
                }
            }
        });
    } else {
        setAuthDialog();
    }

});

function setAuthDialog () {
    var login = prompt("Login", ''),
        pwd = prompt("Password", '');
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'token',
        data: {
            phone: login,
            password: pwd
        },
        success: function (data) {
            console.log(data);
            $.cookie('JSONTOKEN', data.token);
            location.reload();
        },
        error: function () {
            alert('Wrong Data');
        }
    });
}
