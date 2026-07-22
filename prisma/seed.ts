import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin credentials come from the environment — never hard-coded, so no
  // password lives in the repo. Re-running the seed with a new ADMIN_PASSWORD
  // rotates the existing admin's password (see `update` below).
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@metplast.com'
  const adminName = process.env.ADMIN_NAME || 'Metplast Admin'
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || adminPassword.length < 8) {
    throw new Error(
      'ADMIN_PASSWORD env var is required and must be at least 8 characters. ' +
      'Set it before seeding, e.g. ADMIN_PASSWORD="your-strong-pass" npx prisma db seed'
    )
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: passwordHash, name: adminName },
    create: {
      email: adminEmail,
      name: adminName,
      password: passwordHash,
    },
  })

  console.log(`Admin ready: ${admin.email}`)

  const isProd = process.env.NODE_ENV === 'production'

  // Seed default chatbot provider to Gemini if not set
  await prisma.setting.upsert({
    where: { key: 'chatbot_provider' },
    update: {},
    create: {
      key: 'chatbot_provider',
      value: 'gemini'
    }
  })
  
  await prisma.setting.upsert({
    where: { key: 'chatbot_training_data' },
    update: {},
    create: {
      key: 'chatbot_training_data',
      value: 'You are a helpful assistant for Metplast. Metplast sells poultry equipment.'
    }
  })
  // Demo/sample content below — never seed into production (dummy leads,
  // placeholder products, sample blog). Production gets admin + settings only.
  if (!isProd) {
  // Dummy Products
  await prisma.product.upsert({
    where: { slug: 'layer-cages' },
    update: {},
    create: {
      slug: 'layer-cages',
      name: 'Layer Cages (A-Type)',
      tagline: 'High yield configuration for layer birds.',
      description: 'Durable A-Type layer cages designed for optimal egg production and bird health.',
      image: '/images/Layer.png',
      category: 'Layer Systems',
      specs: '{"capacity": "100 birds", "material": "Galvanized Steel"}'
    }
  })

  await prisma.product.upsert({
    where: { slug: 'broiler-systems' },
    update: {},
    create: {
      slug: 'broiler-systems',
      name: 'Broiler Floor Systems',
      tagline: 'Precision engineered for broiler growth.',
      description: 'Automated feeding and drinking lines for maximum broiler performance.',
      image: '/images/Broiler.png',
      category: 'Broiler Systems',
      specs: '{"feeding": "Automated Pans", "watering": "Nipple Drinkers"}'
    }
  })

  // Dummy Enquiries
  const enquiryCount = await prisma.enquiry.count()
  if (enquiryCount === 0) {
    await prisma.enquiry.createMany({
      data: [
        {
          name: 'John Smith',
          email: 'john@smithpoultry.com',
          phone: '+1 234 567 8900',
          message: 'I am interested in getting a quote for a 50,000 bird layer cage setup in Texas.',
          status: 'NEW'
        },
        {
          name: 'Priya Sharma',
          email: 'priya@sharmafarms.in',
          phone: '+91 98765 43210',
          message: 'Can you provide details on your automated broiler feeding systems?',
          status: 'IN_PROGRESS'
        },
        {
          name: 'David Omondi',
          email: 'david@agrifrica.ke',
          phone: '+254 712 345 678',
          message: 'Looking for climate control solutions for a new poultry shed.',
          status: 'CLOSED'
        }
      ]
    })
  }

  // Sample blog content (non-prod only). Copy MUST honor the no-overclaim
  // rules — no fertility/hatchability/yield promises, no banned terms.
  const blogCount = await prisma.blog.count()
  if (blogCount === 0) {
    const category = await prisma.blogCategory.upsert({
      where: { name: 'Company News' },
      update: {},
      create: { name: 'Company News', slug: 'company-news', sortOrder: 0 },
    })
    await prisma.blog.create({
      data: {
        slug: 'welcome-to-the-metplast-blog',
        title: 'Welcome to the Metplast Blog',
        excerpt: 'Updates on our poultry housing systems, projects, and the team behind them.',
        content: '<p>Welcome to the Metplast blog. Here we will share updates on our poultry housing systems, feed silos, ventilation, project installations, and news from our team.</p><p>Check back for practical guides on planning and running poultry infrastructure.</p>',
        author: 'Metplast Team',
        featured: true,
        published: true,
        categoryId: category.id,
      },
    })
    await prisma.blog.create({
      data: {
        slug: 'planning-your-poultry-housing-project',
        title: 'Planning Your Poultry Housing Project',
        excerpt: 'A few things to consider before you build — bird count, climate, layout, and budget.',
        content: '<p>Every poultry project starts with a few key questions: how many birds, what climate, and how much space is available.</p><h2>Start with the basics</h2><ul><li>Bird count and system type</li><li>Local climate and ventilation needs</li><li>Site layout and access</li><li>Budget and phasing</li></ul><p>Our team can help you match a system to your farm. Reach out through the contact page to start a conversation.</p>',
        author: 'Metplast Team',
        featured: false,
        published: true,
        categoryId: category.id,
      },
    })
  }
  } // end !isProd demo content
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
