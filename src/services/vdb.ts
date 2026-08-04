// ============================================================
// Diamond API Service — Multi-Provider Architecture
// ============================================================
// Supports: Mock (default) | VDB | Nivoda | RapNet
// Set DIAMOND_PROVIDER in .env.local to switch providers.
// ============================================================


export interface VdbDiamond {
  id: string;
  vdbId: string;
  shape: 'Round' | 'Oval' | 'Cushion' | 'Princess' | 'Emerald' | 'Pear' | 'Marquise' | 'Radiant' | 'Heart' | string;
  carat: number;
  color: 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | string;
  clarity: 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | string;
  cut: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | string;
  price: number;
  certificate: 'GIA' | 'IGI' | 'HRD' | 'GCAL' | string;
  certificateNo: string;
  certificateUrl: string;
  imageUrl: string;
  videoUrl: string;
  polish: 'Excellent' | 'Very Good' | 'Good' | string;
  symmetry: 'Excellent' | 'Very Good' | 'Good' | string;
  fluorescence: 'None' | 'Faint' | 'Medium' | 'Strong' | string;
  depthPercent: number;
  tablePercent: number;
  measLength: number;
  measWidth: number;
  measDepth: number;
  lab: 'Natural' | 'Lab Grown' | string;
  crownAngle?: number;
  pavilionAngle?: number;
  girdleMin?: string;
  girdleMax?: string;
  culet?: string;
  stockNo?: string;
  supplier?: string;
  rapPrice?: number;    // Rapaport list price (rap price per carat)
  rapnetDiscount?: number; // % discount from rap
}

export interface VdbSearchParams {
  shapes?: string[];
  caratMin?: number;
  caratMax?: number;
  colors?: string[];
  clarities?: string[];
  cuts?: string[];
  priceMin?: number;
  priceMax?: number;
  lab?: string;
  sort?: string;
  page?: number;
  limit?: number;
  q?: string;
  certificates?: string[];
  polishes?: string[];
  symmetries?: string[];
  fluorescences?: string[];
}

// ============================================================
// MOCK INVENTORY — 500 realistic diamonds
// ============================================================
function generateMockInventory(): VdbDiamond[] {
  const shapes = ['Round', 'Oval', 'Cushion', 'Princess', 'Emerald', 'Pear', 'Marquise', 'Radiant', 'Heart', 'Asscher', 'Old Cuts', 'Kite & Shields', 'Triangulars'];
  const colors = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  const cuts = ['Excellent', 'Very Good', 'Good'];
  const polishes = ['Excellent', 'Very Good', 'Good'];
  const symmetries = ['Excellent', 'Very Good'];
  const fluorescences = ['None', 'Faint', 'None', 'Medium', 'None', 'Faint']; // weighted toward None
  const labs: string[] = ['Natural', 'Natural', 'Natural', 'Lab Grown', 'Coloured', 'Gemstones'];
  const suppliers = ['Lili Diamonds', 'Star Gems', 'Rosy Blue', 'KGK Group', 'Prime Jewels', 'Supreme Gems'];
  const certs: ('GIA' | 'IGI' | 'HRD' | 'GCAL')[] = ['GIA', 'GIA', 'GIA', 'IGI', 'IGI', 'HRD', 'GCAL'];

  // Realistic diamond image URLs using publicly available placeholder images per shape
  const shapeImageUrls: Record<string, string> = {
    Round:          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
    Oval:           'https://images.unsplash.com/photo-1573408301185-9519f94bf6be?w=400&q=80',
    Cushion:        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80',
    Princess:       'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
    Emerald:        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
    Pear:           'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&q=80',
    Marquise:       'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=400&q=80',
    Radiant:        'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80',
    Heart:          'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80',
    Asscher:        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
    'Old Cuts':     'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
    'Kite & Shields': 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80',
    Triangulars:    'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&q=80',
  };

  const inventory: VdbDiamond[] = [];
  let idCounter = 100000;
  const rng = (seed: number, max: number) => Math.abs(Math.sin(seed * 9301 + 49297) * 233280) % max;

  for (let i = 0; i < 500; i++) {
    const shape = shapes[i % shapes.length];
    const lab = labs[Math.floor(rng(i + 1, labs.length))];

    // Carat: bell-curve weighted toward 0.5-2.5ct range
    const caratBase = 0.3 + (rng(i + 2, 100) / 100) * 4.5;
    const carat = parseFloat(caratBase.toFixed(2));

    const colouredColors = ['Fancy Yellow', 'Fancy Pink', 'Fancy Blue', 'Fancy Green', 'Fancy Orange', 'Fancy Purple'];
    const gemColors = ['Royal Blue', 'Pigeon Blood Red', 'Vivid Green', 'Deep Violet', 'Cornflower Blue', 'Teal Green'];

    const color = lab === 'Coloured' 
      ? colouredColors[Math.floor(rng(i + 3, colouredColors.length))] 
      : lab === 'Gemstones'
      ? gemColors[Math.floor(rng(i + 3, gemColors.length))]
      : colors[Math.floor(rng(i + 3, colors.length))];

    const clarity = clarities[Math.floor(rng(i + 4, clarities.length))];
    const cut = cuts[Math.floor(rng(i + 5, cuts.length))];
    const polish = polishes[Math.floor(rng(i + 6, polishes.length))];
    const symmetry = symmetries[Math.floor(rng(i + 7, symmetries.length))];
    const fluorescence = fluorescences[Math.floor(rng(i + 8, fluorescences.length))];
    const certType = lab === 'Natural' ? certs[Math.floor(rng(i + 9, 3))] : certs[3 + Math.floor(rng(i + 10, 3))];
    const supplier = suppliers[Math.floor(rng(i + 11, suppliers.length))];

    // Realistic price calculation
    const shapeFactor: Record<string, number> = { Round: 1.25, Oval: 1.05, Cushion: 1.0, Princess: 0.95, Emerald: 1.0, Pear: 0.98, Marquise: 0.95, Radiant: 1.02, Heart: 0.92, Asscher: 1.1, 'Old Cuts': 1.15, 'Kite & Shields': 0.88, Triangulars: 0.90 };
    const shapeMultiplier = shapeFactor[shape] ?? 1.0;
    const labFactor = lab === 'Lab Grown' ? 0.3 : lab === 'Coloured' ? 1.5 : lab === 'Gemstones' ? 0.75 : 1.0;
    const colorFactor = 1.0 - (colors.indexOf(color) * 0.055);
    const clarityFactor = 1.0 - (clarities.indexOf(clarity) * 0.065);
    const cutFactor = 1.0 - (cuts.indexOf(cut) * 0.07);
    const basePrice = 3200;
    const calculatedPrice = basePrice * Math.pow(carat, 1.8) * shapeMultiplier * labFactor * colorFactor * clarityFactor * cutFactor;
    const price = Math.round(Math.max(calculatedPrice, 399) / 10) * 10;

    const certNo = `${100000000 + Math.floor(rng(i + 12, 899999999))}`;
    const certUrl = certType === 'GIA'
      ? `https://www.gia.edu/report-check?reportno=${certNo}`
      : certType === 'IGI'
      ? `https://www.igi.org/reports/verify-your-report?r=${certNo}`
      : `https://www.hrdantwerp.com/en/diamond-research/grading-report?certno=${certNo}`;

    // Measurements
    const measLength = parseFloat((5.1 + carat * 1.15 + rng(i + 13, 50) * 0.01).toFixed(2));
    const measWidth = parseFloat((measLength - 0.05 + rng(i + 14, 20) * 0.005).toFixed(2));
    const measDepth = parseFloat((3.0 + carat * 0.7 + rng(i + 15, 30) * 0.01).toFixed(2));

    // Technical angles
    const depthPercent = parseFloat((58.5 + rng(i + 16, 60) * 0.1).toFixed(1));
    const tablePercent = parseFloat((53.0 + rng(i + 17, 80) * 0.1).toFixed(1));
    const crownAngle = parseFloat((33.0 + rng(i + 18, 40) * 0.1).toFixed(1));
    const pavilionAngle = parseFloat((40.6 + rng(i + 19, 20) * 0.05).toFixed(1));

    const girdleOptions = ['Thin', 'Medium', 'Slightly Thick', 'Thick'];
    const girdleMin = girdleOptions[Math.floor(rng(i + 20, 3))];
    const girdleMax = girdleOptions[Math.floor(rng(i + 20, 3) + 1) % 4];
    const culetOptions = ['None', 'Very Small', 'Small'];
    const culet = culetOptions[Math.floor(rng(i + 21, culetOptions.length))];

    const stockNo = `${supplier.replace(/\s/g, '').substring(0, 3).toUpperCase()}-${certNo.substring(0, 6)}`;
    const rapPrice = parseFloat((price / carat * (1 + rng(i + 22, 50) * 0.003)).toFixed(0));
    const rapnetDiscount = parseFloat((-5 - rng(i + 23, 30)).toFixed(1));

    inventory.push({
      id: `vdb-${idCounter}`,
      vdbId: `${idCounter}`,
      shape,
      carat,
      color,
      clarity,
      cut,
      price,
      certificate: certType,
      certificateNo: certNo,
      certificateUrl: certUrl,
      imageUrl: shapeImageUrls[shape] || shapeImageUrls['Round'],
      videoUrl: `https://pro360.gemcloud.net/video/?d=${certNo}`, // Gemcloud 360 viewer URL format
      polish,
      symmetry,
      fluorescence,
      depthPercent,
      tablePercent,
      measLength,
      measWidth,
      measDepth,
      lab,
      crownAngle,
      pavilionAngle,
      girdleMin,
      girdleMax,
      culet,
      stockNo,
      supplier,
      rapPrice,
      rapnetDiscount,
    });

    idCounter++;
  }

  return inventory;
}

const mockInventory = generateMockInventory();

// ============================================================
// PROVIDER: VDB (Virtual Diamond Boutique)
// Contact: info@vdbapp.com to get API key + username
// Docs: https://www.vdbapp.com/integrations/
// ============================================================
async function queryVdb(params: VdbSearchParams): Promise<{ diamonds: VdbDiamond[]; total: number }> {
  const apiKey = process.env.VDB_API_KEY || '_eTAh9su9_0cnehpDpqM9xA';
  const accessToken = process.env.VDB_ACCESS_TOKEN || 'iltz_Ie1tN0qm-ANqF7X6SRjwyhmMtzZsmqvyWOZ83I';
  const username = process.env.VDB_API_USERNAME || 'jdgloballtd2020@gmail.com';

  const queryParams = new URLSearchParams({
    type: params.lab === 'Lab Grown' ? 'Lab_grown_Diamond' : 'Diamond',
    markup_mode: 'true',
    page_number: (params.page || 1).toString(),
    page_size: (params.limit || 12).toString(),
  });

  if (params.shapes?.length) params.shapes.forEach(s => queryParams.append('shapes[]', s));
  if (params.colors?.length) queryParams.append('color_from', params.colors[0]);
  if (params.clarities?.length) queryParams.append('clarity_from', params.clarities[0]);
  if (params.cuts?.length) queryParams.append('cut_from', params.cuts[0]);
  if (params.caratMin) queryParams.append('size_from', params.caratMin.toString());
  if (params.caratMax) queryParams.append('size_to', params.caratMax.toString());
  if (params.priceMin) queryParams.append('price_total_from', params.priceMin.toString());
  if (params.priceMax) queryParams.append('price_total_to', params.priceMax.toString());

  // Try V2 Gateway with Token & api_key headers first
  let res = await fetch(`https://apiservices.vdbapp.com/v2/diamonds?${queryParams.toString()}`, {
    headers: {
      'Authorization': `Token token=${accessToken}, api_key=${apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 },
  });

  // Fallback to V3 query if V2 fails
  if (!res.ok) {
    const v3Params = new URLSearchParams({
      api_key: apiKey,
      username: username,
      page: (params.page || 1).toString(),
      records_per_page: (params.limit || 12).toString(),
    });
    if (params.shapes?.length) params.shapes.forEach(s => v3Params.append('shape[]', s));
    if (params.caratMin) v3Params.append('carat_min', params.caratMin.toString());
    if (params.caratMax) v3Params.append('carat_max', params.caratMax.toString());

    res = await fetch(`https://api.vdbapp.com/v3/diamonds?${v3Params.toString()}`, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    });
  }

  if (!res.ok) throw new Error(`VDB API error: ${res.status} ${res.statusText}`);
  const json = await res.json();
  const items = json.response?.body?.diamonds || json.response?.body || [];
  const total = parseInt(json.response?.total_count || json.response?.total || '0') || items.length;

  const diamonds: VdbDiamond[] = items.map((item: any) => {
    const rawPrice = parseFloat(item.total_sales_price || item.sell_price || item.price) || 0;
    const rawCarat = parseFloat(item.size || item.carat) || 1.0;
    const primaryImage = item.image_url || item.s3_image?.url || item.image_thumb_url || item.still_image_url || '';
    const videoUrl = item.video_url || item.transcoded_video_url || item.s3_video?.url || item.hd_image_url || '';

    return {
      id: `vdb-${item.id || item.item_id}`,
      vdbId: String(item.id || item.item_id),
      shape: item.shape || 'Round',
      carat: rawCarat,
      color: item.color || 'G',
      clarity: item.clarity || 'VS1',
      cut: item.cut || 'Excellent',
      price: rawPrice > 0 ? rawPrice : Math.round(rawCarat * 2800),
      certificate: item.lab || 'GIA',
      certificateNo: item.cert_num || '',
      certificateUrl: item.cert_url || `https://www.gia.edu/report-check?reportno=${item.cert_num}`,
      imageUrl: primaryImage,
      videoUrl: videoUrl,
      polish: item.polish || 'Excellent',
      symmetry: item.symmetry || 'Excellent',
      fluorescence: item.fluor_intensity || item.fluor || item.fluorescence || 'None',
      depthPercent: parseFloat(item.depth_percent || item.depth) || 60.0,
      tablePercent: parseFloat(item.table_percent || item.table) || 56.0,
      measLength: parseFloat(item.meas_length) || 0,
      measWidth: parseFloat(item.meas_width) || 0,
      measDepth: parseFloat(item.meas_depth) || 0,
      lab: item.type === 'Lab_grown_Diamond' || item.lab_grown ? 'Lab Grown' : 'Natural',
      crownAngle: parseFloat(item.crown_angle) || undefined,
      pavilionAngle: parseFloat(item.pavilion_angle) || undefined,
      girdleMin: item.girdle_min,
      girdleMax: item.girdle_max,
      culet: item.culet_size || item.culet,
      stockNo: item.stock_num || item.vendor_sku,
      supplier: item.vendor_name || 'VDB Supplier',
      rapPrice: parseFloat(item.price_per_carat) || undefined,
      rapnetDiscount: parseFloat(item.discount_percent) || undefined,
    };
  });

  return { diamonds, total };
}

// ============================================================
// PROVIDER: Nivoda
// Sign up: https://www.nivoda.net
// GraphQL API: https://integrations.nivoda.net/api/diamonds
// ============================================================
let nivodaToken: string | null = null;
let nivodaTokenExpiry = 0;

async function getNivodaToken(): Promise<string> {
  if (nivodaToken && Date.now() < nivodaTokenExpiry) return nivodaToken;

  const res = await fetch('https://integrations.nivoda.net/api/diamonds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation Authenticate($username: String!, $password: String!) {
        authenticate(username: $username, password: $password) {
          token
          expires_at
        }
      }`,
      variables: {
        username: process.env.NIVODA_EMAIL || '',
        password: process.env.NIVODA_PASSWORD || ''
      }
    })
  });

  if (!res.ok) throw new Error('Nivoda auth failed');
  const json = await res.json();
  nivodaToken = json.data?.authenticate?.token;
  nivodaTokenExpiry = Date.now() + 3300000; // 55 min
  return nivodaToken!;
}

async function queryNivoda(params: VdbSearchParams): Promise<{ diamonds: VdbDiamond[]; total: number }> {
  const token = await getNivodaToken();
  const page = params.page || 1;
  const limit = params.limit || 12;

  const filters: string[] = [];
  if (params.shapes?.length) filters.push(`shapes: [${params.shapes.map(s => `"${s}"`).join(',')}]`);
  if (params.colors?.length) filters.push(`colors: [${params.colors.map(c => `"${c}"`).join(',')}]`);
  if (params.clarities?.length) filters.push(`clarities: [${params.clarities.map(c => `"${c}"`).join(',')}]`);
  if (params.cuts?.length) filters.push(`cuts: [${params.cuts.map(c => `"${c}"`).join(',')}]`);
  if (params.caratMin) filters.push(`caratMin: ${params.caratMin}`);
  if (params.caratMax) filters.push(`caratMax: ${params.caratMax}`);
  if (params.priceMin) filters.push(`priceMin: ${params.priceMin}`);
  if (params.priceMax) filters.push(`priceMax: ${params.priceMax}`);
  if (params.lab) filters.push(`labGrown: ${params.lab === 'Lab Grown'}`);

  const sortMap: Record<string, string> = {
    price_asc: 'price_asc',
    price_desc: 'price_desc',
    carat_desc: 'carat_desc',
  };

  const query = `{
    diamonds(
      ${filters.join('\n      ')}
      offset: ${(page - 1) * limit}
      limit: ${limit}
      ${params.sort ? `sort_by: ${sortMap[params.sort] || 'price_asc'}` : ''}
    ) {
      total_count
      items {
        id
        shape
        carats
        color
        clarity
        cut_grade
        girdle
        polish
        symmetry
        flour_intensity
        lab_grown
        price
        certificate { lab report_number report_url }
        image { url }
        video { url }
        depth_percent
        table_percent
        meas_length meas_width meas_depth
        crown_angle pavilion_angle
        culet
        supplier { name id }
      }
    }
  }`;

  const res = await fetch('https://integrations.nivoda.net/api/diamonds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ query }),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Nivoda API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(`Nivoda GraphQL error: ${json.errors[0]?.message}`);

  const items = json.data?.diamonds?.items || [];
  const total = json.data?.diamonds?.total_count || items.length;

  const diamonds: VdbDiamond[] = items.map((item: any) => ({
    id: `niv-${item.id}`,
    vdbId: item.id,
    shape: item.shape || 'Round',
    carat: parseFloat(item.carats) || 1.0,
    color: item.color || 'G',
    clarity: item.clarity || 'VS1',
    cut: item.cut_grade || 'Excellent',
    price: parseFloat(item.price) || 0,
    certificate: item.certificate?.lab || 'GIA',
    certificateNo: item.certificate?.report_number || '',
    certificateUrl: item.certificate?.report_url || '',
    imageUrl: item.image?.url || '',
    videoUrl: item.video?.url || '',
    polish: item.polish || 'Excellent',
    symmetry: item.symmetry || 'Excellent',
    fluorescence: item.flour_intensity || 'None',
    depthPercent: parseFloat(item.depth_percent) || 60.0,
    tablePercent: parseFloat(item.table_percent) || 56.0,
    measLength: parseFloat(item.meas_length) || 0,
    measWidth: parseFloat(item.meas_width) || 0,
    measDepth: parseFloat(item.meas_depth) || 0,
    lab: item.lab_grown ? 'Lab Grown' : 'Natural',
    crownAngle: parseFloat(item.crown_angle) || undefined,
    pavilionAngle: parseFloat(item.pavilion_angle) || undefined,
    girdleMin: item.girdle,
    culet: item.culet,
    supplier: item.supplier?.name,
  }));

  return { diamonds, total };
}

// ============================================================
// PROVIDER: RapNet (Rapaport)
// Sign up: https://www.rapaport.com/rapnet/
// REST API: https://technet.rapaport.com/
// ============================================================
async function queryRapnet(params: VdbSearchParams): Promise<{ diamonds: VdbDiamond[]; total: number }> {
  // RapNet uses a SOAP-style REST API with JWT auth
  const apiKey = process.env.RAPNET_API_KEY || '';
  const page = params.page || 1;
  const limit = params.limit || 12;

  const body = {
    search_type: 'White',
    shape: params.shapes?.join(',') || '',
    color_from: params.colors?.[0] || 'D',
    color_to: params.colors?.[params.colors.length - 1] || 'J',
    clarity_from: params.clarities?.[0] || 'FL',
    clarity_to: params.clarities?.[params.clarities.length - 1] || 'SI2',
    cut_from: params.cuts?.[0] || 'EX',
    carat_from: params.caratMin || 0.3,
    carat_to: params.caratMax || 10.0,
    price_total_from: params.priceMin || 0,
    price_total_to: params.priceMax || 999999,
    lab_grown: params.lab === 'Lab Grown' ? '1' : '0',
    page_number: page,
    page_size: limit,
  };

  const res = await fetch('https://technet.rapaport.com/HTTP/DLS/GetDLS.aspx', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`RapNet API error: ${res.status}`);
  const json = await res.json();
  const items = json.DataTable?.Diamonds || [];
  const total = json.TotalDiamonds || items.length;

  const diamonds: VdbDiamond[] = items.map((item: any) => ({
    id: `rap-${item.DiamondID}`,
    vdbId: String(item.DiamondID),
    shape: item.Shape || 'Round',
    carat: parseFloat(item.Weight) || 1.0,
    color: item.Color || 'G',
    clarity: item.Clarity || 'VS1',
    cut: item.Cut || 'Excellent',
    price: parseFloat(item.CashPrice) || parseFloat(item.FancyPrice) || 0,
    certificate: item.Lab || 'GIA',
    certificateNo: item.CertificateID || '',
    certificateUrl: `https://www.gia.edu/report-check?reportno=${item.CertificateID}`,
    imageUrl: item.DiamondImage || '',
    videoUrl: item.DiamondVideo || '',
    polish: item.Polish || 'Excellent',
    symmetry: item.Symmetry || 'Excellent',
    fluorescence: item.Fluorescence || 'None',
    depthPercent: parseFloat(item.Depth) || 60.0,
    tablePercent: parseFloat(item.Table) || 56.0,
    measLength: parseFloat(item.MeasLength) || 0,
    measWidth: parseFloat(item.MeasWidth) || 0,
    measDepth: parseFloat(item.MeasDepth) || 0,
    lab: item.LabGrown === '1' ? 'Lab Grown' : 'Natural',
    crownAngle: parseFloat(item.CrownAngle) || undefined,
    pavilionAngle: parseFloat(item.PavilionAngle) || undefined,
    culet: item.Culet,
    stockNo: item.VendorStockNumber,
    supplier: item.SellerName,
    rapPrice: parseFloat(item.RapPrice) || undefined,
    rapnetDiscount: parseFloat(item.RapnetDiscount) || undefined,
  }));

  return { diamonds, total };
}

// ============================================================
// MAIN SERVICE CLASS
// ============================================================
export class VdbService {
  private static getProvider(): 'mock' | 'vdb' | 'nivoda' | 'rapnet' {
    // Explicit env var takes priority
    const explicit = process.env.DIAMOND_PROVIDER as 'mock' | 'vdb' | 'nivoda' | 'rapnet' | undefined;
    if (explicit && explicit !== 'mock') return explicit;

    // Auto-detect from available credentials
    if (process.env.VDB_API_KEY && process.env.VDB_API_USERNAME) return 'vdb';
    if (process.env.NIVODA_EMAIL && process.env.NIVODA_PASSWORD) return 'nivoda';
    if (process.env.RAPNET_API_KEY) return 'rapnet';

    return 'mock';
  }

  // Search diamonds
  public static async search(params: VdbSearchParams): Promise<{ diamonds: VdbDiamond[]; total: number }> {
    const provider = this.getProvider();

    try {
      if (provider === 'vdb') return await queryVdb(params);
      if (provider === 'nivoda') return await queryNivoda(params);
      if (provider === 'rapnet') return await queryRapnet(params);
    } catch (e) {
      console.error(`[DiamondService] ${provider} API error, falling back to mock:`, e);
    }

    // Mock fallback
    return this.searchMock(params);
  }

  // Get single diamond by ID
  public static async getById(id: string): Promise<VdbDiamond | null> {
    const provider = this.getProvider();

    if (provider !== 'mock') {
      try {
        if (provider === 'vdb') {
          const itemId = id.replace('vdb-', '');
          const apiKey = process.env.VDB_API_KEY || '';
          const username = process.env.VDB_API_USERNAME || '';
          const queryParams = new URLSearchParams({ api_key: apiKey, username });
          const res = await fetch(`https://api.vdbapp.com/v3/diamonds/${itemId}?${queryParams.toString()}`);
          if (res.ok) {
            const json = await res.json();
            const item = json.response?.body;
            if (item) return this.mapVdbItem(item);
          }
        }
        if (provider === 'nivoda') {
          const token = await getNivodaToken();
          const res = await fetch('https://integrations.nivoda.net/api/diamonds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              query: `{ diamond(id: "${id.replace('niv-', '')}") { id shape carats color clarity cut_grade price certificate { lab report_number report_url } image { url } video { url } polish symmetry flour_intensity lab_grown depth_percent table_percent meas_length meas_width meas_depth crown_angle pavilion_angle culet supplier { name } } }`
            })
          });
          if (res.ok) {
            const json = await res.json();
            const item = json.data?.diamond;
            if (item) return {
              id: `niv-${item.id}`, vdbId: item.id, shape: item.shape, carat: parseFloat(item.carats),
              color: item.color, clarity: item.clarity, cut: item.cut_grade, price: parseFloat(item.price),
              certificate: item.certificate?.lab || 'GIA', certificateNo: item.certificate?.report_number || '',
              certificateUrl: item.certificate?.report_url || '', imageUrl: item.image?.url || '',
              videoUrl: item.video?.url || '', polish: item.polish, symmetry: item.symmetry,
              fluorescence: item.flour_intensity, depthPercent: parseFloat(item.depth_percent),
              tablePercent: parseFloat(item.table_percent), measLength: parseFloat(item.meas_length),
              measWidth: parseFloat(item.meas_width), measDepth: parseFloat(item.meas_depth),
              lab: item.lab_grown ? 'Lab Grown' : 'Natural', crownAngle: parseFloat(item.crown_angle),
              pavilionAngle: parseFloat(item.pavilion_angle), culet: item.culet, supplier: item.supplier?.name,
            };
          }
        }
      } catch (e) {
        console.error(`[DiamondService] getById ${provider} error:`, e);
      }
    }

    return mockInventory.find(d => d.id === id) || null;
  }

  // Get active provider name (for UI display)
  public static getProviderName(): string {
    const p = this.getProvider();
    return { mock: 'Demo Inventory', vdb: 'Virtual Diamond Boutique', nivoda: 'Nivoda', rapnet: 'RapNet' }[p];
  }

  // Check if using live data
  public static isLive(): boolean {
    return this.getProvider() !== 'mock';
  }

  // Mock search (full filtering, sorting, pagination)
  private static searchMock(params: VdbSearchParams): { diamonds: VdbDiamond[]; total: number } {
    let results = [...mockInventory];

    if (params.q) {
      const q = params.q.toLowerCase().trim();
      results = results.filter(d => 
        d.id.toLowerCase().includes(q) || 
        d.certificateNo.includes(q) || 
        d.shape.toLowerCase().includes(q) ||
        (d.stockNo && d.stockNo.toLowerCase().includes(q))
      );
    }

    if (params.shapes?.length) {
      const lower = params.shapes.map(s => s.toLowerCase());
      results = results.filter(d => lower.includes(d.shape.toLowerCase()));
    }
    if (params.colors?.length) results = results.filter(d => params.colors!.includes(d.color));
    if (params.clarities?.length) results = results.filter(d => params.clarities!.includes(d.clarity));
    if (params.cuts?.length) results = results.filter(d => params.cuts!.includes(d.cut));
    if (params.certificates?.length) results = results.filter(d => params.certificates!.map(c => c.toLowerCase()).includes(d.certificate.toLowerCase()));
    if (params.polishes?.length) results = results.filter(d => params.polishes!.map(p => p.toLowerCase()).includes(d.polish.toLowerCase()));
    if (params.symmetries?.length) results = results.filter(d => params.symmetries!.map(s => s.toLowerCase()).includes(d.symmetry.toLowerCase()));
    if (params.fluorescences?.length) results = results.filter(d => params.fluorescences!.map(f => f.toLowerCase()).includes(d.fluorescence.toLowerCase()));
    if (params.caratMin !== undefined) results = results.filter(d => d.carat >= params.caratMin!);
    if (params.caratMax !== undefined) results = results.filter(d => d.carat <= params.caratMax!);
    if (params.priceMin !== undefined) results = results.filter(d => d.price >= params.priceMin!);
    if (params.priceMax !== undefined) results = results.filter(d => d.price <= params.priceMax!);
    if (params.lab) results = results.filter(d => d.lab.toLowerCase() === params.lab!.toLowerCase());

    switch (params.sort) {
      case 'price_asc':   results.sort((a, b) => a.price - b.price); break;
      case 'price_desc':  results.sort((a, b) => b.price - a.price); break;
      case 'carat_desc':  results.sort((a, b) => b.carat - a.carat); break;
      case 'carat_asc':   results.sort((a, b) => a.carat - b.carat); break;
      default: break;
    }

    const total = results.length;
    const page = params.page || 1;
    const limit = params.limit || 12;
    const paginated = results.slice((page - 1) * limit, (page - 1) * limit + limit);

    return { diamonds: paginated, total };
  }

  // Map raw VDB API item to VdbDiamond
  private static mapVdbItem(item: any): VdbDiamond {
    return {
      id: `vdb-${item.item_id}`,
      vdbId: String(item.item_id),
      shape: item.shape || 'Round',
      carat: parseFloat(item.carat) || 1.0,
      color: item.color || 'G',
      clarity: item.clarity || 'VS1',
      cut: item.cut || 'Excellent',
      price: parseFloat(item.price) || 0,
      certificate: item.lab || 'GIA',
      certificateNo: item.cert_num || '',
      certificateUrl: item.cert_url || '',
      imageUrl: item.image_url || '',
      videoUrl: item.video_url || '',
      polish: item.polish || 'Excellent',
      symmetry: item.symmetry || 'Excellent',
      fluorescence: item.fluor || 'None',
      depthPercent: parseFloat(item.depth_percent) || 60.0,
      tablePercent: parseFloat(item.table_percent) || 56.0,
      measLength: parseFloat(item.meas_length) || 0,
      measWidth: parseFloat(item.meas_width) || 0,
      measDepth: parseFloat(item.meas_depth) || 0,
      lab: item.lab_type === 'lab_grown' ? 'Lab Grown' : 'Natural',
      crownAngle: parseFloat(item.crown_angle) || undefined,
      pavilionAngle: parseFloat(item.pavilion_angle) || undefined,
      girdleMin: item.girdle_min,
      girdleMax: item.girdle_max,
      culet: item.culet,
      stockNo: item.stock_num,
      supplier: item.vendor_name,
      rapPrice: parseFloat(item.rap_price) || undefined,
      rapnetDiscount: parseFloat(item.rapnet_discount) || undefined,
    };
  }
}
