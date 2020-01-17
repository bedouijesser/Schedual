if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then((reg)=> console.log("Service worker registred", reg))
    .catch((err)=> console.log("Service worker not registred",err));
};