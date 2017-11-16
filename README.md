# react-redux-saga
>>> A web app to upload files (specifically images) with image compression and upload progress. 

(This is an ongoing work.) I use [Redux](https://redux.js.org/) global state desing philosophy in conjunciton with fast DOM redering provided by [React](https://reactjs.org/). The combination of the two is great as long as there is no async activity. However, as soon as there is an async call, it gets messy. Fortunatly, packages such as Saga have abstracted a lot of the work and provided a platform for a simplere and more readable code. 

I use [Redux-Saga](https://github.com/redux-saga/redux-saga) to handle the async call backs. These call backs could be from the XMLHttpRequest or the compression algorithm.


# How to start 
 - Install npm on your machine. 
 - Go to the roor directory
    - Run `npm install` to install all the packages
    - Run `npm run start` to start the development server
