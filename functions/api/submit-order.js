import nodemailer from 'nodemailer';

/**
 * Cloudflare Worker: Handle order submission
 * POST /api/submit-order
 */

export default {
  async fetch(request, env) {
    // Enable CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
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
        price,
      } = body;

      // Validate required fields
      if (!name || !phone || !email || !address || !city || !state || !pincode || !quantity) {
        return new Response(
          JSON.stringify({ success: false, message: 'All fields are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Get email credentials from environment variables
      const EMAIL_USER = env.EMAIL_USER;
      const EMAIL_PASSWORD = env.EMAIL_PASSWORD;

      if (!EMAIL_USER || !EMAIL_PASSWORD) {
        console.error('Email credentials not configured');
        return new Response(
          JSON.stringify({ success: false, message: 'Email service not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Calculate total price
      const totalPrice = parseInt(price) * parseInt(quantity);

      // Email content for admin
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
                <div class="section-title">📦 Order Details</div>
                <div class="details">
                    <p><strong>Product:</strong> ${product}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Price per Unit:</strong> ₹${price}</p>
                    <p style="border-top: 2px solid #ddd; padding-top: 8px; margin-top: 8px;"><strong style="font-size: 16px;">Total Amount:</strong> <span style="font-size: 16px; color: #2e7d32;">₹${totalPrice}</span></p>
                </div>
            </div>

            <div class="section">
                <div class="section-title">💳 Payment Status</div>
                <div class="details">
                    <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
                    <p><strong>Amount to Collect:</strong> ₹${totalPrice}</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>Order Time: ${new Date().toLocaleString('en-IN')}</p>
            <p>🌿 RN Herbal India - Order Management System 🌿</p>
        </div>
    </div>
</body>
</html>
`;

      // Email content for customer
      const customerEmailContent = `
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
        .success-box { background: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #4caf50; margin-bottom: 20px; }
        .contact-info { background: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .contact-info p { margin: 8px 0; }
        .contact-info a { color: #2e7d32; }
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

      // Send emails using Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        },
      });

      // Send email to admin
      await transporter.sendMail({
        from: EMAIL_USER,
        to: EMAIL_USER,
        subject: `🎉 New Order from ${name}`,
        html: adminEmailContent,
      });

      // Send confirmation email to customer
      await transporter.sendMail({
        from: EMAIL_USER,
        to: email,
        subject: '✅ Your Order Confirmation - RN Herbal India',
        html: customerEmailContent,
      });

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Order submitted successfully! Check your email for confirmation.',
          orderId: `ORD-${Date.now()}`,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (error) {
      console.error('Order submission error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          message: error.message || 'Error processing order',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
