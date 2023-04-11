import { getLocationCollection } from "../gateway/connectDB.js";

export const complexAdd = async (values) => {

  const complexName = "Sole Mia"
  const buildingName = "Sole Mia Rentals"
  const buildingAddress = "2321 Laguna Cir, North Miami, FL 33181"
  let numFloors = 10
  const startFloor = 2, numUnitsPerFloor = 15

  const hasPentHouse = true
  let buildingFloors = [], floorsUnits = []

  if(hasPentHouse){
    numFloors = numFloors - 1
    buildingFloors.push("PH")
  } 

  for(let a=startFloor; a < numFloors + 1; a++){
      buildingFloors.push(String(a).padStart(2, '0'))
  }

  buildingFloors.forEach(floor => {
      for(let a=1; a < numUnitsPerFloor + 1; a++){
        floorsUnits.push(`${floor}`+String(a).padStart(2, '0'))
      }
      
  });

  const dataJson = 
    {
      "complex": complexName,
      "buildings": [
        {
          "name": buildingName,
          "address": buildingAddress
        },
      ],
      "floors": buildingFloors,
      "units": floorsUnits,
    }

  console.log(dataJson)
    try {
      const col = await getLocationCollection();
      const doc = await col.findOneAndUpdate(   //add new or update previous
        {Complex: obj.ip},
        { $set : dataJson}
      )
    } catch(e){
        console.error(e)
    }

}

export const getComplex = async (values) => {}
export const getComplexById = async (values) => {}

export const complexUpd = async (values) => {}
export const complexDel = async (values) => {}
