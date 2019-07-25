import HttpClient from "./HttpClient/HttpClient";
import HttpRequest from "./HttpClient/HttpRequest";
import Post from "./Post";

export default class Api
{
    constructor(options)
    {
        const token = options.token || null;

        if (token === null) {
            throw new Error('Not defined API token option');
        }

        this._httpClient = new HttpClient({
            baseUrl: options.baseUrl || '',
            mode: HttpRequest.MODE_CORS,
            responseFormat: 'json',
            headers: {
                authorization: token
            }
        });
    }

    getUserProfile()
    {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.fetch('/users/me').then((userData) => {
                    resolve(userData);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    updateUserProfile(profile)
    {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.patch('/users/me', {
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: profile.name,
                        about: profile.about
                    })
                }).then((userData) => {
                    resolve(userData);
                })
            } catch (e) {
                reject(e);
            }
        });
    }

    getInitialCards()
    {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.fetch('/cards').then((cardsData) => {
                    resolve(cardsData);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    addCard(card)
    {
        const self = this;

        return new Promise(function(resolve, reject) {
            try {
                self._httpClient.post('/cards', {
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(card)
                }).then((addedCard) => {
                    resolve(addedCard);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteCard(id)
    {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.delete('/cards/' + id).then(() => resolve());
            } catch (e) {
                reject(e);
            }
        });
    }

    likeCard(id)
    {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.put('/cards/like/' + id).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    dislikeCard(id)
    {
        const self = this;

        return new Promise((resolve, reject) => {
            try {
                self._httpClient.delete('/cards/like/' + id).then((card) => resolve(card));
            } catch (e) {
                reject(e);
            }
        });
    }

    getPosts()
    {
        const self = this;
       return new Promise(
           function (resolve, reject) {
               try {
                   self._httpClient.fetch('/posts').then((data) => {
                       resolve(data.map(function (postData) {
                           return Post.factory(postData);
                       }));
                   });
               } catch (e) {
                   reject(e);
               }
           }
       );
    }

    // другие методы работы с API
}
