type FireBaseConfigObjectType = {
    apiKey : string
    authDomain: string
    projectId: string
    storageBucket: string
    messagingSenderId: string
    appId: string
    measurementId: string
}


export const firebaseConfigObject:FireBaseConfigObjectType = {
    apiKey : import.meta.env.VITE_API_KEY,
    authDomain:import.meta.env.VITE_AUTH_DOMAIN,
    projectId:import.meta.env.VITE_PROJECT_ID ,
    storageBucket:import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId:import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId:import.meta.env.VITE_APP_ID ,
    measurementId:import.meta.env.VITE_MESUREMENT_ID,
}
export const serverUrl:string = String(import.meta.env.VITE_SERVER_URL)
