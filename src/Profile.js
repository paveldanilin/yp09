import BaseWidget from "./BaseWidget.js";
import PopupService from './PopupService.js';
import ValidatorService from './ValidatorService.js';

export default class Profile extends BaseWidget
{
    constructor(containerId, name, job, popupService)
    {
        super(containerId, 'templates/profile.template.html', {name: name, job: job});

        this.name = name;
        this.job = job;

        if (popupService instanceof PopupService) {
            this._popupService = popupService;
        } else {
            throw new Error('Expected PopupService');
        }
    }

    onInit()
    {
        this.subscribeOnEvents();
    }

    onChange(property, oldValue, newValue)
    {
        this.subscribeOnEvents();
    }

    set name(newValue)
    {
        this.setContextValue('name', newValue);
    }

    get name()
    {
        return this.getContextValue('name');
    }

    set job(newValue)
    {
        this.setContextValue('job', newValue);
    }

    get job()
    {
        return this.getContextValue('job');
    }

    subscribeOnEvents()
    {
        if (! this.isLoaded()) {
            return;
        }

        const profile = this;

        // NEW CARD
        const newCardHtmlElement = document.getElementById('new-card-button');

        newCardHtmlElement.addEventListener(
            'click',
            () => this._popupService.load('new-card-popup').then((popup) => {
                popup.open();

                const newCardForm = document.getElementById('new-card-form');

                // TODO: form invalid event

                /*
                newCardForm.addEventListener('input', function() {
                    profile.checkForm(newCardForm, 'place-save-button');
                });
                */

                const inputs = newCardForm.querySelectorAll('input');

                Array.from(inputs).forEach((inputElement) =>
                    inputElement.addEventListener('input', () =>
                        profile.checkInput(newCardForm, inputElement, 'place-save-button')));

                profile.checkForm(newCardForm, 'place-save-button', true);

                popup.onCancel = function() {
                  profile.clearErrors(newCardForm);
                };
            })
        );


        // EDIT
        const editProfileHtmlElement = document.getElementById('edit-profile-button');

        editProfileHtmlElement.addEventListener(
            'click',
            () => this._popupService.load('edit-profile-popup').then((popup) => {
                popup.open();

                const startName = profile.name;
                const startJob = profile.job;

                const profileForm = document.getElementById('edit-profile-form');

                const profileNameInput = document.getElementById('profile-name');
                profileNameInput.value = profile.name;

                const profileAboutInput = document.getElementById('profile-about');
                profileAboutInput.value = profile.job;


                // Two way binding just for fun
                // TODO: add to BaseWidget
                const bindings = popup.getHtmlElement().querySelectorAll('[data-bind]');

                Array.from(bindings).forEach(function (htmlElement) {
                    const bindTo = htmlElement.getAttribute('data-bind');

                    htmlElement.addEventListener('input', function () {
                        profile.setContextValue(bindTo, htmlElement.value);
                        profile.checkInput(profileForm, htmlElement, 'profile-save-button');
                    });
                });

                /*
                profileForm.addEventListener('input', function () {
                    profile.checkForm(profileForm, 'profile-save-button');
                });
                */

                profile.checkForm(profileForm, 'profile-save-button', true);

                popup.onCancel = function() {
                    profile.name = startName;
                    profile.job = startJob;
                    profile.clearErrors(profileForm);
                };
            })
        );
    }

    checkForm(form, okButtonId, skipElementValidation)
    {
        if (skipElementValidation !== true) {
            const inputs = form.querySelectorAll('input');
            Array.from(inputs).forEach((inputElement) => ValidatorService.check(inputElement));
        }

        const okButton = document.getElementById(okButtonId);

        if (! okButton) {
            return;
        }

        if (form.checkValidity()) {
            okButton.classList.add('popup_active-button');
        } else {
            okButton.classList.remove('popup_active-button');
        }
    }

    checkInput(form, inputElement, okButtonId)
    {
        ValidatorService.check(inputElement);

        this.checkForm(form, okButtonId, true);
    }

    clearErrors(form)
    {
        const inputs = form.querySelectorAll('input');
        Array.from(inputs).forEach((inputElement) => ValidatorService.hide(inputElement));
    }
}
