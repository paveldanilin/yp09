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
