import HtmlRenderer from './HtmlRenderer.js';
import PopupService from './PopupService.js';
import {random} from './helpers.js';

export default class Card
{
    constructor(title, imageUrl, popupService)
    {
        this.title    = title;
        this.imageUrl = imageUrl;

        this.onDelete = null;

        if (popupService instanceof PopupService) {
            this._popupService = popupService;
        } else {
            throw new Error('Expected PopupService');
        }
    }

    static factory(data)
    {

    }

    set onDelete(newValue)
    {
        if (newValue === null || typeof newValue === 'function') {
            this._onDelete = newValue;
        }
    }

    get onDelete()
    {
        return this._onDelete;
    }

    set cssClassCad(newValue)
    {
        this._cssClassCard = newValue;
    }

    get cssClassCard()
    {
        return this._cssClassCard || 'place-card';
    }

    set cssClassDeleteIcon(newValue)
    {
        this._cssClassDeleteIcon = newValue;
    }

    get cssClassDeleteIcon()
    {
        return this._cssClassDeleteIcon || 'place-card__delete-icon';
    }

    set cssClassCardImage(newValue)
    {
        this._cssClassCardImage = newValue;
    }

    get cssClassCardImage()
    {
        return this._cssClassCardImage || 'place-card__image';
    }

    set cssClassCardName(newValue)
    {
        this._cssClassCardName = newValue;
    }

    get cssClassCardName()
    {
        return this._cssClassCardName || 'place-card__name';
    }

    set cssClassLikeIcon(newValue)
    {
        this._cssClassLikeIcon = newValue;
    }

    get cssClassLikeIcon()
    {
        return this._cssClassLikeIcon || 'place-card__like-icon';
    }

    set cssClassLikedIcon(newValue)
    {
        this._cssClassLikedIcon = newValue;
    }

    get cssClassLikedIcon()
    {
        return this._cssClassLikedIcon || 'place-card__like-icon_liked';
    }

    set cssClassCardDescription(newValue)
    {
        this._cssClassCardDescription = newValue;
    }

    get cssClassCardDescription()
    {
        return this._cssClassCardDescription || 'place-card__description';
    }

    set title(newValue)
    {
        const type = typeof newValue;

        if (type !== 'string') {
            throw Error('"title" must be non empty string, but supplied "' + type + '"');
        }

        const trimmedString = newValue.trim();

        if (trimmedString.length === 0) {
            throw Error('"title" must be non empty string');
        }

        this._title = trimmedString;

        if (this._cardHTMLElement) {
            const titleElement = document.getElementById(this.getTitleId());

            if (titleElement) {
                titleElement.textContent = this._title;
            }
        }
    }

    get title()
    {
        return this._title;
    }

    set imageUrl(newValue)
    {
        const type = typeof newValue;

        if (type !== 'string') {
            throw Error('"imageUrl" must be non empty string, but supplied "' + type + '"');
        }

        const trimmedString = newValue.trim();

        if (trimmedString.length === 0) {
            throw Error('"imageUrl" must be non empty string');
        }

        this._imageUrl = trimmedString;

        if (this._cardHTMLElement) {
            const bgImageElement = document.getElementById(this.getBackgroundId());

            if (bgImageElement) {
                bgImageElement.style.backgroundImage = `url(${this._imageUrl})`;
            }
        }
    }

    get imageUrl()
    {
        return this._imageUrl;
    }

    like()
    {
        if (this._cardHTMLElement) {
            const likeElement = document.getElementById(this.getLikeIconId());

            if (likeElement) {
                likeElement.classList.toggle(this.cssClassLikedIcon);
            }
        }
    }

    delete()
    {
        if (this._cardHTMLElement) {
            this._cardHTMLElement.remove();
            this._cardHTMLElement = undefined;

            if (this._onDelete) {
                this._onDelete(this);
            }
        }
    }

    zoom()
    {
        if (this._cardHTMLElement) {
            this._popupService.load('image-zoom-popup').then((popup) => {
                popup.open();

                document.getElementById('card-image').src = this._imageUrl;
            });
        }
    }

    render()
    {
        // TODO: use BaseWidget instead
        this._cardHTMLElement = HtmlRenderer.render({
            id: this.getId(),
            element: 'div',
            classList: [this.cssClassCard],
            children: [
                {
                    id: this.getBackgroundId(),
                    element: 'div',
                    classList: [this.cssClassCardImage],
                    style: {
                        backgroundImage: `url(${this._imageUrl})`,
                        cursor: 'pointer'
                    },
                    on: {
                        click: () => this.zoom()
                    },
                    children: [
                        {
                            element: 'button',
                            classList: [this.cssClassDeleteIcon],
                            on: {
                                click: () => this.delete()
                            }
                        }
                    ]
                },
                {
                    element: 'div',
                    classList: [this.cssClassCardDescription],
                    children: [
                        {
                            id: this.getTitleId(),
                            element: 'h3',
                            classList: [this.cssClassCardName],
                            textContent: this._title
                        },
                        {
                            id: this.getLikeIconId(),
                            element: 'button',
                            classList: [this.cssClassLikeIcon],
                            on: {
                                click: () => this.like()
                            }
                        }
                    ]
                }
            ]
        });

        return this._cardHTMLElement;
    }

    getId()
    {
        if (! this._cardId) {
            this._cardId = this.generateId('card');
        }

        return this._cardId;
    }

    getLikeIconId()
    {
        if (! this._likeElementId) {
            this._likeElementId = this.generateId('like');
        }

        return this._likeElementId;
    }

    getTitleId()
    {
        if (! this._titleId) {
            this._titleId = this.generateId('title');
        }

        return this._titleId;
    }

    getBackgroundId()
    {
        if (! this._backgroundId) {
            this._backgroundId = this.generateId('background');
        }

        return this._backgroundId;
    }

    generateId(salt)
    {
        return this._title + '_' + random(0, 100000) + '_' + salt;
    }
}
