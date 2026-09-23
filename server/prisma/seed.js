import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SportConnect database...');

  // 1. Clean existing records safely
  await prisma.sessionParticipant.deleteMany();
  await prisma.sportSession.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
  const playerPasswordHash = await bcrypt.hash('Player@123', salt);

  // 3. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Akash (Admin)',
      email: 'admin@sportconnect.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  const player1 = await prisma.user.create({
    data: {
      name: 'Rahul Sharma',
      email: 'player@sportconnect.com',
      passwordHash: playerPasswordHash,
      role: 'PLAYER',
    },
  });

  const player2 = await prisma.user.create({
    data: {
      name: 'Rohit Verma',
      email: 'player2@sportconnect.com',
      passwordHash: playerPasswordHash,
      role: 'PLAYER',
    },
  });

  const player3 = await prisma.user.create({
    data: {
      name: 'Avinash Patel',
      email: 'avinash@sportconnect.com',
      passwordHash: playerPasswordHash,
      role: 'PLAYER',
    },
  });

  console.log('✅ Created users: Admin, Player 1, Player 2, Player 3');

  // 4. Create Initial Sports (dynamically managed by Admin)
  const sportsData = [
    { name: 'Football', description: '11v11 / 7v7 turf & outfield matches', icon: 'Trophy' },
    { name: 'Cricket', description: 'Box cricket and outdoor pitch matches', icon: 'Activity' },
    { name: 'Basketball', description: 'Full court & 3v3 half court sessions', icon: 'Flame' },
    { name: 'Volleyball', description: 'Beach & indoor volleyball matches', icon: 'Target' },
    { name: 'Badminton', description: 'Singles and doubles indoor court games', icon: 'Zap' },
    { name: 'Tennis', description: 'Lawn and clay court tennis games', icon: 'Award' },
    { name: 'Kabaddi', description: 'High intensity athletic team contact sport', icon: 'Shield' },
  ];

  const sportsMap = {};
  for (const s of sportsData) {
    const sport = await prisma.sport.create({
      data: {
        name: s.name,
        description: s.description,
        icon: s.icon,
        createdBy: admin.id,
      },
    });
    sportsMap[s.name] = sport;
  }

  console.log(`✅ Created ${Object.keys(sportsMap).length} dynamic sports.`);

  // 5. Compute Dates for Demo Sessions (2026 future & past relative dates)
  const today = new Date();

  const futureDate1 = new Date(today);
  futureDate1.setDate(today.getDate() + 3);
  const dateStr1 = futureDate1.toISOString().split('T')[0];

  const futureDate2 = new Date(today);
  futureDate2.setDate(today.getDate() + 5);
  const dateStr2 = futureDate2.toISOString().split('T')[0];

  const futureDate3 = new Date(today);
  futureDate3.setDate(today.getDate() + 7);
  const dateStr3 = futureDate3.toISOString().split('T')[0];

  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 4);
  const pastDateStr = pastDate.toISOString().split('T')[0];

  // 6. Create Demo Sport Sessions
  // Session 1: Upcoming Football Match created by Player 1
  const session1 = await prisma.sportSession.create({
    data: {
      sportId: sportsMap['Football'].id,
      createdBy: player1.id,
      date: dateStr1,
      startTime: '17:00',
      venue: 'College Main Ground',
      additionalPlayersNeeded: 5,
      status: 'OPEN',
      participants: {
        create: [
          { userId: player1.id },
          { userId: player2.id },
          { userId: player3.id },
        ],
      },
    },
  });

  // Session 2: Upcoming Cricket Session created by Admin
  const session2 = await prisma.sportSession.create({
    data: {
      sportId: sportsMap['Cricket'].id,
      createdBy: admin.id,
      date: dateStr2,
      startTime: '16:30',
      venue: 'Campus Sports Complex Pitch 1',
      additionalPlayersNeeded: 10,
      status: 'OPEN',
      participants: {
        create: [
          { userId: admin.id },
          { userId: player1.id },
        ],
      },
    },
  });

  // Session 3: Upcoming Basketball 3v3 created by Player 2 (FULL capacity)
  const session3 = await prisma.sportSession.create({
    data: {
      sportId: sportsMap['Basketball'].id,
      createdBy: player2.id,
      date: dateStr3,
      startTime: '18:00',
      venue: 'Student Center Indoor Court A',
      additionalPlayersNeeded: 3, // Total capacity = 4 (creator + 3)
      status: 'FULL',
      participants: {
        create: [
          { userId: player2.id },
          { userId: player1.id },
          { userId: player3.id },
          { userId: admin.id },
        ],
      },
    },
  });

  // Session 4: Cancelled Badminton Session created by Player 1
  const session4 = await prisma.sportSession.create({
    data: {
      sportId: sportsMap['Badminton'].id,
      createdBy: player1.id,
      date: dateStr1,
      startTime: '19:30',
      venue: 'Indoor Court B',
      additionalPlayersNeeded: 3,
      status: 'CANCELLED',
      cancellationReason: 'Badminton court floor undergoing emergency maintenance',
      participants: {
        create: [
          { userId: player1.id },
          { userId: player2.id },
        ],
      },
    },
  });

  // Session 5: Past Completed Volleyball Match
  const session5 = await prisma.sportSession.create({
    data: {
      sportId: sportsMap['Volleyball'].id,
      createdBy: player3.id,
      date: pastDateStr,
      startTime: '15:00',
      venue: 'South Campus Outdoor Sand Court',
      additionalPlayersNeeded: 5,
      status: 'OPEN',
      participants: {
        create: [
          { userId: player3.id },
          { userId: player1.id },
        ],
      },
    },
  });

  console.log('✅ Created demo sessions (Upcoming, Full, Cancelled, and Past).');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
