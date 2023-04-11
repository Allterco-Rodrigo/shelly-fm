export const MONGO_PRD = "mongodb://mongodb:27017"; // docker container where mongo is running
export const MONGO_DEV = "mongodb://localhost:27017";
export const BROKER_IP = '192.168.15.226:2022'

const gmail = {
  EMAIL_SERVICE: 'gmail',
  EMAIL_USERNAME: 'your_email_account@gmail.com',
  EMAIL_PASSWORD: 'lettersoupfromgoogleapikeygenerator', // config authorization for app. You need to generate this on google account manager
  EMAIL_FROM: 'your_email_account@gmail.com',
}


export const EMAIL_CREDENTIALS = gmail
