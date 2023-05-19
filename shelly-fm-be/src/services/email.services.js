import nodemailer from "nodemailer";
import { EMAIL_CREDENTIALS } from "../secrets.js";


export const sendEmailNotification = async (obj) => {

    const transporter = nodemailer.createTransport({
        service : EMAIL_CREDENTIALS.EMAIL_SERVICE,
        auth : {
            user : EMAIL_CREDENTIALS.EMAIL_USERNAME,
            pass : EMAIL_CREDENTIALS.EMAIL_PASSWORD
        }
    });

    let htmlCode = `<p>The device ${obj.deviceName} had a change of status`

    const message = {
        from: EMAIL_CREDENTIALS.EMAIL_FROM,
        to: obj.mailRecipient,
        subject: 'Shelly Control Center - Device Status Change',
        html: htmlCode
      };

    if(typeof(obj.orderStatus)==="string"){
      const response = await transporter.sendMail(message)
      return response
    }
};
