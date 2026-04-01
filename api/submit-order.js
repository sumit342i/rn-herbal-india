const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const {
            name,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            quantity,
            product,
            price
        } = req.body;

        // Validate required fields
        if (!name || !phone || !email || !address || !city || !state || !pincode || !quantity) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        const totalPrice = parseInt(price) * parseInt(quantity);

        // Admin email
        const adminEmailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; }
        .header { background: #2e7d32; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { background: #f5f5f0; padding: 10px; font-weight: bold; color: #2e7d32; border-left: 4px solid #4caf50; }
        .details { background: #f9f9f9; padding: 10px; margin-top: 10px; border-radius: 5px; }
        .details p { margin: 8px 0; }
        .footer { background: #f5f5f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🎉 New Order Received!</h2>
        </div>
        <div class="content">
            <div class="section">
                <div class="section-title">📋 Customer Information</div>
                <div class="details">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">📍 Delivery Address</div>
                <div class="details">
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>City:</strong> ${city}</p>
                    <p><strong>State:</strong> ${state}</p>
                    <p><strong>Pincode:</strong> ${pincode}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">🛍️ Order Details</div>
                <div class="details">
                    <p><strong>Product:</strong> ${product}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Price per unit:</strong> ₹${price}</p>
                    <p style="border-top: 2px solid #ddd; padding-top: 8px; margin-top: 8px;"><strong>Total Price:</strong> ₹${totalPrice}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">💳 Payment Method</div>
                <div class="details">
                    <p>Cash on Delivery (COD) - Amount Expected: ₹${totalPrice}</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>Order received on ${new Date().toLocaleString('en-IN')}</p>
            <p>RN Herbal India - Your Trusted Ayurvedic Wellness Partner</p>
        </div>
    </div>
</body>
</html>
        `;

        // Customer email
        const customerEmailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; }
        .header { background: #4caf50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { background: #f5f5f0; padding: 10px; font-weight: bold; color: #2e7d32; border-left: 4px solid #4caf50; }
        .details { background: #f9f9f9; padding: 10px; margin-top: 10px; border-radius: 5px; }
        .details p { margin: 8px 0; }
        .success-box { background: #c8e6c9; border: 2px solid #4caf50; color: #2e7d32; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .footer { background: #f5f5f0; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        .contact-info { text-align: center; margin-top: 20px; }
        .contact-info a { color: #4caf50; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>✅ Order Confirmation</h2>
            <p>Thank you for ordering from RN Herbal India!</p>
        </div>
        <div class="content">
            <div class="success-box">
                <p style="margin: 0;"><strong>Your order has been successfully placed!</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Our team will contact you shortly to confirm and process your delivery.</p>
            </div>

            <div class="section">
                <div class="section-title">✓ Order Summary</div>
                <div class="details">
                    <p><strong>Product:</strong> ${product}</p>
                    <p><strong>Quantity Ordered:</strong> ${quantity}</p>
                    <p><strong>Price per Unit:</strong> ₹${price}</p>
                    <p style="border-top: 2px solid #ddd; padding-top: 8px; margin-top: 8px;"><strong style="font-size: 16px;">Total Amount:</strong> <span style="font-size: 16px; color: #2e7d32;">₹${totalPrice}</span></p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">📦 Delivery Details</div>
                <div class="details">
                    <p><strong>Delivery To:</strong> ${name}</p>
                    <p><strong>Address:</strong> ${address}, ${city}, ${state} - ${pincode}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">💳 Payment</div>
                <div class="details">
                    <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
                    <p style="color: #d7a44d; margin-top: 10px;"><strong>You will pay ₹${totalPrice} at the time of delivery</strong></p>
                </div>
            </div>

            <div class="contact-info">
                <p style="margin-bottom: 10px;">Have questions? Contact us:</p>
                <p><strong>📞 Call:</strong> <a href="tel:+918292905500">+91 8292905500</a></p>
                <p><strong>💬 WhatsApp:</strong> <a href="https://wa.me/918292905500">+91 8292905500</a></p>
            </div>
        </div>
        <div class="footer">
            <p>Order Confirmation Date: ${new Date().toLocaleString('en-IN')}</p>
            <p>🌿 RN Herbal India - 100% Ayurvedic Premium Wellness 🌿</p>
            <p>Website: <a href="https://rnherbalindia.com" style="color: #4caf50;">rnherbalindia.com</a></p>
        </div>
    </div>
</body>
</html>
        `;

        // Send admin email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'digital.work.3442@gmail.com',
            subject: `🎉 New Order from ${name} - RN Herbal India`,
            html: adminEmailContent
        });

        // Send customer email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '✅ Order Confirmation - RN Herbal India',
            html: customerEmailContent
        });

        res.status(200).json({
            success: true,
            message: 'Order submitted successfully! Confirmation email has been sent.'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing order. Please try again.'
        });
    }
};
