const envConfig = {
    /*
    *  Local backend config
    * 
    * If you want to use a local backend (running the /backend/index.py flask server)
    * just add a .env.local file with the following content:
    *   LOCAL_API=True
    */
    local: process.env.LOCAL_API === 'true',
    backendUrl: '',
}

export const environment = new Proxy(envConfig, {
    get: (target, key) => {
        if (key === 'production') {
            return target[key]
        }

        return envConfig.local ? 'http://localhost:5000/' : 'https://api-hexastats.vercel.app/'
    }
})