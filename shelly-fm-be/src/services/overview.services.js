import { getDeviceCurrentDataCollection, getDeviceHistoricDataCollection } from "../gateway/connectDB.js";
import { presentDate, yesterday } from "../supportFunctions.js";


export async function currentTotalEnergyData() {
    const today = new Date();
    const currentDate = presentDate(today);
    const col = await getDeviceCurrentDataCollection();
    const devices = await col
        .aggregate([
          {
            '$match': {
              'month': currentDate.month,
              'year': currentDate.year
            }
          },
        {
            $group: {
            _id: 'null', 
            'totalEnergy': {
                $sum: '$aenergy0'
              }
            }
        }
        ])
        .toArray();

    return devices
}

export async function totalEnergyMonth () {

  // Connect to DB
  const col = await getDeviceHistoricDataCollection();
  const today = new Date();
  const currentDate = presentDate(today);
  const previousDate = yesterday(today)
  let m, y
  if(currentDate.day === '01'){
    m = previousDate.month
    y = previousDate.year
  } else {
    m = currentDate.month
    y = currentDate.year
  }

  // brings back the value for the energy from the previous day
  const devicePreviousValue = await col
    .aggregate(
      [
        {
          '$match': {
            'month': m,
            'year': y
          }
        },
        {
        $group: {
          _id: 'null', 
          'totalEnergy': {
              $sum: '$totalEnergy'
            }
          }
        }
      ]
    )
    .toArray();
    
  return devicePreviousValue

}
