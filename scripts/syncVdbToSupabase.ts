import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local and .env
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncVdbLiveToSupabase() {
  const apiKey = process.env.VDB_API_KEY || '20L6xMmSCeq5QXBtoK4KGg';
  const accessToken = process.env.VDB_ACCESS_TOKEN || 'A-U9GVKLXQ4iHb7kZqSCTjthk0xU2pcD4LL6uktbRpI';
  const username = process.env.VDB_API_USERNAME || 'jdgloballtd2020@gmail.com';

  console.log('🔄 Querying LIVE VDB API for supplier jewelry & diamonds...');
  console.log(`Using VDB API Key: ${apiKey.substring(0, 5)}... Username: ${username}`);

  try {
    // 1. Fetch live VDB Jewelry items from live VDB API v3 endpoint
    const queryParams = new URLSearchParams({
      api_key: apiKey,
      page: '1',
      records_per_page: '50',
    });
    if (accessToken) queryParams.append('access_token', accessToken);
    if (username) queryParams.append('username', username);

    const vdbUrl = `https://api.vdbapp.com/v3/jewelries?${queryParams.toString()}`;
    console.log(`[VDB Live API] Fetching live VDB supplier jewelry items...`);

    const res = await fetch(vdbUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`VDB Jewelry API returned HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    const vdbRawItems = json.response?.body || json.body || [];
    console.log(`Fetched ${vdbRawItems.length} LIVE jewelry items directly from VDB suppliers.`);

    for (const item of vdbRawItems) {
      const id = `vdb-jewel-${item.item_id}`;
      const title = item.jewelry_title || item.name || item.title || `${item.metal || '18k Gold'} ${item.jewelry_category || 'Jewelry'}`;
      const category = (item.jewelry_category || 'rings').toLowerCase();
      const material = item.metal || item.metal_type || '18k Gold';
      const price = Number(item.retail_price || item.price || 1500);
      const description = item.description || item.jewelry_desc || `VDB Supplier ${title} cast in solid ${material}.`;
      
      const images: string[] = [];
      if (item.image_url) images.push(item.image_url);
      if (Array.isArray(item.images)) {
        item.images.forEach((img: any) => {
          const url = typeof img === 'string' ? img : img.image_url || img.url;
          if (url && !images.includes(url)) images.push(url);
        });
      }
      if (images.length === 0) images.push('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80');

      const specs = JSON.stringify({
        metal: material,
        stone: item.stone_type || item.diamond_type || 'Natural Diamonds',
        style: item.jewelry_style || 'Classic',
        vendor: item.vendor_name || 'VDB Wholesale Supplier',
        sku: item.stock_number || item.sku || `VDB-${item.item_id}`
      });

      await prisma.product.upsert({
        where: { id },
        update: {
          title,
          description,
          category,
          material,
          price,
          image: images[0],
          thumbnails: images,
          specs,
        },
        create: {
          id,
          title,
          description,
          category,
          material,
          price,
          image: images[0],
          thumbnails: images,
          rating: 4.9,
          reviewsCount: 5,
          specs,
        },
      });
    }
    console.log(`✅ Successfully inserted ${vdbRawItems.length} LIVE VDB supplier jewelry items into Product table!`);

    // 2. Fetch live VDB Diamonds
    const diaParams = new URLSearchParams({
      api_key: apiKey,
      username: username,
      page: '1',
      records_per_page: '50',
    });
    const diaUrl = `https://api.vdbapp.com/v3/diamonds?${diaParams.toString()}`;
    console.log(`[VDB Live API] Fetching live VDB supplier loose diamonds...`);

    const diaRes = await fetch(diaUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (diaRes.ok) {
      const diaJson = await diaRes.json();
      const diaRawItems = diaJson.response?.body || [];
      console.log(`Fetched ${diaRawItems.length} LIVE diamonds directly from VDB suppliers.`);

      for (const item of diaRawItems) {
        const id = `vdb-dia-${item.item_id}`;
        const certNo = item.cert_num || `VDB-${item.item_id}`;

        await prisma.diamond.upsert({
          where: { certificateNo: certNo },
          update: {
            vdbId: String(item.item_id),
            shape: item.shape || 'Round',
            carat: parseFloat(item.carat) || 1.0,
            color: item.color || 'G',
            clarity: item.clarity || 'VS1',
            cut: item.cut || 'Excellent',
            polish: item.polish || 'Excellent',
            symmetry: item.symmetry || 'Excellent',
            fluorescence: item.fluor || 'None',
            certificate: item.lab || 'GIA',
            certificateUrl: item.cert_url || `https://www.gia.edu/report-check?reportno=${certNo}`,
            price: parseFloat(item.price) || 2000,
            imageUrl: item.image_url || item.still_image_url || null,
            videoUrl: item.video_url || item.hd_image_url || null,
          },
          create: {
            id,
            vdbId: String(item.item_id),
            shape: item.shape || 'Round',
            carat: parseFloat(item.carat) || 1.0,
            color: item.color || 'G',
            clarity: item.clarity || 'VS1',
            cut: item.cut || 'Excellent',
            polish: item.polish || 'Excellent',
            symmetry: item.symmetry || 'Excellent',
            fluorescence: item.fluor || 'None',
            certificate: item.lab || 'GIA',
            certificateNo: certNo,
            certificateUrl: item.cert_url || `https://www.gia.edu/report-check?reportno=${certNo}`,
            price: parseFloat(item.price) || 2000,
            imageUrl: item.image_url || item.still_image_url || null,
            videoUrl: item.video_url || item.hd_image_url || null,
          },
        });
      }
      console.log(`✅ Successfully inserted ${diaRawItems.length} LIVE VDB supplier diamonds into Diamond table!`);
    }

  } catch (error: any) {
    console.error('❌ Error fetching from VDB Live API:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

syncVdbLiveToSupabase();
