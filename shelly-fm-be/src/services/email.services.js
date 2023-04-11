import nodemailer from "nodemailer";
import { EMAIL_CREDENTIALS } from "../secrets.js";


export const sendStatusNotification = async (obj) => {

    const transporter = nodemailer.createTransport({
        service : EMAIL_CREDENTIALS.EMAIL_SERVICE,
        auth : {
            user : EMAIL_CREDENTIALS.EMAIL_USERNAME,
            pass : EMAIL_CREDENTIALS.EMAIL_PASSWORD
        }
    });

    let htmlCode
    (obj.trackingNumber)
    ? htmlCode = `<p>The status from your order of a <strong>${obj.productName}</strong> 
                  is currently <strong>${obj.orderStatus}</strong></p>
                  <p>Your tracking number is: <strong>${obj.trackingNumber}</strong></p>
                  <br/>
                  <h3>For more information about your order:</h3>
                  <p>Email <a href="mailto:support@shelly.cloud">support@shelly.cloud</a></p>
                  <p>Call 1-833-743-5591 Monday to Friday from 9am to 5pm</p>
                  `
    : htmlCode = `<p>The status from your order of a <strong>${obj.productName}</strong> 
                  is currently <strong>${obj.orderStatus}</strong></p>
                  <br/>
                  <h3>For more information about your order:</h3>
                  <p>Email <a href="mailto:support@shelly.cloud">support@shelly.cloud</a></p>
                  <p>Call 1-833-743-5591 Monday to Friday from 9am to 5pm</p>`

    const message = {
        from: EMAIL_CREDENTIALS.EMAIL_FROM,
        to: obj.customerEmail,
        subject: 'Shelly Sample Request System - Order Status',
        html: htmlCode
      };

    if(typeof(obj.orderStatus)==="string"){
      const response = await transporter.sendMail(message)
      return response
    }
};
