import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@metplast.com' },
    update: {},
    create: {
      email: 'admin@metplast.com',
      name: 'Anshul Rosia',
      password: passwordHash,
    },
  })
  
  console.log({ admin })

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

  // Dummy Blogs
  const blogCount = await prisma.blog.count()
  if (blogCount === 0) {
    await prisma.blog.create({
      data: {
        slug: 'future-of-poultry',
        title: 'The Future of Poultry Automation in 2026',
        content: 'Automation is rapidly changing how we manage poultry farms. With AI-driven climate control and automated feeding, efficiency has never been higher.',
        published: true
      }
    })
  }
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
