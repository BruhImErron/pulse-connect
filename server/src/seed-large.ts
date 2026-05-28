import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// NOTE: This file generates synthetic placeholder NGOs for global world coverage and load testing.
// The real preview dataset should use `src/seed.ts` with verified organization names.
// Run `npm run db:seed:world` to populate a broad world dataset.
const generateNGOs = () => {
  const countries = [
    // Asia
    { name: "India", lat: 20.5937, lon: 78.9629 },
    { name: "Philippines", lat: 12.8797, lon: 121.7740 },
    { name: "Bangladesh", lat: 23.6850, lon: 90.3563 },
    { name: "Indonesia", lat: -0.7893, lon: 113.9213 },
    { name: "Pakistan", lat: 30.3753, lon: 69.3451 },
    { name: "Thailand", lat: 15.8700, lon: 100.9925 },
    { name: "Vietnam", lat: 14.0583, lon: 108.2772 },
    { name: "Myanmar", lat: 21.9162, lon: 95.9560 },
    { name: "Cambodia", lat: 12.5657, lon: 104.9910 },
    { name: "Nepal", lat: 28.3949, lon: 84.1240 },
    { name: "Sri Lanka", lat: 7.8731, lon: 80.7718 },
    { name: "China", lat: 35.8617, lon: 104.1954 },
    { name: "Japan", lat: 36.2048, lon: 138.2529 },
    { name: "South Korea", lat: 35.9078, lon: 127.7669 },
    // Africa
    { name: "Kenya", lat: -0.0236, lon: 37.9062 },
    { name: "Nigeria", lat: 9.0820, lon: 8.6753 },
    { name: "Ghana", lat: 7.3697, lon: -5.3676 },
    { name: "Uganda", lat: 1.3733, lon: 32.2903 },
    { name: "Ethiopia", lat: 9.1450, lon: 40.4897 },
    { name: "Tanzania", lat: -6.3690, lon: 34.8888 },
    { name: "Zambia", lat: -13.1339, lon: 27.8493 },
    { name: "Zimbabwe", lat: -19.0154, lon: 29.1549 },
    { name: "South Africa", lat: -30.5595, lon: 22.9375 },
    { name: "Cameroon", lat: 3.8480, lon: 11.5021 },
    { name: "Mali", lat: 17.5707, lon: -3.9962 },
    // Latin America
    { name: "Brazil", lat: -14.2350, lon: -51.9253 },
    { name: "Mexico", lat: 23.6345, lon: -102.5528 },
    { name: "Peru", lat: -9.1900, lon: -75.0152 },
    { name: "Colombia", lat: 4.5709, lon: -74.2973 },
    { name: "Argentina", lat: -38.4161, lon: -63.6167 },
    { name: "Chile", lat: -35.6751, lon: -71.5430 },
    // Europe
    { name: "United Kingdom", lat: 55.3781, lon: -3.4360 },
    { name: "Germany", lat: 51.1657, lon: 10.4515 },
    { name: "France", lat: 46.2276, lon: 2.2137 },
    { name: "Italy", lat: 41.8719, lon: 12.5674 },
    { name: "Spain", lat: 40.4637, lon: -3.7492 },
    { name: "Poland", lat: 51.9194, lon: 19.1451 },
    { name: "Netherlands", lat: 52.1326, lon: 5.2913 },
    { name: "Belgium", lat: 50.5039, lon: 4.4699 },
    { name: "Greece", lat: 39.0742, lon: 21.8243 },
    // Middle East
    { name: "Syria", lat: 34.8021, lon: 38.9968 },
    { name: "Lebanon", lat: 33.8547, lon: 35.8623 },
    { name: "Palestine", lat: 31.9454, lon: 35.2338 },
    // North America
    { name: "United States", lat: 37.0902, lon: -95.7129 },
    { name: "Canada", lat: 56.1304, lon: -106.3468 },
  ];

  const ngoTypes = [
    "Health",
    "Education",
    "Water & Sanitation",
    "Food Security",
    "Environment",
    "Disaster Relief",
    "Mental Health",
    "Women Empowerment",
    "Child Protection",
    "HIV/AIDS",
    "Malaria Prevention",
    "Maternal Health",
    "Nutrition",
    "Livelihood",
    "Renewable Energy",
    "Climate Action",
    "Peace Building",
    "Technology Access",
    "Disability Rights",
    "LGBTQ+ Rights",
  ];

  const ngoNames = [
    "Hope Foundation",
    "Unity Health Alliance",
    "Global Welfare Trust",
    "Community Care Network",
    "Helping Hands Initiative",
    "Future Leaders Fund",
    "Sustainable Living Project",
    "Emergency Response Corps",
    "Education First Organization",
    "Clean Water Initiative",
    "Food for All Program",
    "Health & Wellness Foundation",
    "Green Earth Alliance",
    "Social Impact Network",
    "Development Partners",
    "Wellness Advocates",
    "Relief & Recovery Team",
    "Innovation for Good",
    "Community Champions",
    "Empowerment Network",
  ];

  const descriptions = [
    "Providing healthcare access to underserved communities",
    "Delivering quality education to disadvantaged youth",
    "Ensuring clean water and sanitation access",
    "Supporting food security and nutrition programs",
    "Protecting the environment and biodiversity",
    "Responding to natural disasters and emergencies",
    "Supporting mental health and psychosocial wellbeing",
    "Empowering women through economic opportunities",
    "Protecting vulnerable children and youth",
    "Fighting infectious diseases through prevention and treatment",
    "Building sustainable livelihoods and economic development",
    "Promoting renewable energy and climate action",
    "Building peace and resolving conflicts",
    "Expanding technology access and digital literacy",
    "Advocating for rights of marginalized communities",
    "Supporting disaster preparedness and resilience",
    "Providing vocational training and skill development",
    "Improving maternal and newborn health outcomes",
    "Supporting elderly care and senior services",
    "Promoting community health and wellbeing",
  ];

  const tags = [
    "Health",
    "Education",
    "Water",
    "Food Security",
    "Environment",
    "Emergency",
    "Mental Health",
    "Women",
    "Children",
    "Disease Prevention",
    "Nutrition",
    "Livelihood",
    "Energy",
    "Climate",
    "Peace",
    "Technology",
    "Disability",
    "Rural Community",
    "Urban Development",
    "Youth",
  ];

  const ngos = [];
  let id = 1;

  // Generate NGOs for each country
  for (const country of countries) {
    const ngosPerCountry = Math.floor(2000 / countries.length); // 40+ per country

    for (let i = 0; i < ngosPerCountry; i++) {
      const nameIdx = Math.floor(Math.random() * ngoNames.length);
      const typeIdx = Math.floor(Math.random() * ngoTypes.length);
      const descIdx = Math.floor(Math.random() * descriptions.length);
      const tagsSelected = [];
      const tagCount = Math.floor(Math.random() * 3) + 2;
      for (let t = 0; t < tagCount; t++) {
        tagsSelected.push(tags[Math.floor(Math.random() * tags.length)]);
      }

      // Add location variation within country
      const latVariation = (Math.random() - 0.5) * 5;
      const lonVariation = (Math.random() - 0.5) * 5;

      ngos.push({
        name: `${ngoNames[nameIdx]} - ${ngoTypes[typeIdx]} (${country.name} ${i + 1})`,
        location: `${country.name} Region ${i + 1}`,
        country: country.name,
        description: descriptions[descIdx],
        score: Math.floor(Math.random() * 30) + 65, // 65-95
        tags: [...new Set(tagsSelected)].join(","),
        latitude: country.lat + latVariation,
        longitude: country.lon + lonVariation,
      });

      id++;
    }
  }

  return ngos;
};

async function main() {
  console.log("Generating 2000+ NGOs across all continents (40+ per country)...");

  // Clear existing NGOs
  await prisma.ngo.deleteMany({});
  console.log("Cleared existing NGO data");

  const ngos = generateNGOs();
  console.log(`Created ${ngos.length} NGOs`);

  // Batch insert in chunks to avoid payload size limits
  const chunkSize = 100;
  for (let i = 0; i < ngos.length; i += chunkSize) {
    const chunk = ngos.slice(i, i + chunkSize);
    await prisma.ngo.createMany({ data: chunk });
    console.log(`Inserted ${Math.min(i + chunkSize, ngos.length)} / ${ngos.length}`);
  }

  console.log("✅ Seed complete - 2000+ global NGOs seeded (40+ per country)");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
