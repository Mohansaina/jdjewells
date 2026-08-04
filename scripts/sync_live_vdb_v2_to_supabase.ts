import dotenv from 'dotenv';
import path from 'path';
import https from 'https';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error']
});

const token = 'iltz_Ie1tN0qm-ANqF7X6SRjwyhmMtzZsmqvyWOZ83I';
const apiKey = '_eTAh9su9_0cnehpDpqM9xA';

function fetchVdbV2(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'Authorization': `Token token=${token}, api_key=${apiKey}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e: any) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🚀 Fetching LIVE Inventory from VDB V2 API Gateway...');

  try {
    // Connect Prisma explicitly
    await prisma.$connect();
    console.log('✅ Connected to Primary Database.');

    // 1. Fetch Natural Diamonds
    console.log('💎 Fetching Live Natural Diamonds...');
    const natRes = await fetchVdbV2('https://apiservices.vdbapp.com/v2/diamonds?type=Diamond&page_size=50&page_number=1');
    const natDiamonds = natRes.response?.body?.diamonds || natRes.response?.body || [];
    console.log(`Found ${natDiamonds.length} Natural Diamonds from VDB.`);

    // 2. Fetch Lab-Grown Diamonds
    console.log('🧪 Fetching Live Lab-Grown Diamonds...');
    const labRes = await fetchVdbV2('https://apiservices.vdbapp.com/v2/diamonds?type=Lab_grown_Diamond&page_size=50&page_number=1');
    const labDiamonds = labRes.response?.body?.diamonds || labRes.response?.body || [];
    console.log(`Found ${labDiamonds.length} Lab-Grown Diamonds from VDB.`);

    const allDiamonds = [...natDiamonds, ...labDiamonds];
    console.log(`\n🔄 Writing ${allDiamonds.length} Live VDB items to Database...`);

    let count = 0;
    for (const d of allDiamonds) {
      if (!d.id && !d.stock_num) continue;

      const rawCert = d.cert_num ? String(d.cert_num).replace('.0', '').trim() : '';
      const certNo = rawCert || `VDB-${d.id || d.stock_num}`;
      const price = parseFloat(d.total_sales_price || d.price_per_carat || '1200') || 1200;
      const imageUrl = d.image_url || d.s3_image?.url || d.image_thumb_url || null;
      const videoUrl = d.video_url || d.s3_video?.url || null;
      const certUrl = d.cert_url || (rawCert ? `https://www.gia.edu/report-check?reportno=${rawCert}` : null);

      try {
        await prisma.diamond.upsert({
          where: { certificateNo: certNo },
          update: {
            vdbId: String(d.id || d.stock_num),
            shape: d.shape || 'Round',
            carat: parseFloat(d.size || d.carat || '1.0') || 1.0,
            color: d.color || 'G',
            clarity: d.clarity || 'VS1',
            cut: d.cut || 'Excellent',
            polish: d.polish || 'Excellent',
            symmetry: d.symmetry || 'Excellent',
            fluorescence: d.fluor_intensity || d.fluorescence || 'None',
            certificate: d.lab || 'GIA',
            certificateUrl: certUrl,
            price: price,
            imageUrl: imageUrl,
            videoUrl: videoUrl,
          },
          create: {
            id: `vdb-v2-${d.id || d.stock_num}`,
            vdbId: String(d.id || d.stock_num),
            shape: d.shape || 'Round',
            carat: parseFloat(d.size || d.carat || '1.0') || 1.0,
            color: d.color || 'G',
            clarity: d.clarity || 'VS1',
            cut: d.cut || 'Excellent',
            polish: d.polish || 'Excellent',
            symmetry: d.symmetry || 'Excellent',
            fluorescence: d.fluor_intensity || d.fluorescence || 'None',
            certificate: d.lab || 'GIA',
            certificateNo: certNo,
            certificateUrl: certUrl,
            price: price,
            imageUrl: imageUrl,
            videoUrl: videoUrl,
          },
        });
        count++;
      } catch (err: any) {
        console.warn(`Skip duplicate/failed item ${certNo}: ${err.message}`);
      }
    }

    console.log(`\n🎉 SUCCESS! Successfully written ${count} LIVE VDB items into Diamond table!`);

  } catch (err: any) {
    console.error('❌ Error during VDB V2 sync:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
