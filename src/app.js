import "@babel/polyfill";
import "./pages/index.css";
import "./images/logo.svg";
import "./images/close.svg";

import Card from './Card.js';
import PopupService from './PopupService.js';
import CardCollection from "./CardCollection.js";
import Profile from './Profile.js';
import Api from "./Api";


const api = new Api({
    baseUrl: process.env.API_BASE_URL,
    token: process.env.API_TOKEN
});

const popupService   = new PopupService();
const cardCollection = new CardCollection('places');


const profile = new Profile('TEST', 'TEST', '');
profile.setPopupService(popupService);
profile.create('profile');

profile.update = function(newProfile) {
    return api.updateUserProfile(newProfile);
};

profile.onAddNewCard = function(name, link) {
    //console.log(name);
    const newCard = new Card(name, link, [], true);
    newCard.setPopupService(popupService);

    return new Promise((resolve, reject) => {
       api.addCard({
           name: name,
           link: link
       }) .then((addedCard) => {
           resolve();

           newCard.id = addedCard._id || null;
           newCard.profileId = profile.id;
           newCard.owner = addedCard.owner || null;

           newCard.onDelete = function() {
               if (window.confirm('Are you sure?') === true) {
                   api.deleteCard(newCard.id);
               } else {
                   return false;
               }
           };

           newCard.onLike = function() {
               console.log('like');
               api.likeCard(newCard.id).then((card) => newCard.likes = card.likes);
           };

           newCard.onDislike = function() {
               console.log('dislike');
               api.dislikeCard(newCard.id).then((card) => newCard.likes = card.likes);
           };

           cardCollection.add(newCard);
           cardCollection.render();
       }).catch(() => reject());
    });

    // cardCollection.add(newCard);
    //cardCollection.render();
};

api.getUserProfile().then((userData) => {
    profile.id = userData._id;
    profile.cohort = userData.cohort;
    profile.avatar = userData.avatar;
    profile.name = userData.name;
    profile.about = userData.about;

    loadCards();
});


function loadCards()
{
    api.getInitialCards().then((cards) => {
        cards.forEach(function (card) {
            const newCard = new Card(card.name, card.link, card.likes, card.owner._id === profile.id);

            //console.log(card);

            newCard.id = card._id || null;
            newCard.owner = card.owner || null;
            newCard.profileId = profile.id;
            newCard.setPopupService(popupService);

            newCard.onDelete = function() {
                if (window.confirm('Are you sure?') === true) {
                    api.deleteCard(newCard.id);
                } else {
                    return false;
                }
            };

            newCard.onLike = function() {
                console.log('like');
                api.likeCard(newCard.id).then((card) => newCard.likes = card.likes);
            };

            newCard.onDislike = function() {
                console.log('dislike');
                api.dislikeCard(newCard.id).then((card) => newCard.likes = card.likes);
            };

            cardCollection.add(newCard);
        });

        cardCollection.render();
    });

}
