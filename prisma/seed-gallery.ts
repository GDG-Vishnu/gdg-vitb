import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const galleryImages = [
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/ctv8yn9y6xaczodyjo0c.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767086900/prompt%20engineering/tk3aakahjoxsimjvidgm.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1765644013/mggyknteqkhgkb2w3grz.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767165297/nnpeqla0vy1pm2ftqt7r.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301326/gzruxxa5nyohbu9e1s7i.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1771301325/bdkiturqrivu4rmzkmnl.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170501/joat26rbj3rb0kdja0ue.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767170551/sghz2b8xtbolh90rj6ye.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732847/uumcqlo3robkw70z9rhk.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1766732840/igrrs1fp9ag45hqzz64r.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175612/jxsg0t4bozchigoqodga.png",
    uploadedAt: new Date("2025-12-31"),
  },
  {
    imageUrl:
      "https://res.cloudinary.com/dlupkibvq/image/upload/v1767175818/nrei8nrsar4iio30ukkh.jpg",
    uploadedAt: new Date("2025-12-31"),
  },
];

async function main() {
  await prisma.gallery.deleteMany();
  await prisma.gallery.createMany({ data: galleryImages });
  console.log("Seeded gallery images.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
