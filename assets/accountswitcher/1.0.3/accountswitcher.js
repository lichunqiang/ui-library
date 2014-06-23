define("accountswitcher/1.0.3/accountswitcher", [ "$", "gallery/handlebars/1.0.2/handlebars", "arale/popup/1.1.5/popup", "arale/overlay/1.1.3/overlay", "arale/position/1.0.1/position", "arale/iframe-shim/1.0.2/iframe-shim", "arale/widget/1.1.1/widget", "arale/base/1.1.1/base", "arale/class/1.1.0/class", "arale/events/1.1.0/events", "alipay/deleter/1.0.0/deleter", "gallery/placeholders/3.0.2/placeholders", "tinyscrollbar/1.0.0/tinyscrollbar", "tinyscrollbar/1.0.0/tinyscrollbar.css", "./accountswitcher.css" ], function(require, exports, module) {
    window.debug = window.console && location.protocol !== "https:";
    var $ = require("$");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars");
    var Popup = require("arale/popup/1.1.5/popup");
    var deleter = require("alipay/deleter/1.0.0/deleter");
    require("gallery/placeholders/3.0.2/placeholders");
    require("tinyscrollbar/1.0.0/tinyscrollbar");
    require("./accountswitcher.css");
    $.ajaxSetup({
        cache: false,
        timeout: 18e4
    });
    Handlebars.registerHelper("is", function(v1, v2, options) {
        if (v1 == v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper("isnt", function(v1, v2, options) {
        if (v1 !== v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    Handlebars.registerHelper("searchArea", function(text) {
        if (!text) {
            return "";
        }
        var fullText = jQuery("<textarea />").html(text).val().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return '<span class="sWords">' + fullText + "</span>";
    });
    Handlebars.registerHelper("isNotEmpty", function(conditional, options) {
        if (conditional) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    var filterSearchTimer;
    var accountSwitchContainer, accountSwitchContainerCss, accountSwitchTrigger, accountSwitchTriggerCss, accountSwitchTemplate, accountSwitchInput, jsonUrl, dataList, oDataList, queryData, bSwitchDefault;
    var _updateData = function(dataList) {
        if (dataList) {
            oDataList = Object.prototype.toString.call(dataList).indexOf("String") > 0 ? JSON.parse(dataList) : dataList;
        }
    };
    var accountSwitcher = {
        init: function(params) {
            params = params || {};
            accountSwitchContainer = params.accountSwitchContainer || $(".accountSwitcher");
            accountSwitchContainerCss = params.accountSwitchContainerCss || {};
            accountSwitchTrigger = params.accountSwitchTrigger || $(".accountSwitch");
            accountSwitchTriggerCss = params.accountSwitchTriggerCss || {};
            accountSwitchTemplate = params.accountSwitchTemplate || $("#accountsMenuTemplate");
            accountSwitchInput = params.accountSwitchInput || $("#billUserId");
            jsonUrl = params.jsonUrl || "accountSwitch.json";
            dataList = params.dataList || "";
            queryData = params.queryData || {};
            bSwitchDefault = !!params.bSwitchDefault;
            if (!accountSwitchContainer.length) {
                return;
            }
            _updateData(dataList);
            // get avoid of parent overflow hidden
            $("body").append(accountSwitchContainer);
            accountSwitchContainer.css(accountSwitchContainerCss);
            accountSwitchTrigger.css(accountSwitchTriggerCss);
            var xSendQueryFactoryForAccounts = function xSendQueryFactoryForAccounts(xCallbackFunc, oQuerys) {
                return function xSendQueryForAccounts(params, action) {
                    if (window.debug) {
                        console.log(arguments.callee.name);
                    }
                    var dataString = $.extend({}, params, oQuerys);
                    if (window.debug) {
                        console.log(dataString);
                    }
                    var queryAjax = $.ajax({
                        url: action,
                        type: "GET",
                        data: dataString,
                        success: xCallbackFunc,
                        error: xCallbackFunc
                    });
                };
            };
            var xPageQueryFactoryForAccounts = function xPageQueryFactoryForAccounts(xPrepareForAccounts, xQueryFactoryForAccounts, oQuerys) {
                return xQueryFactoryForAccounts(function xCallbackForAccounts(result, statusText, xhr) {
                    if (window.debug) {
                        console.log(arguments.callee.name);
                    }
                    if (statusText !== "success" || !result || result.stat !== "ok") {
                        if (window.debug) {
                            console.log("Ajax Data Error!");
                        }
                        xPrepareForAccounts({
                            loading: "error"
                        });
                        return;
                    }
                    if (window.debug) {
                        console.log(JSON.stringify(result));
                    }
                    return xPrepareForAccounts(result.result, result.queryForm);
                }, oQuerys);
            };
            var xPrepareDataFactoryForAccounts = function xPrepareDataFactoryForAccounts(xNextForAccounts) {
                return function xPrepareDataForAccounts(oData, oQuerys) {
                    if (window.debug) {
                        console.log(arguments.callee.name);
                    }
                    var source = accountSwitchTemplate.html();
                    var tpl = Handlebars.compile(source);
                    var html = tpl(oData);
                    accountSwitchContainer.empty().prepend(html);
                    xNextForAccounts(oQuerys);
                };
            };
            var queryForAccounts = function queryForAccounts() {
                var _prepare = xPrepareDataFactoryForAccounts(function() {
                    accountSwitchContainer.trigger("accountSwitchLoading", arguments);
                    accountSwitchContainer.trigger("accountSwitchLoaded", arguments);
                });
                if (oDataList) {
                    _prepare(oDataList, queryData);
                } else {
                    var _queryForAccounts = xPageQueryFactoryForAccounts(_prepare, xSendQueryFactoryForAccounts, {});
                    _queryForAccounts(queryData, jsonUrl);
                }
            };
            accountSwitchContainer.click(function selectMenuProxy(ev) {
                var tgt = $(ev.target);
                var menuitem = tgt.closest("li.ui-select-item div");
                var name, email;
                if (menuitem.length) {
                    name = menuitem.find(".accountName").text();
                    accountSwitchTrigger.find(".accountName").text(name).attr("title", name).toggleClass("noAlias", !name);
                    email = menuitem.find(".accountEmail").text();
                    accountSwitchTrigger.find(".accountEmail").text(email).attr("title", email).toggleClass("noAlias", !name);
                    var currentSelect = menuitem.data("id");
                    if (window.debug) {
                        console.log("switch Select: " + (currentSelect || "(null)"));
                    }
                    accountSwitchInput.val(currentSelect).trigger("changed");
                    accountSwitchMenu.hide();
                    return false;
                }
            });
            var accountSwitchLoader = function() {
                accountSwitchContainer.find(".ui-selectmenu-menu-dropdown").tinyscrollbar();
                var items = accountSwitchContainer.find("li.ui-select-item");
                items.removeClass("ui-select-item-odd").filter(":visible:odd").addClass("ui-select-item-odd");
                // define search box
                var filterSearch = function filterSearch(ev) {
                    // var key = (window.event) ? window.event.keyCode : ev.keyCode;
                    // console.log(key);
                    var keywords = $.trim($(this).val()).replace(/;/g, "");
                    clearTimeout(filterSearchTimer);
                    filterSearchTimer = setTimeout(function filterSearcher() {
                        items.parent().find("li.ui-select-item").show().each(function(idx, el) {
                            var parent = $(el);
                            var titles = parent.find("span.sWords");
                            titles.each(function highlightText(i, sTitle) {
                                var jSTitle = $(sTitle);
                                texts = jSTitle.text();
                                if (texts) {
                                    if (keywords && texts.toLowerCase().indexOf(keywords.toLowerCase()) >= 0) {
                                        texts = texts.replace(new RegExp("(" + keywords.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + ")", "i"), "#*$1*#");
                                        texts = texts.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                        texts = texts.replace(/#\*(.*)\*#/, '<span class="ui-select-item-text-highlight">$1</span>');
                                        if (window.debug) {
                                            console.log("filter highlight:    " + texts);
                                        }
                                    } else {
                                        texts = texts.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                                    }
                                    jSTitle.html(texts);
                                }
                            });
                            if (keywords && !parent.find(".ui-select-item-text-highlight").length) {
                                parent.hide();
                            }
                        });
                        items.removeClass("ui-select-item-odd").filter(":visible:odd").addClass("ui-select-item-odd");
                        items.parent().find(".ui-select-item-empty").toggle(!items.parent().find("li.ui-select-item:visible").length).find(".emptyInfo").text("无匹配结果");
                        accountSwitchContainer.find(".ui-selectmenu-menu-dropdown").tinyscrollbar_update(0);
                    }, 50);
                };
                accountSwitchContainer.find(".filter-search-box").toggle(accountSwitchContainer.find(".ui-selectmenu-menu-dropdown ul").height() > accountSwitchContainer.height());
                // do filter search
                accountSwitchContainer.find(".filter-search-box input").unbind().on("change click keyup", filterSearch).on("mouseout", function() {
                    this.blur();
                }).on("mouseover", function() {
                    this.focus();
                });
                deleter(accountSwitchContainer.find(".filter-search-box input"));
                // toggle icon on for selected item
                var currentSelect = accountSwitchInput.val();
                if (window.debug) {
                    console.log("currentSelect: " + (currentSelect || "(null)"));
                }
                if (currentSelect) {
                    accountSwitchContainer.find("li.ui-select-item div").find(".iconSelect").hide().end().filter(function(i, n) {
                        return jQuery(n).data("id") + "" === currentSelect;
                    }).find(".iconSelect").show();
                }
            };
            accountSwitchContainer.bind("accountSwitchLoading", accountSwitchLoader);
            var accountSwitchMenu = new Popup({
                trigger: accountSwitchTrigger,
                triggerType: "click",
                align: {
                    baseXY: [ 0, "100%-1" ],
                    baseElement: accountSwitchTrigger
                },
                element: accountSwitchContainer
            }).before("show", function() {
                accountSwitchContainer.empty().html(Handlebars.compile(jQuery("#accountsMenuTemplate").html())({
                    loading: "ing"
                }));
            }).after("show", function() {
                queryForAccounts();
                accountSwitchTrigger.addClass("ui-selectmenu-open");
            }).after("hide", function() {
                accountSwitchTrigger.removeClass("ui-selectmenu-open");
            });
            var setSelectValue = function(uname, mail, id) {
                uname = uname || "";
                mail = mail || "";
                if (uname || mail) {
                    accountSwitchTrigger.find(".accountName").text(uname).attr("title", uname).toggleClass("noAlias", !uname);
                    accountSwitchTrigger.find(".accountEmail").text(mail).attr("title", mail).toggleClass("noAlias", !uname);
                    accountSwitchInput.val(id || "").trigger("changed");
                }
            };
            accountSwitchInput.bind("switch", function() {
                if (oDataList) {
                    var oDataListSelected;
                    var selected = accountSwitchInput.val();
                    if (selected) {
                        oDataListSelected = $.grep(oDataList, function(n, i) {
                            return n["accountId"] === selected;
                        })[0];
                    }
                    if (!oDataListSelected) {
                        oDataListSelected = oDataList[0];
                    }
                    setSelectValue(oDataListSelected["accountName"], oDataListSelected["accountEmail"], oDataListSelected["accountId"]);
                }
            });
            if (bSwitchDefault) {
                accountSwitchInput.trigger("switch");
            }
            accountSwitchTrigger.show();
            return this;
        },
        updateData: function(dataList) {
            _updateData(dataList);
            if (bSwitchDefault) {
                accountSwitchInput.trigger("switch");
            }
        }
    };
    module.exports = accountSwitcher;
});