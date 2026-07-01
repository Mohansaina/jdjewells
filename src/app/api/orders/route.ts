import { NextResponse } from 'next/server';
import { getDbClient } from '@/lib/db';
import { sanitizeString, validateEmail, validatePhone } from '@/lib/validation';
import { VdbService } from '@/services/vdb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDbClient();
  try {
    const orders = await db.order.findMany();
    return NextResponse.json(orders);
  } catch (e) {
    console.error("API Get orders failure:", e);
    return NextResponse.json({ error: "Failed to read order logs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const db = getDbClient();
  try {
    const body = await req.json();
    const { total, shippingName, shippingEmail, shippingPhone, shippingAddress, shippingCity, shippingZip, items } = body;

    // Validate parameter presence
    if (!shippingName || !shippingEmail || !shippingAddress || !shippingCity || !shippingZip) {
      return NextResponse.json({ error: "Invalid shipping parameters: Missing required parameters" }, { status: 400 });
    }

    // Validate email layout
    const sanitizedEmail = sanitizeString(shippingEmail);
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid shipping email address format" }, { status: 400 });
    }

    // Validate phone layout
    const sanitizedPhone = sanitizeString(shippingPhone || '');
    if (shippingPhone && !validatePhone(sanitizedPhone)) {
      return NextResponse.json({ error: "Invalid shipping phone number format" }, { status: 400 });
    }

    // Validate items layout
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order items list cannot be empty" }, { status: 400 });
    }

    // Server-side price verification (tamper protection)
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const itm of items) {
      let itemPrice = 0;
      let customConfigId: string | null = null;
      
      if (itm.customConfig) {
        // Calculate setting price on the server side
        let base = 800;
        const { category, shape, setting, metal, size, diamondVdbId } = itm.customConfig;

        switch (setting) {
          case 'Solitaire': base += 0; break;
          case 'Cathedral': base += 250; break;
          case 'Vintage': base += 450; break;
          case 'Pavé': base += 550; break;
          case 'Halo': base += 700; break;
          case 'Three Stone': base += 900; break;
          default: base += 0; break;
        }

        switch (metal) {
          case 'Yellow Gold': base += 450; break;
          case 'Rose Gold': base += 450; break;
          case 'White Gold': base += 500; break;
          case 'Platinum': base += 1100; break;
          default: base += 500; break;
        }

        if (category === 'Custom Jewelry') base += 300;

        itemPrice = base;

        // If a diamond is attached to this custom configuration
        if (diamondVdbId) {
          const vdbDiamond = await VdbService.getById(diamondVdbId);
          if (vdbDiamond) {
            itemPrice += vdbDiamond.price;
          } else {
            return NextResponse.json({ error: `Custom diamond not found in active registries: ${diamondVdbId}` }, { status: 400 });
          }
        }

        // Create configuration record
        const configRecord = await db.configuration.create({
          data: {
            category: category || 'Engagement Rings',
            shape: shape || 'Round',
            setting: setting || 'Solitaire',
            metal: metal || 'White Gold',
            size: size || '6.5',
            diamondVdbId: diamondVdbId || null,
            price: itemPrice
          }
        });
        customConfigId = configRecord.id;

      } else if (itm.productId) {
        const product = await db.product.findUnique({ where: { id: itm.productId } });
        if (!product) {
          return NextResponse.json({ error: `Product not found: ${itm.productId}` }, { status: 400 });
        }
        itemPrice = product.price;
      } else if (itm.diamondId) {
        // Retrieve diamond pricing securely from local database or virtual diamond vault
        const diamond = await db.diamond.findUnique({ where: { id: itm.diamondId } });
        if (diamond) {
          itemPrice = diamond.price;
        } else {
          // Check registry vault (mock or live API)
          const vdbDiamond = await VdbService.getById(itm.diamondId);
          if (vdbDiamond) {
            itemPrice = vdbDiamond.price;
          } else {
            return NextResponse.json({ error: `Diamond not found in active registries: ${itm.diamondId}` }, { status: 400 });
          }
        }
      } else {
        return NextResponse.json({ error: "Each order item must specify a productId, diamondId, or customConfig" }, { status: 400 });
      }

      const quantity = parseInt(itm.quantity?.toString() || '1') || 1;
      if (quantity <= 0) {
        return NextResponse.json({ error: "Quantity must be a positive integer" }, { status: 400 });
      }

      calculatedTotal += itemPrice * quantity;
      validatedItems.push({
        productId: itm.productId || null,
        diamondId: itm.diamondId || null,
        customConfigId,
        quantity,
        price: itemPrice
      });
    }

    // Sanitize shipping fields
    const sanitizedName = sanitizeString(shippingName);
    const sanitizedAddress = sanitizeString(shippingAddress);
    const sanitizedCity = sanitizeString(shippingCity);
    const sanitizedZip = sanitizeString(shippingZip);

    const orderNumber = `JD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await db.order.create({
      data: {
        orderNumber,
        total: calculatedTotal,
        shippingName: sanitizedName,
        shippingEmail: sanitizedEmail,
        shippingPhone: sanitizedPhone,
        shippingAddress: sanitizedAddress,
        shippingCity: sanitizedCity,
        shippingZip: sanitizedZip,
        items: {
          create: validatedItems
        }
      }
    });

    return NextResponse.json(order);
  } catch (e) {
    console.error("API Create order failure:", e);
    return NextResponse.json({ error: "Failed to compile order registry" }, { status: 500 });
  }
}
