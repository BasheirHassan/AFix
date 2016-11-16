/** * ملف جافا سكربت الرئيسي * Main JavaScript File For Web Site * @constructor */var globalErrorMessage = "خطأ عند محاولة ارسال البيانات ";// تكميل تلثائي للبحثvar optionsAutoCompleat = {    url: "./json/devices/getListDevicesBySerial.php?c=" + $("#searchID").val() + "&by=s&like",    getValue: "Serial",    theme: "blue-light",    getValue: "Serial",    template: {        type: "custom",        method: function (value, item) {            return "<span>" + value + "</span><br/><span class='text-success'>" + item.Name + "</span>";        }    },    list: {        onSelectItemEvent: function () {            var val = $("#searchID").val();            $("#TitleBtnSearch").html("سيريال");            $("#searchBy").val('s');            var dataObj = {'c': val, 'by': $("#searchBy").val()};            showListDevices(dataObj);        },        match: {            enabled: true        }    }};$("#searchID").easyAutocomplete(optionsAutoCompleat);/** * عرض رسالة تنبيه حول العميل * @param type * @param text * @param id */function generate(type, text, id,idAlert) {    var n = noty({        text: text,        type: type,        dismissQueue: true,        layout: 'bottomLeft',        closeWith: ['click'],        theme: 'relax',        killer: true, // for close all notifications before show        maxVisible: 1,        buttons: [            {                addClass: 'btn btn-primary', text: 'عرض العميل', onClick: function ($noty) {                // this = button element                // $noty = $noty element                $noty.close();                showListDevices({by: 'idDevices', 'ID': id});            }            },            {                addClass: 'btn btn-danger', text: 'حذف', onClick: function ($noty) {                $noty.close();                $.post("json/alert.php?hideAlert", {isShow: "0", id: idAlert});            }            },            {                addClass: 'btn btn-info', text: 'اخفاء', onClick: function ($noty) {                $noty.close();            }            }        ],        animation: {            open: 'animated bounceInLeft',            close: {height: 'toggle'}, // jQuery animate function property object            easing: 'swing',            speed: 500        }    });}/** * احضار تنبيهات العملاء */function getAlert() {    $.ajax({        url: 'json/alert.php?getAlert',        dataType: 'json',        success: function (data) {            $.each(data, function (key, value) {                generate('success', '<div class="activity-item"> <i class="fa fa-lg  fa-bell-o text-success"></i> <div class="activity"> <span>' + value.msg + '</span> <br/><span>' + value.Name + '</span> </div> </div>', value.idDevices,value.idAlert);            });        }    });}/** * */function addAlert(IDdevices) {    notie.input({        type: 'text',        placeholder: 'رسالة للصيانة',        prefilledValue: ''    }, 'تعديل المرجع:', 'ارسال', 'الغاء', function (valueEntered) {        $.ajax({            type: "POST",            url: 'json/alert.php?addAlert',            dataType: "json",            data: {'ID': IDdevices, msg: valueEntered,addAlert:true}, // serializes the form's elements.            success: function (data) {                notie.alert(data.idMsg, data.msg, 2.5);            },            error: function (e) {                notie.alert(3, globalErrorMessage, 2.5);            }        });    });}//اضافة نوع جهازfunction AddNewDevices() {    headrTitle('الاجهزة');    function escapeTags(str) {        return String(str)            .replace(/&/g, '&amp;')            .replace(/"/g, '&quot;')            .replace(/'/g, '&#39;')            .replace(/</g, '&lt;')            .replace(/>/g, '&gt;');    }    $("#Contener").load("form/newDevices.html", function () {        $("form#addNewDevicesForm").submit(function () {            $.ajax({                type: 'POST',                dataType: "json",                // make sure you respect the same origin policy with this url:                // http://en.wikipedia.org/wiki/Same_origin_policy                url: 'json/insertNewDevices.php',                data: $("form#addNewDevicesForm").serialize(),                success: function (data) {                    //called when successful                    notie.alert(data.idMsg, data.msg, 2.5);                },                error: function (e) {                    notie.alert(3, globalErrorMessage, 2.5);                }            });            return false;        });        var btn = document.getElementById('uploadBtn'),            progressBar = document.getElementById('progressBar'),            progressOuter = document.getElementById('progressOuter'),            msgBox = document.getElementById('msgBox');        var uploader = new ss.SimpleUpload({            button: btn,            url: 'file_upload.php',            name: 'uploadfile',            multipart: true,            hoverClass: 'hover',            focusClass: 'focus',            responseType: 'json',            startXHR: function () {                progressOuter.style.display = 'block'; // make progress bar visible                this.setProgressBar(progressBar);            },            onSubmit: function () {                msgBox.innerHTML = ''; // empty the message box                btn.innerHTML = 'Uploading...'; // change button text to "Uploading..."            },            onComplete: function (filename, response) {                btn.innerHTML = 'Choose Another File';                progressOuter.style.display = 'none'; // hide progress bar when upload is completed                if (!response) {                    msgBox.innerHTML = 'Unable to upload file';                    return;                }                if (response.success === true) {                    $("#ImageUrl").val(escapeTags(filename))                    msgBox.innerHTML = '<strong>' + escapeTags(filename) + '</strong>' + ' successfully uploaded.';                } else {                    if (response.msg) {                        msgBox.innerHTML = escapeTags(response.msg);                    } else {                        msgBox.innerHTML = 'An error occurred and the upload failed.';                    }                }            },            onError: function () {                progressOuter.style.display = 'none';                msgBox.innerHTML = 'Unable to upload file';            }        });    });}/** * add new custemer * @constructor */function AddNewCustemer() {    headrTitle('العملاء');    $("#Contener").load("form/newCustemer.html", function () {        var options = {            url: "json/getCoustemersAutoCompleat.php",            getValue: "Name",            theme: "blue-light",            ajaxSettings: {                dataType: "json",                method: "POST",                data: {                    dataType: "json"                }            },            preparePostData: function (data) {                data.c = $("#Name").val();                return data;            },            list: {                match: {                    enabled: false                },                onSelectItemEvent: function () {                    var vals = $("#Name").getSelectedItemData().MobileNumber;                    $("#MobileNumber").val(vals).trigger("change");                }            }        };        $("#Name").easyAutocomplete(options);        var options = {            url: "json/getCoustemersAutoCompleat.php",            theme: "blue-light",            getValue: "MobileNumber",            list: {                match: {                    enabled: false                },                onSelectItemEvent: function () {                    var vals = $("#MobileNumber").getSelectedItemData().Name;                    $("#Name").val(vals).trigger("change");                }            }        };        // $("#MobileNumber").easyAutocomplete(options);        // عرض نوع الاجهزة المتوفرة        var options = {            url: "json/gettypeDevicesAutoCompleat.php",            theme: "blue-light",            getValue: "NameDevices",            ajaxSettings: {                dataType: "json",                method: "POST",                data: {                    dataType: "json"                }            },            preparePostData: function (data) {                data.d = $("#IDTypeDeviceTitle").val();                return data;            },            template: {                type: "iconRight",                fields: {                    iconSrc: "imageUrl"                }            },            list: {                maxNumberOfElements: 99,                match: {                    enabled: false                },                onSelectItemEvent: function () {                    //                    var v = $("#IDTypeDeviceTitle").getSelectedItemData().ID;                    $("#IDTypeDevice").val(v).trigger("change");                }            }        };        $("#IDTypeDeviceTitle").easyAutocomplete(options);        // حجم الذاكرة للجهاز        var optionsSizeMemory = {            url: "json/devices/sizeMemoryDevices.php",            getValue: "SizeMemoryDevice",            template: {                type: "custom",                method: function (value) {                    return value + ' - GB';                }            },            list: {                match: {                    enabled: true                }            },            theme: "blue-light"        };        $("#SizeMemoryDeviceTitle").easyAutocomplete(optionsSizeMemory);        /**         * اضافة عميل جديد مع جهاز         */        $("form#addNewCustemerForm").submit(function () {            $.ajax({                type: 'POST',                dataType: "json",                // make sure you respect the same origin policy with this url:                // http://en.wikipedia.org/wiki/Same_origin_policy                url: 'json/insertNewCustemer.php',                data: $("form#addNewCustemerForm").serialize(),                success: function (data) {                    if (data.suc === true) {                        notie.alert(1, 'تم العملية بنجاح!', 2.5);                        console.log('Rest addNewCustemer Form');                        $('#addNewCustemerForm')[0].reset();                        popupwindow("printInVoice.php?d=" + data.idNewDevices, "printInVoice", 400, 600);                        getLastCustemer();                    }                    else {                        notie.alert(3, data.msg, 2.5);                    }                }            });            return false;        });    });}/** * اعادة ناتج هتمل لعرض العملاء * @param val * @constructor */function ListCustemerGenrats(val) {    var v = '';    v += '<a  onclick="showListDevices({ID:val.ID});" href="#' + val.ID + '" class="showRight2"><img src="icons/custemers.png" alt=""><span>' + val.Name + '<small>' + val.DateAdded + '</small></span></a>';    return v;}/* عرض العملاء في القائمة اليمنة *///<a href="javascript:void(0);" class="showRight2"><img src="style/assets/images/avatar2.png" alt=""><span>Sandra smith<small>Hi! How're you?</small></span></a>//function getLastCustemer() {    $.ajax({        type: 'GET',        dataType: "json",        url: 'json/getLastCoustemers.php',        success: function (data) {            $('#ListCustemerTpl').tmpl(data).appendTo('#listCustemers');            $("#cd-cart").waitMe('hide');        }, error: function (e) {            notie.alert(3, 'لايمكن تحميل قائمة العملاء', 2.5);        }    });}/** *  تحقق من رقم الهاتف * @param num   رقم * @returns {boolean} */function isValidPhoneNumber(num) {    var regex = new RegExp(/^(009665|9665|\+9665|05)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/i);    return regex.test(num); // return true;}/** * التحق لو كان القيمة المضافة سيريال * @param num * @returns {boolean} */function isValidSerial(num) {    if ($.isNumeric(num) == true) {        if (num.length == 15) {            return true;        }        else {            return false;        }    }}/** * عند اللصق النص للبحث */$("#searchID").bind({    copy: function () {    },    paste: function () {        var self = this;        setTimeout(function (e) {            //            var val = $("#searchID").val();            // var pastedData = e.originalEvent.clipboardData.getData('text');            $('#serachLoading').waitMe(({effect: 'bounce'}));            // اذا كانت القيمة المنسوخة رقمية ابحث برقم الهاتف            if (isValidPhoneNumber(val) == true) {                // alert($(self).val());                console.log(isValidPhoneNumber(val));                $("#TitleBtnSearch").html("هاتف");                $("#searchBy").val('m');                var dataObj = {'c': val, 'by': $("#searchBy").val()};                showListDevices(dataObj);            }            // اذا كانت القيمة المنسوخة سيريال ابحث برقم السيريال            if (isValidSerial(val) == true) {                // alert($(self).val());                $("#TitleBtnSearch").html("سيريال");                $("#searchBy").val('s');                var dataObj = {'c': val, 'by': $("#searchBy").val()};                showListDevices(dataObj);            }            else {                searchForm(val);            }        }, 500);    },    cut: function () {    }});// بحث عن عميلfunction searchForm() {    var inputSearchID = $("#searchID").val();    if (inputSearchID.length == 0) {        displayListMenu(false);        return false;    }    var dataObj = {'c': inputSearchID, 'by': $("#searchBy").val()};    if ($("#searchBy").val() == 's') {        showListDevices(dataObj);        return;    }    if ($("#searchBy").val() == 'r') {        showListDevices(dataObj);        return;    }    $('#listCustemers').waitMe({effect: 'bounce'});    $.ajax({        type: 'GET',        dataType: "json",        url: 'json/getCoustemers.php',        data: dataObj,        success: function (data) {            $("#listCustemers").empty();            $('#ListCustemerTpl').tmpl(data).appendTo('#listCustemers');            displayListMenu(true);            $('#serachLoading').waitMe('hide');        },        error: function (e) {            notie.alert(3, globalErrorMessage, 2.5);        }    });}/* عرض قائمة الاجهزة */function showListDevices(d) {    if (d === undefined) {    }    headrTitle('اجهزة العملاء');    $("#Contener").empty();    $("#Contener").waitMe({effect: 'bounce'});    $.getJSON("json/devices/getListDevices.php?" + $.param(d), function (data) {        $("#Contener").empty();        $('#DevicesListTemplate').tmpl(data).appendTo('#Contener');        $("#serachLoading").waitMe('hide');        //console.log($('#DevicesListTemplate'));        $('*[data-poload]').popover({            "html": true,            placement: $(this).attr('data-placement'),            title: '<span  class="text-info "><strong>حالة الجهاز</strong></span>' +            '<a href="#Close"><i class="fa fa-times-circle fa-2 pull-right closeX"></i></a>',            "content": function () {                var div_id = "tmp-id-" + $.now();                return details_in_popup($(this).attr('data-poload'), div_id);            }        }).on('shown.bs.popover', function (e) {            var popover = jQuery(this);            jQuery(this).parent().find('div.popover .closeX').on('click', function (e) {                popover.popover('hide');            });        });        function details_in_popup(link, div_id) {            var div = $('<div/>', {                id: div_id,                text: 'Loading!'            });            $(div).waitMe({effect: 'bounce'});            $.ajax({                url: link,                success: function (response) {                    $('#' + div_id).html(response);                    $(div).waitMe('hide');                }            });            return $(div).waitMe({effect: 'bounce'});        }        $('[data-toggle="tooltip"]').tooltip();        // اضافة الادوات toolbar.js        $(".ToolBarStatus").toolbar({            content: '#toolbar-options',            position: 'bottom'        });        $('.ToolBarStatus').on('toolbarItemClick',            function (event, buttonClicked) {                event.preventDefault();                // this: the element the toolbar is attached to                // console.log($(this).attr('idDevice'));                // console.log($(buttonClicked).attr('dataID'));                addStatusDevices($(buttonClicked).attr('dataID'), $(this).attr('idDevice'))            }        );        return false;    });}/* عرض مراحل تسليم الجهاز */function loadStatUsBar(id) {    $('#resultStatusBar').waitMe({effect: 'bounce'});    $("#resultStatusBar").load("json/getstatUsBarDevices.php?ID=" + id);}function getMaxDateDevices() {    //                             <!--اكبر من تاريخ ثلاثون يوم -->    var listM = $("#loadMaxDate > ul > div");    // $(".slimScrollDiv[name$='man']").waitMe({effect: 'pulse'});    listM.waitMe({effect: 'pulse'});    $.getJSON("json/devices/getMaxDateDevices.php", function (data) {        $('#dropdownMenuMaxDate').empty();        $('#MaxDateTpl').tmpl(data).appendTo('#dropdownMenuMaxDate');        $("#dropdownMenuBdgMaxDate").html(data.length);        $("#loadMaxDate").waitMe('hide');        listM.waitMe('hide');    });}/** * */$(document).ready(function () {    getAlert();    // نسخ الارقام التسلسلية    var clipboard = new Clipboard('.clipboard');    clipboard.on('success', function (e) {        $(e.trigger).text("تم نسخه!");        e.clearSelection();        setTimeout(function () {            $(e.trigger).text("نسخ");        }, 2500);    });    clipboard.on('error', function (e) {        $(e.trigger).text("Can't in Safari");        setTimeout(function () {            $(e.trigger).text("Copy");        }, 2500);    });    console.log("ready!");    $("#clearSearch").on('click', function () {        $("#searchID").val('');    });    // تحميل التمبلت الى الصفحة الرئيسية    $.get("js/tpl/tpl.html", function (d) {        $("body").append(d)        editDevicesType();    });    showListDevices({Parm: 'notFinsh'}),        // getLastCustemer();        $('[data-toggle="popover"]').popover({html: true});    // اضافة التحميل    $('[loading=true]').waitMe({effect: 'pulse'});    //displayListMenu(true);    $.getJSON("json/devices/getCollectionDevices.php", function (data) {        $('#dropdownMenuNotfctionTpl').tmpl(data).appendTo('#dropdownMenuNotfction');        $("#dropdownMenuNotfctionBdg").html(data.length);        $("#loadNotfctionBdg").waitMe('hide');    });    ImportantDevicesNotF();    InShowRoomNotF();    getMaxDateDevices();    $.getJSON("json/getSetting.php?reqType=json", function (data) {        var mDate = data[0].maxDate;        $('#jsonMaxDate').html('<a href="#" class="text-center">تاريخها تعدى ' + mDate + ' يوم</a>')        // $('#jsonMaxDate').append('<input id="ex1" data-slider-id=\'ex1Slider\' type="text" data-slider-min="-5" data-slider-max="20" data-slider-step="1" data-slider-value="14"/>');// تعديل التاريخ الاقصى للجهاز        $("#slider-range-min").slider({            range: "min",            value: mDate,            min: 10,            max: 100,            step: 5,            slide: function (event, ui) {                $('#jsonMaxDate').html('<a href="#" class="text-center">تاريخها تعدى ' + ui.value + ' يوم</a>');                $.post("json/setting/setSetting.php", {maxDate: ui.value}, function (data) {                    console.log(data);                    getMaxDateDevices();                });            }        });    });    /**     * بحث عن طريق الاسم او رقم الهاتف او سيريال الجهاز     */    $("#searchID").keyup(function () {        searchForm();    });    //  تفعيل البحث    $(".input-group-btn .dropdown-menu li a").click(function () {        var selText = $(this).html();        var searchBy = $("#searchBy").val($(this).attr('datas'));        $(this).parents('.input-group-btn').find('.btn-search').html(selText);        searchForm();    });    // تحميل عند نزول السكروليلر للاسفل    var win = $(window);    var lastID = 0;    // Each time the user scrolls    // $('ul#foo:first').show();    win.scroll(function () {        var url = window.location.href;        var hashTag = window.location.hash;        if (hashTag == "") {            if ($(document).height() - win.height() == win.scrollTop()) {                $("#Contener").waitMe({effect: 'win8'});                $.ajax({                    url: 'json/devices/getListDevices.php?getAll=true&lastID=' + lastID,                    dataType: 'json',                    success: function (data) {                        if (jQuery.isEmptyObject(data)) {                            $('#Contener').waitMe('hide');                            notie.alert(4, 'لايوجد بيانات اضافية', 2.5);                            return;                        }                        lastID = $(data).last()[0]['idDevices'];                        $('#Contener').waitMe('hide');                        $('#DevicesListTemplate').tmpl(data).appendTo('#Contener');                        $('#Contener').waitMe('hide');                    }, error: function (e) {                        notie.alert(3, globalErrorMessage, 2.5);                        $('#Contener').waitMe('hide');                    }                });            }            // console.log(hashTag);        }        //if (loadAll == false) {        // End of the document reached?    });    $.getJSON("json/setting/getSetting.php", function (json) {        // console.log( "JSON Data: " + json.search);        $.each(json, function (key, val) {            $("#searchID").val(val.search);        });        $("#searchID").focus();    });});/** * طباعة الفاتورة * @param ID  رقم الجهاز */function printDevice(ID) {    popupwindow("printInVoice.php?d=" + ID, "printInVoice", 400, 600);}/** * نافذة طباعة الفاتورة * @param url * @param title * @param w * @param h * @returns {Window} */function popupwindow(url, title, w, h) {    var left = (screen.width / 2) - (w / 2);    var top = (screen.height / 2) - (h / 2);    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);}/** * اضافة حالة الجهاز * @param IDdevices */function showModel(IDdevices) {    // console.log($.param(showModel));    var Msg = "";    if (arguments[1]) {        Msg = arguments[1];    }    notie.input({        type: 'text',        placeholder: 'حالة الجهاز:',        prefilledValue: Msg    }, 'الحالة:', 'ارسال', 'الغاء', function (valueEntered) {        $.ajax({            type: "POST",            url: 'json/insertStatusDevices.php',            dataType: "json",            data: {'ID': IDdevices, title: valueEntered}, // serializes the form's elements.            success: function (data) {                notie.alert(data.idMsg, data.msg, 2.5);            },            error: function (e) {                notie.alert(3, globalErrorMessage, 2.5);            }        });    });    var options = {        url: "json/devices/getCommentAutoCompleat.php",        getValue: "title",        list: {            match: {                enabled: true            }        },        theme: "blue-light"    };    $("input[placeholder=الحالة]").easyAutocomplete(options);}/** * اضافة حالة الجهاز * @param IDdevices */function deleteThisStatUs(IDdevices, idCustemer) {    //$("div[name=parent" +IDdevices+ "]").hide();    $.ajax({        type: "POST",        url: 'json/deleteStatusDevices.php',        dataType: "json",        data: {'ID': IDdevices}, // serializes the form's elements.        success: function (data) {            notie.alert(data.idMsg, data.msg, 2.5);            $("div[name=parent" + IDdevices + "]").toggle("explode");        },        error: function (e) {            notie.alert(3, globalErrorMessage, 2.5);        }    });}/** * تعديل حالة الجخهاز الى تم ايقافه * @param IDdevices رقم الجهاز */function finshDevice(IDdevices) {    $.ajax({        type: "GET",        url: 'json/editFinshStatusDevices.php',        dataType: "json",        data: {'ID': IDdevices}, // serializes the form's elements.        success: function (data) {            notie.alert(data.idMsg, data.msg, 2.5);            $("div[name=parent" + IDdevices + "]").toggle("explode");        },        error: function (e) {            notie.alert(3, globalErrorMessage, 2.5);        }    });}/** * اضافة مرجعية للجهاز * @param IDdevices *//** * تعديل الرقم المرجعي لدى شركة الصيانة * @param IDdevices */function editRefDevices(IDdevices) {    notie.input({        type: 'text',        placeholder: 'رقم مرجع::',        prefilledValue: ''    }, 'تعديل المرجع:', 'ارسال', 'الغاء', function (valueEntered) {        $.ajax({            type: "POST",            url: 'json/editRefDevices.php',            dataType: "json",            data: {'ID': IDdevices, title: valueEntered}, // serializes the form's elements.            success: function (data) {                notie.alert(data.idMsg, data.msg, 2.5);            },            error: function (e) {                notie.alert(3, globalErrorMessage, 2.5);            }        });    });}/** * تعديل رقم الشحنة * @param IDdevices */function editTracNumber(IDdevices) {    notie.input({        type: 'text',        placeholder: 'رقم شحنة:',        prefilledValue: ''    }, 'رقم شحنة:', 'ارسال', 'الغاء', function (valueEntered) {        $.ajax({            type: "POST",            url: 'json/editTracNumberDevices.php',            dataType: "json",            data: {'ID': IDdevices, tracNumber: valueEntered}, // serializes the form's elements.            success: function (data) {                notie.alert(data.idMsg, data.msg, 2.5);            },            error: function (e) {                notie.alert(3, globalErrorMessage, 2.5);            }        });    });}/** * تعديل مبلغ الصيانة * @param IDdevices */function editMonyDevices(IDdevices) {    notie.input({        type: 'text',        placeholder: 'مبلغ الصيانة:',        prefilledValue: ''    }, 'مبلغ الصيانة:', 'ارسال', 'الغاء', function (valueEntered) {        $.ajax({            type: "POST",            url: 'json/editMonyDevices.php',            dataType: "json",            data: {'ID': IDdevices, Mony: valueEntered}, // serializes the form's elements.            success: function (data) {                notie.alert(data.idMsg, data.msg, 2.5);            },            error: function (e) {                notie.alert(3, globalErrorMessage, 2.5);            }        });    });}/** * تعديل اهمية الجهاز * @param IDdevices  رقم الجهاز */function editImportantDevices(IDdevices) {    $("#loadImportant").waitMe({effect: 'pulse'});    var offest = $("#loadImportant").offset();    move('.greenColor')        .translate(offest)        .end();    $.ajax({        type: "POST",        url: 'json/devices/editImportantDevices.php',        dataType: "json",        data: {'ID': IDdevices}, // serializes the form's elements.        success: function (data) {            $.when(ImportantDevicesNotF()).done(function () {                notie.alert(data.idMsg, data.msg, 2.5);            });        },        error: function (e) {            notie.alert(3, globalErrorMessage, 2.5);            $("#loadImportant").waitMe('hide');        }    });}/** *  وصل المعرض الجهاز * @param IDdevices  رقم الجهاز */function editInShowRoomDevices(IDdevices) {    $('#loadInshowRoom').waitMe({effect: 'pulse'});    $.ajax({        type: "POST",        url: 'json/devices/editInShowRoomDevices.php',        dataType: "json",        data: {'ID': IDdevices}, // serializes the form's elements.        success: function (data) {            $.when(InShowRoomNotF()).done(function () {                notie.alert(data.idMsg, data.msg, 2.5);            });        },        error: function (e) {            notie.alert(3, globalErrorMessage, 2.5);        }    });}/** * متابعة حالة الاجهزة وعرضها */function showDevicesIsNotFinsh() {    $("#Contener").load("json/getDevicesIsNotFinsh.php", function () {        $('#exported').DataTable();        $("p[data-ID]").each(function (index) {            var id = $(this).attr('data-ID');            $(this).load("json/getStatusDevices.php?ID=" + id);        });    });}function displayListMenu(s) {    if (s == true) {        $('#cbp-spmenu-s1').addClass('cbp-spmenu-open');    }    else {        $('#cbp-spmenu-s1').removeClass('cbp-spmenu-open');    }}/** * حصول على بيانات الاجهزة رميا شارت */function getChart() {    $.ajax({        type: "POST",        url: 'json/getChart.php',        dataType: "json",        data: {'ID': null}, // serializes the form's elements.        success: function (data) {            notie.alert(data.idMsg, data.msg, 2.5);            headrTitle('الاجهزة');            $("#Contener").html(creatChart('myPieChart', 'بيانات الاجهزة'));            $("#Contener").append(creatChart('myBarChart', 'العملاء'));            var ctx = document.getElementById("myPieChart").getContext("2d");            window.myPie = new Chart(ctx).Pie(data.Pia);            var ctx = document.getElementById("myBarChart").getContext("2d");            window.myBar = new Chart(ctx).Pie(data.Bar);        },        error: function (e) {            notie.alert(3, globalErrorMessage, 2.5);        }    });}function creatChart(ID, t) {    var h = ' <div class="col-md-6"> ';    h += '<div class="panel panel-white">';    h += ' <div class="panel-heading">';    h += ' <h3 class="panel-title">' + t + '</h3>';    h += '</div>';    h += '  <div class="panel-body">';    h += ' <div>';    h += ' <canvas id="' + ID + '" height="200" width="200" style="width: 200px; height: 200px;"></canvas>';    h += '</div>';    h += '</div>';    h += '</div>';    h += '</div>';    return h;}function headrTitle(t) {    var h = '';    h += '<div class="page-title">'    h += ' <h3>' + t + '</h3>'    h += ' <div class="page-breadcrumb">'    h += '  <ol class="breadcrumb">'    h += '<li><a href="index.html">Home</a></li>'    h += ' <li><a href="#">' + t + '</a></li>'    h += '  </ol>'    h += ' </div>'    h += '</div> '    $('#titlePage').html(h)}/** * تعديل نوع الجهاز * @param id */function editDevicesType(id) {    var IDInput = $("#IDTypeDeviceTitle");    var options = {        url: "json/gettypeDevicesAutoCompleat.php",        theme: "blue-light",        getValue: "NameDevices",        ajaxSettings: {            dataType: "json",            method: "POST",            data: {                dataType: "json"            }        },        preparePostData: function (data) {            data.d = IDInput.val();            return data;        },        template: {            type: "iconRight",            fields: {                iconSrc: "imageUrl"            }        },        list: {            maxNumberOfElements: 999,            match: {                enabled: false            },            onSelectItemEvent: function () {                //                var v = $("#IDTypeDeviceTitle").getSelectedItemData().ID;                $("#IDTypeDevice").val(v).trigger("change");            }        }    };    $('#editDevicesTypeModal').on('show.bs.modal', function (event) {        var button = $(event.relatedTarget) // Button that triggered the modal        var idDevice = button.attr('data-id');        var modal = $(this)        $.ajax({            type: "GET",            url: 'json/devices/getInfoDeviceByID.php',            dataType: "json",            data: {'ID': idDevice}, // serializes the form's elements.            success: function (data) {                modal.find('#Name').val(data[0].Name);                modal.find('#MobileNumber').val(data[0].MobileNumber);                modal.find('#Serial').val(data[0].Serial);                modal.find('#IDTypeDeviceTitle').val(data[0].NameDevices);                modal.find('#Comment').val(data[0].Comment);                modal.find('#IDTypeDevice').val(data[0].IDTypeDevice);                modal.find('#IdCustemer').val(data[0].IdCustemer);                modal.find('#idDevices').val(data[0].idDevices);                modal.find('#Mony').val(data[0].Mony);                modal.find('#exampleModalLabel').val('جهاز رقم #' + data[0].idDevices);                $('#editDevicesTypeModal').waitMe('hide');            },            error: function (e) {                notie.alert(3, globalErrorMessage, 2.5);            }        });        IDInput.easyAutocomplete(options);        // IDInput.focus();    });}/** * حفظ تعديل الجهاز */function saveEditDevices() {    // $ ( '#editDevicesTypeModal' ).waitMe ({ effect : 'pulse' });    $.ajax({        type: "POST",        url: 'json/devices/editCustemerAndDevices.php',        dataType: "json",        data: $("#editCustemerAndDevices").serialize(), // serializes the form's elements.        success: function (data) {            notie.alert(1, data.msg, 2.5);            $('#editDevicesTypeModal').modal('toggle');        },        error: function (e) {            notie.alert(3, globalErrorMessage, 2.5);        }    });}function InShowRoomNotF() {    // اضافة الاجهزة اللتي وصلت المعرض    $.getJSON("json/devices/getInShowRoomDevices.php", function (data) {        $('#InShowRoomTpl').tmpl(data).appendTo('#dropdownMenuInshowRoom');        $("#dropdownMenuBdgInshowRoom").html(data.length);        $("#loadInshowRoom").waitMe('hide');    }).fail(function () {        $("#loadInshowRoom").waitMe('hide');        notie.alert(3, 'لم يتم تحميل قائمة الاجهزة المهمة بطريقة صحيحة', 2.5);    })}// اضافة للمهمfunction ImportantDevicesNotF() {    $.getJSON("json/devices/getImportantDevices.php", function (data) {        $('#ImportantTpl').tmpl(data).appendTo('#dropdownMenuImportant');        $("#dropdownMenuBdgImportant").html(data.length);        $("#loadImportant").waitMe('hide');    });}/** * اضافة تم الاتصال بالعميل او تم ارسال رسالة نصية * @param n رقم الرسالة * @param IDdevices   رقم الجهاز */function addStatusDevices(n, IDdevices) {    // alert(3333);    var msg = ["تم الاتصال بالعميل", "تم ارسال رسالة للعميل", "ايكلاود مغلق", "تم استلام الجهاز من قبل العميل"];    showModel(IDdevices, msg[n]);    // $.ajax({    //     type: "POST",    //     url: 'json/insertStatusDevices.php',    //     dataType: "json",    //    //     data: {'ID': IDdevices, title: "< "+msg[n]+" >"}, // serializes the form's elements.    //    //     success: function (data) {    //    //         notie.alert(data.idMsg, data.msg, 2.5);    //     },    //     error: function (e) {    //         notie.alert(3, globalErrorMessage, 2.5);    //     }    //    // });}function openActiveStatusApple(u) {    var o = popupwindow('https://www.icloud.com/activationlock/', 'Active', 800, 700);}/** * حصول على بيانات الاجهزة رميا شارت */function mysqlBackUp() {    $.post("dbBackUp.php", function (data) {        notie.alert(1, data, 2.5);    });}function getListTypeDevices() {    $("#Contener").load("json/devices/getListTypeDevices.php", function () {        $('#exported').DataTable();        /**         * تعديل اسم الجهاز         */        $(":input[traget='change']").change(function () {            var val = $(this).val();            var id = $(this).attr('traget-input');            $.ajax({                type: "POST",                url: 'json/devices/setNameTypeDevices.php',                dataType: "json",                data: {'ID': id, NameDevices: val}, // serializes the form's elements.                success: function (data) {                    notie.alert(data.idMsg, data.msg, 2.5);                },                error: function (e) {                    notie.alert(3, globalErrorMessage, 2.5);                }            });        });    });}/** * تغير صورة نوع الجهاز * @param id * @param u */function setImageTypedevices(id, u) {    $.ajax({        type: "POST",        url: 'json/devices/setImageTypeDevices.php',        dataType: "json",        data: {'ID': id, imageUrl: u}, // serializes the form's elements.        success: function (data) {            $('#myModalImagesViewrer').modal('hide');            notie.alert(data.idMsg, data.msg, 2.5);            var newUrl = u.substring(4, u.length);            $("img[imgTarget=" + id + "]").attr('src', newUrl);        },        error: function (e) {            $('#myModalImagesViewrer').modal('hide');            notie.alert(3, globalErrorMessage, 2.5);        }    });}$(document.body).on('hidden.bs.modal', function () {    $('#myModalImagesViewrer').removeData('bs.modal')});/** * اخد نسخة احتياطية * @type {confirmExit} */window.onbeforeunload = confirmExit;function confirmExit() {    mysqlBackUp();    return "حفظ نسخة احتياطية ";}