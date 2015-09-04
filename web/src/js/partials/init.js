window.Handlers = {
    click: {
        switchTabs: function (e) {
            e.preventDefault();
            $(this).tab('show');
        },
        requestTableData: function (e) {
            var $tab =$(this),
                templateId = $tab.attr('data-request-template-id'),
                url = $tab.attr('data-request-url'),
                aim = $tab.attr('data-append-from');
            location.hash = $tab.attr('href')+ '$$$' + location.hash.split('$$$').filter(function (el, i) {
                return i > 0;
            }).join('$$$');
            $.ajax({
                url: url,
                success: function (data) {
                    data = data.map(function (d, i) {
                        d = JSON.flatten(d, '_');
                        d.data = encodeURI(JSON.stringify(d));
                        return d;
                    });
                    $('[data-append-to='+aim+'] > tbody').html('');
                    $('#'+templateId).tmpl(data).appendTo('[data-append-to='+aim+']');
                    $('[data-append-to='+aim+']').find('[data-format]').each(function () {
                        var $td = $(this);
                        switch ($td.attr('data-format')) {
                            case 'date':
                                    var newDate = $td.val() ? new Date($td.val()) : new Date($td.text());
                                    $td.val() ? $td.val(newDate.toString().split(' ').slice(0,-2).join(' ')) : $td.text(newDate.toString().split(' ').slice(0,-2).join(' '));
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
                                } catch (e) {}
                                break;
                            case 'radio':
                                var newValue = $td.val();
                                $td.parent().find('[type="radio"][value="' + newValue + '"]').attr('checked', true);
                                $td.hide();
                                break;
                            case 'select':
                                var newValue = $td.val();
                                newValue = [].some.call($td.parent().find('option'), function (el) {
                                    return el.innerText === newValue;
                                }) ? newValue : $td.parent().find('[data-default-value=true]').text();
                                $td.parent().find('select').val(newValue);
                                $td.hide();
                                break;
                        }
                    });
                }
            });
            location.hash = location.hash.split('$$$')[0];
        },
        editField: function (e) {
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
            $dbutton = $(this);
            var parent = e.target;
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
        clearAllFilters:function (e) {
            $('.header').find('li.active[role="presentation"]>a').trigger('click');
        },
        showVacancyReplies: function (e) {
            e.preventDefault();
            location = location.origin + $(this).attr('href');
            location.reload();
        },
        addNewEntry: function (e) {
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
                    var fname = $(this).attr('data-field'),
                        fval = $(this).val();
                    data[fname] = fval;
                });
                $.ajax({
                    url: $addButon.closest('[role=tabpanel]').find('table').attr('data-add-url'),
                    type: 'PUT',
                    data: data,
                    success: function (data) {
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
            }
        },
        'uploadImage': function (e) {
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
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for(var i=0, l=cur.length; i<l; i++)
                recurse(cur[i], prop ? prop+splitter+i : ""+i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
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
    if (!location.hash || $('.nav.nav-tabs').find('[href=' + location.hash.split('$$$')[0] + "]").length === 0){
        $('.nav.nav-tabs').children().eq(0).find('a').trigger('click');
    } else {
        $('.nav.nav-tabs').find('[href=' + location.hash.split('$$$')[0] + "]").trigger('click');
    }
});

