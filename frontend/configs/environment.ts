const development = process.env.LOCAL_API === 'true'

/**
 *  Backend config
 * 
 * If you want to use a local backend (running the `/backend` NestJS server)
 * just add in .env.local file the following content:
 *   
 * LOCAL_API=true
 */
export const environment = {
    backendUrl: development ? 'http://localhost:5000/' : 'https://api-hexastats.vercel.app/',
}
