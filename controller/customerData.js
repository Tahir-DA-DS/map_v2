const db = require("../db/connect");

// The main function to create new customer data
const createData = async (req, res) => {
  try {
    const {
      applicationNo,
      customerName,
      customerAddress,
      customerTelephone,
      customerEmail,
      city,
      district,
      zone,
      mapVendorId,
    } = req.body;

    const existingCustomer = await db.query(
      "SELECT * FROM customerData WHERE applicationNo = ?",
      [applicationNo]
    );
   const rows = existingCustomer[0];
    if (rows && rows.length>0) {
      return res
        .status(409)
        .json({ message: "Customer Application Data already exists" });
    }

    const mapNumber = generateMapNumber(mapVendorId);
    const insertResult = await db.query(
      "INSERT INTO customerData (applicationNo, customerName, customerAddress, customerTelephone, customerEmail, city, district, zone, mapVendorId, mapNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        applicationNo,
        customerName,
        customerAddress,
        customerTelephone,
        customerEmail,
        city,
        district,
        zone,
        mapVendorId,
        mapNumber,
      ]
    );

    res.status(201).json({
      message: "New customer data created successfully",
      data: {
        applicationNo: applicationNo,
        mapVendorId: mapVendorId,
        mapNumber: mapNumber,
      },
    });
  } catch (error) {
    console.error("Database operation failed:", error);
    res
      .status(500)
      .json({ message: "Error saving customer details", error: error.message });
  }
};

function generateMapNumber(mapVendorId) {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const timestamp = `${day}${month}${year}`;
  const randomPart = `S${Math.floor(Math.random() * 900) + 100}`;
  return `${mapVendorId}-${timestamp}-${randomPart}`;
}
module.exports = { createData };
