const local_conf = {
    /*
    *  Local backend config
    *  IMPORTANT: Don't commit [production: false] to git !!!
    * 
    *  Use this to decide if you want to use the local backend or the production one
    *   - true: use the production backend
    *   - false: use the local backend
    */
    production: true,
    backendUrl: '',
}

export const environment = new Proxy(local_conf, {
    get: (target, key) => {
        if (key === 'production') {
            return target[key]
        }

        return local_conf.production ? 'https:/backend-hexastats.vercel.app' : 'http://localhost:5000'
    }
})