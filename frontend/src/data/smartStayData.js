export const propertyTypes = [
  {
    id: 1,
    category_name: 'PG',
    description: 'Managed paying guest accommodation for students.',
  },
  {
    id: 2,
    category_name: 'Hostel',
    description: 'Shared hostel rooms close to campus facilities.',
  },
  {
    id: 3,
    category_name: 'Apartment',
    description: 'Private apartments suitable for individual students.',
  },
  {
    id: 4,
    category_name: 'Shared Flat',
    description: 'Shared flats for students looking to split rent.',
  },
];

export const fallbackProperties = [
  {
    id: 1,
    owner_id: 101,
    property_name: 'Green Nest PG',
    property_type: 'PG',
    rent: 4500,
    location: 'College Road',
    distance_from_college: 0.8,
    amenities: 'WiFi, Laundry, Meals, Study Table',
    description:
      'Verified girls PG with biometric entry, clean rooms, home-style meals, and quiet study hours near the main campus gate.',
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80',
    verified: true,
    verification_score: 94,
    risk: 'Low',
  },
  {
    id: 2,
    owner_id: 102,
    property_name: 'Metro Student Hostel',
    property_type: 'Hostel',
    rent: 3200,
    location: 'Metro Colony',
    distance_from_college: 1.5,
    amenities: 'WiFi, Security, Common Room, Laundry',
    description:
      'Budget hostel with shared rooms, 24x7 security, common study lounge, and quick access to bus and metro stops.',
    image:
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=900&q=80',
    verified: true,
    verification_score: 88,
    risk: 'Low',
  },
  {
    id: 3,
    owner_id: 103,
    property_name: 'Sunrise Studio Apartment',
    property_type: 'Apartment',
    rent: 9800,
    location: 'Lake View Lane',
    distance_from_college: 2.4,
    amenities: 'WiFi, Kitchen, Power Backup, Parking',
    description:
      'Compact private studio for senior students, with kitchen access, power backup, and a calm residential neighborhood.',
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    verified: false,
    verification_score: 72,
    risk: 'Medium',
  },
  {
    id: 4,
    owner_id: 104,
    property_name: 'Campus Circle Shared Flat',
    property_type: 'Shared Flat',
    rent: 6500,
    location: 'North Campus',
    distance_from_college: 0.5,
    amenities: 'WiFi, Kitchen, Laundry, Furnished',
    description:
      'Furnished shared flat with two rooms, a stocked kitchen, strong WiFi, and walking-distance access to libraries and cafes.',
    image:
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80',
    verified: true,
    verification_score: 91,
    risk: 'Low',
  },
  {
    id: 5,
    owner_id: 105,
    property_name: 'Budget Study Stay',
    property_type: 'PG',
    rent: 2800,
    location: 'Old Bus Stand Area',
    distance_from_college: 3.2,
    amenities: 'Meals, Security, Water Purifier',
    description:
      'Low-rent student stay with basic furnished rooms, simple meals, and verified owner contact for students on tight budgets.',
    image:
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80',
    verified: false,
    verification_score: 68,
    risk: 'Medium',
  },
  {
    id: 6,
    owner_id: 106,
    property_name: 'Scholars Safe Hostel',
    property_type: 'Hostel',
    rent: 7200,
    location: 'Library Square',
    distance_from_college: 0.9,
    amenities: 'WiFi, Laundry, CCTV, Meals, Power Backup',
    description:
      'Premium hostel with CCTV coverage, fast WiFi, laundry, power backup, and meals designed around student schedules.',
    image:
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80',
    verified: true,
    verification_score: 96,
    risk: 'Low',
  },
];

export const budgetOptions = [
  { label: 'Under Rs 3000', value: 'under-3000', min: 0, max: 3000 },
  { label: 'Rs 3000-Rs 6000', value: '3000-6000', min: 3000, max: 6000 },
  { label: 'Rs 6000-Rs 10000', value: '6000-10000', min: 6000, max: 10000 },
  { label: 'Above Rs 10000', value: 'above-10000', min: 10000, max: Infinity },
];

export const normalizeProperty = (property) => ({
  ...property,
  property_name: property.property_name || property.product_name || property.name || 'Student Stay',
  property_type: property.property_type || property.category || 'PG',
  rent: Number(property.rent ?? property.price ?? 0),
  location: property.location || property.city || 'Campus Area',
  distance_from_college: Number(property.distance_from_college ?? property.distance ?? 1),
  amenities: property.amenities || property.description || '',
  description: property.description || 'Student-friendly verified accommodation.',
  image: String(property.image || property.picture || '').split(',')[0].trim(),
  verified: Boolean(property.verified ?? property.quality_verified),
  verification_score: Number(property.verification_score ?? (property.verified ? 90 : 70)),
  risk: property.risk || (property.verified ? 'Low' : 'Medium'),
});

export const getAmenityList = (amenities = '') =>
  amenities
    .split(',')
    .map((amenity) => amenity.trim())
    .filter(Boolean);

export const getVerificationScore = ({ description = '', image = '', imageCount = 0, amenities = '' }) => {
  const normalizedImageCount = Number(imageCount) || (image ? image.split(',').filter(Boolean).length : 0);
  let score = 100;

  if (description.trim().length < 20) score -= 35;
  if (normalizedImageCount < 2) score -= 20;
  if (getAmenityList(amenities).length < 3) score -= 10;

  return Math.max(35, Math.min(100, score));
};

export const getRiskLevel = (score) => {
  if (score >= 85) return 'Low';
  if (score >= 65) return 'Medium';
  return 'High';
};
