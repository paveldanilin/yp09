import {loadHtml} from "./helpers.js";

export default class BaseWidget
{
    constructor(containerId, htmlTemplate, context)
    {
        this._htmlTemplate = htmlTemplate;
        this._template = undefined;
        this._htmlElement = document.getElementById(containerId);
        this._context = context || {};
        this._isLoaded = false;

        const widget = this;

        this._proxyContext = new Proxy(this._context, {
            set(target, prop, value) {
                const oldValue = target[prop];

                target[prop] = value;

                if (oldValue === value) {
                    return true;
                }

                widget.render(target);

                widget.onChange(prop, oldValue, value);

                return true;
            }
        });

        this.load().then(() => {
            widget.render(context);
            widget.onInit();
        });
    }

    onInit()
    {
    }

    onChange(property, oldValue, newValue)
    {
    }

    load()
    {
        if (this.isLoaded()) {
            return new Promise(function(resolve, reject) {
                return resolve();
            });
        }

        const widget = this;
        const htmlTemplate = this._htmlTemplate;

        return new Promise(function(resolve, reject) {

            loadHtml(htmlTemplate, function (HTMLTemplateLoaded) {

                if (HTMLTemplateLoaded) {
                    widget._template = HTMLTemplateLoaded.documentElement.innerHTML;
                    widget._isLoaded = true;
                    resolve();
                } else {
                    widget._isLoaded = false;
                    reject(new Error('Could not load template'));
                }
            });
        });
    }

    render(context)
    {
        if (this.isLoaded() && this._template && this._htmlElement) {
            const preparedContext = {};

            Object.keys(context).forEach(function(key) {
                preparedContext['%' + key + '%'] = context[key];
            });

            this._htmlElement.innerHTML = this._template.replace(/%\w+%/g, function(all) {
                return preparedContext[all] || all;
            });
        }
    }

    isLoaded()
    {
        return this._isLoaded;
    }

    getContextValue(name)
    {
        return this._proxyContext[name] || null;
    }

    setContextValue(name, value)
    {
        this._proxyContext[name] = value;
    }

    getHtmlElement()
    {
        return this._htmlElement;
    }
}
