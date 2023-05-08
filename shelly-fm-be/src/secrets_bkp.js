export const MONGO_PRD = "mongodb://mongo_local:27017"; // docker container where mongo is running
export const MONGO_DEV = "mongodb://127.0.0.1:27017";
export const BROKER_IP = '192.168.15.226:2022'

const gmail = {
  EMAIL_SERVICE: 'gmail',
  EMAIL_USERNAME: 'pro.rodrigoh@gmail.com',
  EMAIL_PASSWORD: 'wonjsnqsrodnuyfw', // config authorization for app
  EMAIL_FROM: 'pro.rodrigoh@gmail.com',
}


// const gmail = {
//   EMAIL_SERVICE: 'gmail',
//   EMAIL_USERNAME: 'shellysamplerequestsystem@gmail.com',
//   EMAIL_PASSWORD: 'mzxdcvhkxxrwowwc', // config authorization for app
//   EMAIL_FROM: 'shellysamplerequestsystem@gmail.com',
// }

export const EMAIL_CREDENTIALS = gmail