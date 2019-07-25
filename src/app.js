import "./pages/index.css";
import "./images/logo.svg";
import "./images/close.svg";

import Card from './Card.js';
import PopupService from './PopupService.js';
import CardCollection from "./CardCollection.js";
import Profile from './Profile.js';

const popupService   = new PopupService();
const cardCollection = new CardCollection('places');
const profile        = new Profile('profile', 'Jaques Causteau', 'Sailor, Researcher', popupService);

//console.log(process.env.SLACK_GROUP_ID);

const initialCards = [
    {
        name: 'Архыз',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
    },
    {
        name: 'Челябинская область',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
    },
    {
        name: 'Иваново',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
    },
    {
        name: 'Камчатка',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
    },
    {
        name: 'Холмогорский район',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
    },
    {
        name: 'Байкал',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    },
    {
        name: 'Нургуш',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/khrebet-nurgush.jpg'
    },
    {
        name: 'Тулиновка',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/tulinovka.jpg'
    },
    {
        name: 'Остров Желтухина',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/zheltukhin-island.jpg'
    },
    {
        name: 'Владивосток',
        link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/vladivostok.jpg'
    }
];

initialCards.forEach(function(value) {
    const newCard = new Card(value.name, value.link, popupService);
    cardCollection.add(newCard);
});

cardCollection.render();

// Popup handlers

function newPopupProcess(form)
{
    if (form.new._isValid === false) {
        return false;
    }

    const link = form.new.link || null;
    const name = form.new.name || null;

    if (link && name) {
        cardCollection.add(new Card(name, link, popupService));
        cardCollection.render();
    }

    return true;
}


function editProfileSave(form)
{
    if (form.profile._isValid === false) {
        return false;
    }

    const about = form.profile.about || null;
    const name = form.profile.name || null;

    if (about && name) {
        profile.name = name;
        profile.job = about;
    }

    return true;
}

// TODO: export to global in order to get access from popup template, must be fixed
window.newPopupProcess = newPopupProcess;

window.editProfileSave = editProfileSave;
