const db = require("../db/connect");
const { body, validationResult } = require("express-validator")

const createPaymentConfirmation = async (req, res) => {
    const { applicationNo, mapVendorId, amountPaid, datePaid } = req.body;

    try {
        // Check if the customer exists
        const [customerRows] = await db.query('SELECT * FROM customerdata WHERE applicationNo = ?', [applicationNo]);
        if (customerRows.length === 0) {
            return res.status(404).json({
                message: 'Customer with provided application number does not exist.',
            });
        }

        const mapNumber = customerRows[0].mapNumber;

        // Check if payment already exists
        const [paymentRows] = await db.query('SELECT * FROM paymentdata WHERE applicationNo = ?', [applicationNo]);
        if (paymentRows.length > 0) {
            return res.status(400).json({
                message: 'Payment already exists.',
            });
        }

        // Convert the datePaid from a date string to Unix timestamp in milliseconds
        const datePaidTimestamp = new Date(datePaid).getTime();

        // Insert new payment record
        await db.query(
            'INSERT INTO paymentdata (applicationNo, mapVendorId, amountPaid, datePaid) VALUES (?, ?, ?, ?)', 
            [applicationNo, mapVendorId, amountPaid, datePaidTimestamp]
        );

        res.status(201).json({
            applicationNo,
            mapNumber,
            mapVendorID: mapVendorId,
        });

    } catch (error) {
        console.error('Failed to create payment confirmation:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                message: 'Payment record with this application number already exists.',
            });
        }
        res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};


  module.exports = {createPaymentConfirmation}
  