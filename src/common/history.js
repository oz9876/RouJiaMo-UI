import { createHashHistory } from 'history';
// import { createBrowserHistory } from 'history';

const history = createHashHistory({
    getUserConfirmation(message, callback){
        window.$confirm(message, () => {
            callback(true);
        }, () => {
            callback(false);
        });
    }
});

const warp = function(path) {
    console.log(path, 1);
    if (typeof path === 'object' && path.params) {
        console.log(path, 2);
        const params = path.params;
        const res = [];
        for (const k in params) {
            res.push(k + '=' + encodeURIComponent(params[k]));
        }
        path.search =  '?' + res.join('&');
        delete path.params;
    }
};

history.push = history.push(warp);
history.replace = history.replace(warp);

export default history;
